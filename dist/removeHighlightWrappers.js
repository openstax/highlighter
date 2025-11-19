"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
const dom_1 = require("./dom");
const injectHighlightWrappers_1 = require("./injectHighlightWrappers");
const NODE_TYPE = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
};
/**
 * Removes highlights from element. If element is a highlight itself, it is removed as well.
 * If no element is given, all highlights all removed.
 * @param {HTMLElement} [element] - element to remove highlights from
 */
function removeAllHighlights(element) {
    getHighlights(element).forEach(removeHighlightElement);
}
exports.removeAllHighlights = removeAllHighlights;
function default_1(highlight) {
    highlight.elements.forEach(removeHighlightElement);
}
exports.default = default_1;
function removeHighlightElement(element) {
    getScreenReaderLabels(element).forEach((label) => label.remove());
    const container = element, highlights = getHighlights(container);
    function mergeSiblingTextNodes(textNode) {
        const prev = textNode.previousSibling, next = textNode.nextSibling;
        if (prev && prev.nodeType === NODE_TYPE.TEXT_NODE) {
            textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
            dom_1.default(prev).remove();
        }
        if (next && next.nodeType === NODE_TYPE.TEXT_NODE) {
            textNode.nodeValue = textNode.nodeValue + next.nodeValue;
            dom_1.default(next).remove();
        }
    }
    function removeHighlight(highlight) {
        const textNodes = dom_1.default(highlight).unwrap();
        textNodes.forEach(function (node) {
            mergeSiblingTextNodes(node);
        });
    }
    sortByDepth(highlights, true);
    highlights.forEach(removeHighlight);
}
/**
 * Returns highlights from given container.
 * @param {HTMLElement} container - return highlights from this element
 * @returns {Array} - array of highlights.
 */
function getHighlights(container) {
    const nodeList = container.querySelectorAll(injectHighlightWrappers_1.DATA_ATTR_SELECTOR), highlights = Array.prototype.slice.call(nodeList);
    if (container.matches(injectHighlightWrappers_1.DATA_ATTR_SELECTOR)) {
        highlights.push(container);
    }
    return highlights;
}
/**
 * Returns screenreader labels from given container.
 * @param {HTMLElement} container - return nodes created for screenreder from this element
 * @returns {Array} - array of screenreader HTMLElements.
 */
function getScreenReaderLabels(container) {
    const nodeList = container.querySelectorAll(injectHighlightWrappers_1.DATA_SCREEN_READERS_ATTR_SELECTOR), screenreaderLabels = Array.prototype.slice.call(nodeList);
    if (container.matches(injectHighlightWrappers_1.DATA_SCREEN_READERS_ATTR_SELECTOR)) {
        screenreaderLabels.push(container);
    }
    return screenreaderLabels;
}
/**
 * Sorts array of DOM elements by its depth in DOM tree.
 * @param {HTMLElement[]} arr - array to sort.
 * @param {boolean} descending - order of sort.
 */
function sortByDepth(arr, descending) {
    arr.sort(function (a, b) {
        return dom_1.default(descending ? b : a).parents().length - dom_1.default(descending ? a : b).parents().length;
    });
}
//# sourceMappingURL=removeHighlightWrappers.js.map