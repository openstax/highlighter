"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
const dom_1 = require("./dom");
exports.TIMESTAMP_ATTR = 'data-timestamp';
exports.DATA_ATTR = 'data-highlighted';
exports.DATA_ATTR_SELECTOR = '[' + exports.DATA_ATTR + ']';
exports.DATA_ID_ATTR = 'data-highlight-id';
exports.DATA_SCREEN_READERS_ATTR = 'data-for-screenreaders';
exports.DATA_SCREEN_READERS_ATTR_SELECTOR = '[' + exports.DATA_SCREEN_READERS_ATTR + ']';
const NODE_TYPE = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
};
/**
 * Don't highlight content of these tags.
 * @type {string[]}
 */
const IGNORE_TAGS = [
    'SCRIPT', 'STYLE', 'SELECT', 'OPTION', 'BUTTON', 'OBJECT', 'APPLET',
    'AUDIO', 'CANVAS', 'EMBED', 'PARAM', 'METER', 'PROGRESS',
];
/**
 * Highlights can be created around these block and text elements.
 */
const BLOCK_ELEMENTS = ['img', 'iframe'];
const TEXT_ELEMENTS = ['.MathJax', 'mjx-container'];
const ALLOWED_ELEMENTS = BLOCK_ELEMENTS.concat(TEXT_ELEMENTS).join(',');
const isEmptyTextNode = (node) => node.nodeType === NODE_TYPE.TEXT_NODE && node.textContent && !node.textContent.trim().length;
const isImgOrMediaSpan = (node) => node.nodeName === 'IMG' || (node.nodeName === 'SPAN' && node.dataset.type === 'media');
function injectHighlightWrappers(highlight, options = {}) {
    const wrapper = createWrapper(Object.assign({ id: highlight.id, timestamp: Date.now() }, options));
    const createdHighlights = highlightRange(highlight.range, wrapper);
    const normalizedHighlights = normalizeHighlights(highlight, createdHighlights);
    if (normalizedHighlights.length === 0) {
        return;
    }
    highlight.range.setStartBefore(normalizedHighlights[0]);
    highlight.range.setEndAfter(normalizedHighlights[normalizedHighlights.length - 1]);
    highlight.elements = normalizedHighlights;
}
exports.default = injectHighlightWrappers;
/**
 * Create empty span with tabindex=0 and all necessary information taken from @param highlight
 * and insert this node at the first position inside @param element.
 * @param highlight Highlight
 * @param element HTMLElement highlight element for which we will insert the starting or ending element for screenreader
 * @param position start | end
 */
function createAndInsertNodeForScreenReaders(highlight, element, position) {
    const node = document.createElement('span');
    node.setAttribute(exports.DATA_SCREEN_READERS_ATTR, 'true');
    node.setAttribute(exports.DATA_ID_ATTR, highlight.id);
    const message = highlight.getMessage(`i18n:highlighter:highlight:${position}`);
    node.setAttribute('data-message', message);
    if (position === 'start') {
        node.setAttribute('tabindex', highlight.options.tabbable ? '0' : '-1');
        element.prepend(node);
    }
    else {
        element.append(node);
    }
}
/**
 * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
 * wrapping HTML elements.
 * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
 * Adds "first" and "last" classes to the highlights and "text" or "block" class for each highlight depends
 * on the content.
 * @param {Array} highlights - highlights to normalize.
 * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
 * input highlights.
 */
function normalizeHighlights(highlight, highlights) {
    let normalizedHighlights;
    //flattenNestedHighlights(highlights);
    mergeSiblingHighlights(highlights);
    // omit removed nodes
    normalizedHighlights = highlights.filter(function (hl) {
        return hl.parentElement ? hl : null;
    });
    normalizedHighlights = unique(normalizedHighlights);
    normalizedHighlights.sort(function (a, b) {
        if (!a.compareDocumentPosition) {
            // support for IE8 and below
            return a.sourceIndex - b.sourceIndex;
        }
        const position = a.compareDocumentPosition(b);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
            return -1;
        }
        else if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
            return 1;
        }
        else {
            return 0;
        }
    });
    for (const [index, node] of normalizedHighlights.entries()) {
        if (index === 0) {
            node.classList.add('first');
            createAndInsertNodeForScreenReaders(highlight, node, 'start');
        }
        if (hasBlockContent(node)) {
            node.classList.add('block');
        }
        else {
            node.classList.add('text');
        }
        if (index === (normalizedHighlights.length - 1)) {
            node.classList.add('last');
            createAndInsertNodeForScreenReaders(highlight, node, 'end');
        }
    }
    return normalizedHighlights;
}
/**
 * Check if there are block elements inside node.
 * Block elements are: img and iframe.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
function hasBlockContent(node) {
    return !!node.querySelector(BLOCK_ELEMENTS.join(','));
}
/**
 * Highlights range.
 * Wraps text of given range object in wrapper element.
 * @param {Range} range
 * @param {HTMLElement} wrapper
 * @returns {Array} - array of created highlights.
 */
function highlightRange(range, wrapper) {
    if (!range || range.collapsed) {
        return [];
    }
    let result = refineRangeBoundaries(range), startContainer = result.startContainer, endContainer = result.endContainer, goDeeper = result.goDeeper, done = false, node = startContainer, highlights = [], highlight, wrapperClone;
    const highlightNode = (node) => {
        wrapperClone = wrapper.cloneNode(true);
        wrapperClone.setAttribute(exports.DATA_ATTR, 'true');
        highlight = dom_1.default(node).wrap(wrapperClone);
        highlights.push(highlight);
    };
    do {
        if (!node) {
            done = true;
        }
        if (dom_1.default(node).matches(ALLOWED_ELEMENTS)) {
            highlightNode(node);
            goDeeper = false;
        }
        if (goDeeper && node.nodeType === NODE_TYPE.TEXT_NODE) {
            if (IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 && node.nodeValue.trim() !== '') {
                highlightNode(node);
            }
            goDeeper = false;
        }
        if (node === endContainer && !(endContainer.hasChildNodes() && goDeeper)) {
            done = true;
        }
        if (node.tagName && IGNORE_TAGS.indexOf(node.tagName) > -1) {
            if (endContainer.parentNode === node) {
                done = true;
            }
            goDeeper = false;
        }
        if (goDeeper && node.hasChildNodes()) {
            node = node.firstChild;
        }
        else if (!goDeeper && node.contains(endContainer)) {
            // stops traversing of tree if endContainer is a descendent of current allowed node
            // this prevents a bug where the highlighter breaks out of its bounds and scans the remainder of the page
            // (happens when firefox sets the comment inside an iframe as endcontainer)
            done = true;
        }
        else if (node.nextSibling) {
            node = node.nextSibling;
            goDeeper = true;
        }
        else {
            node = node.parentNode;
            goDeeper = false;
        }
    } while (!done);
    return highlights;
}
/**
 * Takes range object as parameter and refines it boundaries
 * @param range
 * @returns {object} refined boundaries and initial state of highlighting algorithm.
 */
function refineRangeBoundaries(range) {
    let startContainer = range.startContainer, endContainer = range.endContainer, ancestor = range.commonAncestorContainer, goDeeper = true;
    if (range.endOffset === 0) {
        while (!endContainer.previousSibling && endContainer.parentNode !== ancestor) {
            endContainer = endContainer.parentNode;
        }
        // use previous sibling for end container unless end container is an img/media span preceded by an empty text node
        // otherwise highlights ending on an img in firefox may not display correctly due to empty text nodes around img element
        if (endContainer.previousSibling && !(isImgOrMediaSpan(endContainer) && isEmptyTextNode(endContainer.previousSibling))) {
            endContainer = endContainer.previousSibling;
        }
    }
    else if (endContainer.nodeType === NODE_TYPE.TEXT_NODE) {
        if (range.endOffset < endContainer.nodeValue.length) {
            endContainer.splitText(range.endOffset);
        }
    }
    else if (range.endOffset > 0) {
        endContainer = endContainer.childNodes.item(range.endOffset - 1);
    }
    if (startContainer.nodeType === NODE_TYPE.TEXT_NODE) {
        if (range.startOffset === startContainer.nodeValue.length) {
            goDeeper = false;
        }
        else if (range.startOffset > 0) {
            startContainer = startContainer.splitText(range.startOffset);
            if (endContainer === startContainer.previousSibling) {
                endContainer = startContainer;
            }
        }
    }
    else if (range.startOffset < startContainer.childNodes.length) {
        startContainer = startContainer.childNodes.item(range.startOffset);
        // use next sibling for start container unless start container is an img/media span followed by an empty text node
        // otherwise highlights starting on an img in firefox may not display correctly due to empty text nodes around img element
    }
    else if (startContainer.nextSibling && !(isImgOrMediaSpan(startContainer) && isEmptyTextNode(startContainer.nextSibling))) {
        startContainer = startContainer.nextSibling;
    }
    // BEGIN this might not be necessary, test removing it
    const getMath = (node) => {
        const mathjax = dom_1.default(node).farthest('.MathJax,mjx-container');
        if (mathjax) {
            return mathjax;
        }
        const mml = dom_1.default(node).farthest('script[type="math/mml"]');
        if (mml && mml.previousSibling.matches('.MathJax,mjx-container')) {
            return mml.previousSibling;
        }
        if (mml && mml.previousSibling.matches('.MathJax_Display')) {
            return mml.previousSibling.querySelector('.MathJax');
        }
        return null;
    };
    const endMath = getMath(endContainer);
    if (endMath) {
        endContainer = endMath;
    }
    const startMath = getMath(startContainer);
    if (startMath) {
        startContainer = startMath;
        goDeeper = false;
    }
    // END this might not be necessary, test removing it
    return {
        startContainer,
        endContainer,
        goDeeper,
    };
}
/**
 * Flattens highlights structure.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param {Array} highlights - highlights to flatten.
 */
// @ts-ignore
function flattenNestedHighlights(highlights) {
    let again;
    sortByDepth(highlights, true);
    function flattenOnce() {
        let again = false;
        highlights.forEach(function (hl, i) {
            const parent = hl.parentElement, parentPrev = parent.previousSibling, parentNext = parent.nextSibling;
            if (isHighlight(parent)) {
                if (!haveSameColor(parent, hl)) {
                    if (!hl.nextSibling) {
                        dom_1.default(hl).insertBefore(parentNext || parent);
                        again = true;
                    }
                    if (!hl.previousSibling) {
                        dom_1.default(hl).insertAfter(parentPrev || parent);
                        again = true;
                    }
                    if (!parent.hasChildNodes()) {
                        dom_1.default(parent).remove();
                    }
                }
                else {
                    parent.replaceChild(hl.firstChild, hl);
                    highlights[i] = parent;
                    again = true;
                }
            }
        });
        return again;
    }
    do {
        again = flattenOnce();
    } while (again);
}
/**
 * Merges sibling highlights and normalizes descendant text nodes.
 * Note: this method changes input highlights - their order and number after calling this method may change.
 * @param highlights
 */
function mergeSiblingHighlights(highlights) {
    function shouldMerge(current, node) {
        return isHighlight(current) && isHighlight(node)
            && current.data && node.data
            && current.data.id === node.data.id;
    }
    highlights.forEach(function (highlight) {
        const prev = highlight.previousSibling, next = highlight.nextSibling;
        if (shouldMerge(highlight, prev)) {
            dom_1.default(highlight).prepend(prev.childNodes);
            dom_1.default(prev).remove();
        }
        if (shouldMerge(highlight, next)) {
            dom_1.default(highlight).append(next.childNodes);
            dom_1.default(next).remove();
        }
        dom_1.default(highlight).normalizeTextNodes();
    });
}
/**
 * Creates wrapper for highlights.
 */
function createWrapper(options) {
    const el = document.createElement('mark');
    el.className = options.className;
    if (options.timestamp) {
        el.setAttribute(exports.TIMESTAMP_ATTR, options.timestamp);
    }
    if (options.id) {
        el.setAttribute(exports.DATA_ID_ATTR, options.id);
    }
    return el;
}
function isHighlight(el) {
    return el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.matches(exports.DATA_ATTR_SELECTOR);
}
function sortByDepth(arr, descending) {
    arr.sort(function (a, b) {
        return dom_1.default(descending ? b : a).parents().length - dom_1.default(descending ? a : b).parents().length;
    });
}
function haveSameColor(_, __) {
    return true;
}
/**
 * Returns array without duplicated values.
 * @param {Array} arr
 * @returns {Array}
 */
function unique(arr) {
    return arr.filter(function (value, idx, self) {
        return self.indexOf(value) === idx;
    });
}
//# sourceMappingURL=injectHighlightWrappers.js.map