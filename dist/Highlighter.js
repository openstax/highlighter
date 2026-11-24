"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const dom_1 = require("./dom");
const Highlight_1 = require("./Highlight");
const injectHighlightWrappers_1 = require("./injectHighlightWrappers");
const rangeContents_1 = require("./rangeContents");
const removeHighlightWrappers_1 = require("./removeHighlightWrappers");
const selection_1 = require("./selection");
const SerializedHighlight_1 = require("./SerializedHighlight");
exports.ON_SELECT_DELAY = 300;
const NON_SELECTING_CONTROLS = 'button, input, select, textarea, [role="button"]';
const isElement = (node) => node.nodeType === 1;
class Highlighter {
    constructor(container, options) {
        this.highlights = {};
        // Copies, because the ranges themselves are the browser selection's live range, which can change in place
        this.reportedRange = null; // last range passed to onSelect
        this.snappedRange = null; // last range snapping put into the selection
        this.lastMouseDown = null; // read at mouseup, after every mousedown listener has run
        this.eraseAll = () => {
            this.getHighlights().forEach(this.erase);
        };
        this.teardown = () => {
            this.eraseAll();
            this.unmount();
        };
        this.erase = (highlight) => {
            removeHighlightWrappers_1.default(highlight);
            delete this.highlights[highlight.id];
        };
        this.snapSelection = () => {
            const selection = this.document.getSelection();
            if (!selection || selection.isCollapsed) {
                return;
            }
            const range = selection_1.snapSelection(selection, this.options);
            this.snappedRange = range ? range.cloneRange() : null;
            return range;
        };
        // Created in the constructor
        this.debouncedSnapSelection = () => undefined;
        // Created in the constructor
        this.debouncedOnSelect = () => undefined;
        this.onSelectionChange = () => {
            const selection = this.document.getSelection();
            if (!selection
                || selection.isCollapsed
                || selection.type === 'None'
                || !dom_1.default(this.container).contains(selection.anchorNode)
                || !dom_1.default(this.container).contains(selection.focusNode)) {
                // The selection is gone, so selecting the same text again should be reported as a new selection
                this.reportedRange = null;
                this.snappedRange = null;
                return;
            }
            // Snapping replaces the selection, which fires selectionchange again, so skip a selection that is
            // already snapped or it would be snapped over and over
            if (this.compareRanges(selection_1.getRange(selection), this.snappedRange)
                || window.matchMedia('not all and (pointer: fine), (hover: none)').matches // noop for touch devices
            ) {
                return;
            }
            this.debouncedSnapSelection();
        };
        this.onClickHandler = (event) => {
            this.onClick(event);
        };
        this.onFocusHandler = (type) => (ev) => {
            const handler = type === 'in' ? this.options.onFocusIn : this.options.onFocusOut;
            if (!handler) {
                return;
            }
            const highlightId = dom_1.isHtmlElement(ev.target) && ev.target.hasAttribute(injectHighlightWrappers_1.DATA_SCREEN_READERS_ATTR)
                ? ev.target.getAttribute(injectHighlightWrappers_1.DATA_ID_ATTR)
                : null;
            const highlight = highlightId ? this.getHighlight(highlightId) : null;
            if (highlight) {
                handler(highlight);
            }
        };
        // Capture phase, so a handler that stops propagation cannot hide the event. Its defaultPrevented value is read later.
        this.onMouseDown = (event) => {
            this.lastMouseDown = event;
        };
        // A double or triple click re-selects text even when it is the same text as before (e.g. double-clicking the same
        // word again after dismissing its card with Esc). Other mouse releases can leave the selection untouched, so they
        // must not repeat a report.
        this.onMouseUp = (event) => {
            this.onSelect(this.isReselection(event));
        };
        // keyup fires for many reasons other than selecting text (e.g. Tab moving focus), so don't repeat a report
        this.onKeyUp = () => {
            this.onSelect(false);
        };
        this.onSelect = (reportRepeat) => {
            const { onSelect } = this.options;
            const selection = document.getSelection();
            if (!selection
                || !dom_1.default(this.container).contains(selection.anchorNode)
                || !dom_1.default(this.container).contains(selection.focusNode)) {
                return;
            }
            const range = this.snapSelection();
            if (range && !reportRepeat && this.compareRanges(range, this.reportedRange)) {
                return;
            }
            this.reportedRange = range ? range.cloneRange() : null;
            if (onSelect && range) {
                const highlights = Object.values(this.highlights)
                    .filter((other) => other.intersects(range));
                if (highlights.length === 0) {
                    const highlight = new Highlight_1.default(range, { content: rangeContents_1.rangeContentsString(range) }, this.getHighlightOptions());
                    onSelect(highlights, highlight);
                }
                else {
                    onSelect(highlights);
                }
            }
        };
        this.container = container;
        this.options = Object.assign({ className: 'highlight', onFocusIn: (highlight) => {
                this.clearFocusedStyles();
                highlight.addFocusedStyles();
            }, onFocusOut: () => {
                this.clearFocusedStyles();
            }, tabbable: true }, options);
        this.debouncedSnapSelection = lodash_1.debounce(this.snapSelection, exports.ON_SELECT_DELAY);
        this.debouncedOnSelect = lodash_1.debounce(this.onKeyUp, exports.ON_SELECT_DELAY);
        this.focusInHandler = this.onFocusHandler('in');
        this.focusOutHandler = this.onFocusHandler('out');
        this.container.addEventListener('click', this.onClickHandler);
        document.addEventListener('selectionchange', this.onSelectionChange);
        this.container.addEventListener('keyup', this.debouncedOnSelect);
        this.container.addEventListener('mousedown', this.onMouseDown, true);
        this.container.addEventListener('mouseup', this.onMouseUp);
        this.container.addEventListener('focusin', this.focusInHandler);
        this.container.addEventListener('focusout', this.focusOutHandler);
    }
    unmount() {
        this.container.removeEventListener('click', this.onClickHandler);
        document.removeEventListener('selectionchange', this.onSelectionChange);
        this.container.removeEventListener('keyup', this.debouncedOnSelect);
        this.container.removeEventListener('mousedown', this.onMouseDown, true);
        this.container.removeEventListener('mouseup', this.onMouseUp);
        this.container.removeEventListener('focusin', this.focusInHandler);
        this.container.removeEventListener('focusout', this.focusOutHandler);
    }
    highlight(highlight) {
        if (highlight instanceof SerializedHighlight_1.default && highlight.isLoadable(this)) {
            return this.highlight(highlight.load(this));
        }
        else if (highlight instanceof Highlight_1.default) {
            this.highlights[highlight.id] = highlight;
            injectHighlightWrappers_1.default(highlight, this.options);
        }
    }
    getHighlight(id) {
        return this.highlights[id];
    }
    getReferenceElement(id) {
        return this.container.querySelector(`[id="${id}"]`);
    }
    getHighlightFromElement(el) {
        const highlightId = el.getAttribute('data-highlight-id');
        if (!highlightId) {
            return null;
        }
        return this.getHighlight(highlightId);
    }
    clearFocusedStyles() {
        this.container.querySelectorAll(`.${this.options.className}[aria-current]`)
            .forEach((el) => {
            el.removeAttribute('aria-current');
            const highlight = this.getHighlightFromElement(el);
            if (!highlight) {
                return;
            }
            highlight.updateStartMarker(el, 'start');
        });
    }
    getHighlights() {
        return Object.values(this.highlights);
    }
    getHighlightOptions() {
        const { formatMessage, skipIDsBy, tabbable } = this.options;
        return {
            formatMessage,
            skipIDsBy,
            tabbable,
        };
    }
    getOrderedHighlights() {
        const highlights = Object.values(this.highlights);
        highlights.sort((a, b) => {
            return a.range.compareBoundaryPoints(Range.START_TO_START, b.range);
        });
        return highlights;
    }
    getHighlightBefore(target) {
        return this.getOrderedHighlights().filter((highlight) => highlight.id !== target.id &&
            highlight.range.compareBoundaryPoints(Range.START_TO_START, target.range) < 0).pop();
    }
    getHighlightAfter(target) {
        return this.getOrderedHighlights().filter((highlight) => highlight.id !== target.id &&
            highlight.range.compareBoundaryPoints(Range.START_TO_START, target.range) >= 0).shift();
    }
    get document() {
        if (!this.container.ownerDocument) {
            throw new Error('highlighter container is not mounted to a document!');
        }
        return this.container.ownerDocument;
    }
    setSnapValues(value) {
        this.options.snapCode = value;
        this.options.snapTableRows = value;
        this.options.snapMathJax = value;
        this.options.snapWords = value;
    }
    onClick(event) {
        const { onClick } = this.options;
        let target = event.target;
        if (!onClick) {
            return;
        }
        if (dom_1.default(target).isHtmlElement) {
            target = dom_1.default(target);
            while (target.isHtmlElement) {
                if (target.el.getAttribute(injectHighlightWrappers_1.DATA_ATTR)) {
                    // there may be multiple highlighters active on the same document,
                    // check if the found highlight is known to this instance
                    const highlight = this.highlights[target.el.getAttribute(injectHighlightWrappers_1.DATA_ID_ATTR)];
                    if (highlight) {
                        onClick(highlight, event);
                        return;
                    }
                }
                target = dom_1.default(target.el.parentElement);
            }
        }
        onClick(undefined, event);
    }
    isReselection(event) {
        return event.button === 0
            && event.detail > 1
            && !(this.lastMouseDown && this.lastMouseDown.defaultPrevented)
            && this.canSelectTextAt(event.target);
    }
    // False for a button or other control, and for text with user-select: none, where a click selects nothing.
    // The nearest explicit user-select value wins, including one above the container, so text can opt back in
    // inside an unselectable wrapper. The target can be an SVG element, which is why this does not use isHtmlElement.
    canSelectTextAt(target) {
        let node = target;
        let insideContainer = true;
        let selectable;
        while (node) {
            if (isElement(node)) {
                if (insideContainer && node.matches(NON_SELECTING_CONTROLS)) {
                    return false;
                }
                if (selectable === undefined) {
                    const style = window.getComputedStyle(node);
                    const value = style.userSelect || style.webkitUserSelect;
                    if (value && value !== 'auto') {
                        selectable = value !== 'none';
                    }
                }
            }
            if (node === this.container) {
                insideContainer = false;
            }
            // above the container only user-select matters, so stop as soon as it is known
            if (!insideContainer && selectable !== undefined) {
                break;
            }
            node = node.parentNode;
        }
        return selectable !== false;
    }
    compareRanges(range1, range2) {
        if (range1 === null && range2 === null) {
            return true;
        }
        if (range1 === null && range2) {
            return false;
        }
        if (range2 === null && range1) {
            return false;
        }
        return range1.compareBoundaryPoints(Range.START_TO_START, range2) === 0
            && range1.compareBoundaryPoints(Range.END_TO_END, range2) === 0;
    }
}
exports.default = Highlighter;
//# sourceMappingURL=Highlighter.js.map