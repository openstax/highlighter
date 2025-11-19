"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = require("./dom");
const removeHighlightWrappers_1 = require("./removeHighlightWrappers");
exports.rangeContentsString = (range) => {
    const fragment = exports.cloneRangeContents(range);
    const container = document.createElement('div');
    const removeAll = (nodes) => nodes.forEach((element) => element.remove());
    container.appendChild(fragment);
    // MathJax 2
    removeAll(container.querySelectorAll('.MathJax'));
    removeAll(container.querySelectorAll('.MathJax_Display'));
    removeAll(container.querySelectorAll('.MathJax_Preview'));
    removeAll(container.querySelectorAll('.MJX_Assistive_MathML'));
    // MathJax 4
    removeAll(container.querySelectorAll('mjx-container'));
    removeHighlightWrappers_1.removeAllHighlights(container);
    container.querySelectorAll('script[type="math/mml"]').forEach((element) => {
        const template = document.createElement('template');
        template.innerHTML = element.textContent || '';
        const math = template.content.firstChild;
        if (math && element.parentElement) {
            element.parentElement.insertBefore(math, element);
            element.remove();
        }
    });
    return container.innerHTML;
};
exports.cloneRangeContents = (range) => {
    const tableTags = ['TR', 'TBODY', 'TABLE'];
    const fragment = document.createDocumentFragment();
    const getStartNode = () => {
        if (range.commonAncestorContainer.nodeType === 3 /* #text */) {
            return range.commonAncestorContainer.parentNode;
        }
        else if (tableTags.indexOf(range.commonAncestorContainer.nodeName) > -1) {
            return dom_1.default(range.commonAncestorContainer).closest('table').parentNode;
        }
        else {
            return range.commonAncestorContainer;
        }
    };
    cloneForRange(getStartNode(), range).childNodes.forEach((node) => fragment.appendChild(node.cloneNode(true)));
    return fragment;
};
function cloneForRange(element, range, foundStart = false) {
    const isStart = (node) => node.parentElement === range.startContainer
        && Array.prototype.indexOf.call(range.startContainer.childNodes, node) === range.startOffset;
    const isEnd = (node) => node.parentElement === range.endContainer
        && Array.prototype.indexOf.call(range.endContainer.childNodes, node) === range.endOffset;
    const result = element.cloneNode();
    if (element.nodeType === 3 /* #text */) {
        if (element === range.startContainer && element === range.endContainer) {
            result.textContent = (element.textContent || '').substring(range.startOffset, range.endOffset + 1);
        }
        else if (element === range.startContainer) {
            result.textContent = (element.textContent || '').substring(range.startOffset);
        }
        else if (element === range.endContainer) {
            result.textContent = (element.textContent || '').substring(0, range.endOffset);
        }
        else {
            result.textContent = element.textContent;
        }
    }
    else {
        let node = element.firstChild;
        let foundEnd;
        while (node && !isEnd(node) && !foundEnd) {
            foundStart = foundStart || isStart(node);
            foundEnd = dom_1.default(node).isParent(range.endContainer);
            if (foundStart && !foundEnd) {
                const copy = node.cloneNode(true);
                result.appendChild(copy);
            }
            else if (foundStart || dom_1.default(node).isParent(range.startContainer)) {
                const copy = cloneForRange(node, range, foundStart);
                result.appendChild(copy);
                foundStart = true;
            }
            node = node.nextSibling;
        }
    }
    return result;
}
//# sourceMappingURL=rangeContents.js.map