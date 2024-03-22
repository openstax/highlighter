"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
const dom_1 = require("./dom");
const injectHighlightWrappers_1 = require("./injectHighlightWrappers");
const SerializedHighlight_1 = require("./SerializedHighlight");
class Highlight {
    constructor(range, data, options) {
        this._elements = [];
        this.range = range;
        this.options = options;
        this.data = Object.assign({}, data, { id: data.id || uuid() });
    }
    get id() {
        return this.data.id;
    }
    get content() {
        return this.data.content;
    }
    set elements(elements) {
        if (this.elements.length > 0) {
            throw new Error(`Hightlight elements aren't reloadable`);
        }
        this._elements = elements;
        this.loadStyle();
    }
    get elements() {
        return this._elements;
    }
    getMessage(id) {
        return this.options.formatMessage({ id }, { style: this.data.style });
    }
    setStyle(style) {
        this.removeStyle();
        this.data.style = style;
        this.loadStyle();
    }
    getStyle() {
        return this.data.style;
    }
    removeStyle() {
        const { style } = this.data;
        if (style) {
            this.elements.forEach((element) => element.classList.remove(style));
            delete this.data.style;
        }
    }
    isAttached() {
        // TODO - check and see if these are in the dom
        return this.elements.length > 0;
    }
    scrollTo(handler) {
        if (!this.isAttached()) {
            return this;
        }
        else if (handler) {
            handler(this.elements);
        }
        else {
            this.elements[0].scrollIntoView();
        }
        return this;
    }
    updateStartMarker(el, position) {
        el.dataset.startMessage = this.getMessage(`i18n:highlighter:highlight:${position}`);
    }
    addFocusedStyles() {
        this.elements.forEach((el) => {
            el.setAttribute('aria-current', 'true');
            this.updateStartMarker(el, 'start-selected');
        });
        return this;
    }
    /**
     * Move focus to the first element of this highlight.
     * @return boolean indicating if the action was a success.
     */
    focus() {
        const focusableElement = this.elements[0].querySelector(injectHighlightWrappers_1.DATA_SCREEN_READERS_ATTR_SELECTOR);
        if (focusableElement) {
            focusableElement.focus();
            return true;
        }
        return false;
    }
    intersects(range) {
        if (!range) {
            return false;
        }
        return this.range.compareBoundaryPoints(Range.START_TO_END, range) !== -1
            && this.range.compareBoundaryPoints(Range.END_TO_START, range) !== 1;
    }
    serialize(referenceElement) {
        const validReferenceElement = this.getValidReferenceElement(referenceElement);
        if (!validReferenceElement) {
            throw new Error('reference element not found');
        }
        return new SerializedHighlight_1.default(Object.assign({}, this.data, SerializedHighlight_1.default.defaultSerializer(this.range, validReferenceElement)));
    }
    loadStyle() {
        const { style } = this.data;
        if (style) {
            this.elements.forEach((element) => element.classList.add(style));
        }
    }
    checkReferenceElement(referenceElement) {
        if (!referenceElement || !referenceElement.id) {
            return false;
        }
        if (!this.options.skipIDsBy) {
            return true;
        }
        else {
            return !this.options.skipIDsBy.test(referenceElement.id);
        }
    }
    getValidReferenceElement(referenceElement) {
        if (!referenceElement) {
            referenceElement = dom_1.default(this.range.commonAncestorContainer).closest('[id]');
        }
        const parentElement = referenceElement && referenceElement.parentElement;
        if (this.checkReferenceElement(referenceElement)) {
            return referenceElement;
        }
        else if (parentElement) {
            const nextReferenceElement = dom_1.default(parentElement).closest('[id]');
            return this.getValidReferenceElement(nextReferenceElement);
        }
        else {
            return null;
        }
    }
}
exports.default = Highlight;
//# sourceMappingURL=Highlight.js.map