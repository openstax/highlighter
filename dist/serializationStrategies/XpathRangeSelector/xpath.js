"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
const injectHighlightWrappers_1 = require("../../injectHighlightWrappers");
const findNonTextChild = (node) => Array.prototype.find.call(node.childNodes, (node) => node.nodeType === Node.ELEMENT_NODE && !isTextHighlightOrScreenReaderNode(node));
const isHighlight = (node) => !!node && node.getAttribute && node.getAttribute(injectHighlightWrappers_1.DATA_ATTR) !== null;
const isHighlightOrScreenReaderNode = (node) => isHighlight(node) || isScreenReaderNode(node);
const isTextHighlight = (node) => isHighlight(node) && !findNonTextChild(node);
const isTextHighlightOrScreenReaderNode = (node) => (isHighlight(node) || isScreenReaderNode(node)) && !findNonTextChild(node);
const isText = (node) => !!node && node.nodeType === 3;
const isTextOrTextHighlight = (node) => isText(node) || isTextHighlight(node);
const isTextOrTextHighlightOrScreenReaderNode = (node) => isText(node) || isTextHighlightOrScreenReaderNode(node) || isScreenReaderNode(node);
const isElement = (node) => node && node.nodeType === 1;
const isElementNotHighlight = (node) => isElement(node) && !isHighlight(node);
const nodeIndex = (list, element) => Array.prototype.indexOf.call(list, element);
const isScreenReaderNode = (node) => !!node && isElement(node) && node.getAttribute(injectHighlightWrappers_1.DATA_SCREEN_READERS_ATTR) !== null;
const IS_PATH_PART_SELF = /^\.$/;
const IS_PATH_PART_TEXT = /^text\(\)\[(\d+)\]$/;
const IS_PATH_PART_ELEMENT = /\*\[name\(\)='(.+)'\]\[(\d+)\]/;
const getTextLength = (node) => {
    if (isText(node)) {
        return node.length;
    }
    else if (node && node.textContent) {
        return node.textContent.length;
    }
    else {
        return 0;
    }
};
const getMaxOffset = (node) => {
    if (isText(node)) {
        return node.length;
    }
    else {
        return node.childNodes.length;
    }
};
const recurseBackwardsThroughText = (current, container, resultOffset) => {
    // we don't count the current, we count the previous
    const previous = current.previousSibling;
    if (previous && isTextOrTextHighlightOrScreenReaderNode(previous)) {
        return recurseBackwardsThroughText(previous, container, resultOffset + getTextLength(previous));
    }
    else if (current.parentNode && isTextHighlightOrScreenReaderNode(current.parentNode)) {
        return recurseBackwardsThroughText(current.parentNode, container, resultOffset);
    }
    else {
        return [current, resultOffset];
    }
};
const resolveTextHighlightsToTextOffset = (element, offset, container) => {
    // this won't catch things that are right at the tail of the container, which is good, because we
    // want to contiue using element offset if possible
    if (isElement(element) && isTextOrTextHighlightOrScreenReaderNode(element.childNodes[offset])) {
        return recurseBackwardsThroughText(element.childNodes[offset], container, 0);
        // however, if the element, is a highlgiht, then we should float
    }
    else if (isTextHighlightOrScreenReaderNode(element)) {
        return recurseBackwardsThroughText(element, container, getTextLength(element));
        // preserve the offset if the elment is text
    }
    else if (isText(element)) {
        return recurseBackwardsThroughText(element, container, offset);
    }
    else {
        return [element, offset];
    }
};
const floatThroughText = (element, offset, container) => {
    if (isTextOrTextHighlightOrScreenReaderNode(element) && offset === 0 && element.parentNode && element.parentNode !== container) {
        return floatThroughText(element.parentNode, nodeIndex(element.parentNode.childNodes, element), container);
    }
    else if (isTextOrTextHighlightOrScreenReaderNode(element) && offset === getMaxOffset(element) && element.parentNode && element.parentNode !== container) {
        return floatThroughText(element.parentNode, nodeIndex(element.parentNode.childNodes, element) + 1, container);
    }
    else if (isTextOrTextHighlight(element)
        && (offset + 1) === getMaxOffset(element)
        && isElement(element.childNodes[offset])
        && isScreenReaderNode(element.childNodes[offset])
        && element.parentNode
        && element.parentNode !== container) {
        return floatThroughText(element.parentNode, nodeIndex(element.parentNode.childNodes, element) + 1, container);
    }
    else {
        return [element, offset];
    }
};
const resolveToNextElementOffsetIfPossible = (element, offset) => {
    if (isTextOrTextHighlightOrScreenReaderNode(element) && element.parentNode && offset === getMaxOffset(element) && (!element.nextSibling || !isHighlightOrScreenReaderNode(element.nextSibling))) {
        return [element.parentNode, nodeIndex(element.parentNode.childNodes, element) + 1];
    }
    return [element, offset];
};
const resolveToPreviousElementOffsetIfPossible = (element, offset) => {
    if (isTextOrTextHighlightOrScreenReaderNode(element) && element.parentNode && offset === 0 && (!element.previousSibling || !isHighlightOrScreenReaderNode(element.previousSibling))) {
        return [element.parentNode, nodeIndex(element.parentNode.childNodes, element)];
    }
    return [element, offset];
};
// kinda copied from https://developer.mozilla.org/en-US/docs/Web/XPath/Snippets#getXPathForElement
function getXPathForElement(targetElement, offset, reference) {
    [targetElement, offset] = floatThroughText(targetElement, offset, reference);
    [targetElement, offset] = resolveToNextElementOffsetIfPossible(targetElement, offset);
    [targetElement, offset] = resolveTextHighlightsToTextOffset(targetElement, offset, reference);
    [targetElement, offset] = resolveToPreviousElementOffsetIfPossible(targetElement, offset);
    let xpath = '';
    let pos, element = targetElement.previousSibling, focus = targetElement;
    // for element targets, highlight children might be artifically
    // inflating the range offset, fix.
    if (isElement(focus)) {
        let search = focus.childNodes[offset - 1];
        while (search) {
            if (isTextOrTextHighlight(search)) {
                search = search.previousSibling;
                while (isTextOrTextHighlight(search)) {
                    offset--;
                    search = search.previousSibling;
                }
            }
            search = search ? search.previousSibling : null;
        }
    }
    while (focus !== reference) {
        pos = 1;
        while (element) {
            // highlights in text change the number of nodes in the nodelist,
            // compensate by gobbling adjacent highlights and text
            if (isTextOrTextHighlightOrScreenReaderNode(focus) && isTextOrTextHighlightOrScreenReaderNode(element)) {
                while (isTextOrTextHighlightOrScreenReaderNode(element)) {
                    element = element.previousSibling;
                }
                pos += 1;
            }
            else {
                if (isElementNotHighlight(focus) && isElementNotHighlight(element) && element.nodeName === focus.nodeName) {
                    pos += 1;
                }
                element = element.previousSibling;
            }
        }
        if (isText(focus) || isTextHighlightOrScreenReaderNode(focus)) {
            xpath = 'text()[' + pos + ']' + '/' + xpath;
        }
        else if (!isHighlightOrScreenReaderNode(focus)) {
            xpath = '*[name()=\'' + focus.nodeName.toLowerCase() + '\'][' + pos + ']' + '/' + xpath;
        }
        focus = focus.parentNode;
        element = focus.previousSibling;
    }
    xpath = './' + xpath;
    xpath = xpath.replace(/\/$/, '');
    return [xpath, offset];
}
exports.getXPathForElement = getXPathForElement;
function getFirstByXPath(path, offset, referenceElement) {
    const parts = path.split('/');
    let node = referenceElement;
    let part = parts.shift();
    while (node && part) {
        node = followPart(node, part);
        part = parts.shift();
    }
    // the part following is greedy, so walk back to the first matching
    // textish node before computing offset
    while (isTextOrTextHighlightOrScreenReaderNode(node) && isTextOrTextHighlightOrScreenReaderNode(node.previousSibling)) {
        node = node.previousSibling;
    }
    // highligts split up text nodes that should be treated as one, iterate through
    // until we find the text node that the offset specifies, modifying the offset
    // as we go. prefer leaving highlights if we have the option to deal with
    // adjacent highlights.
    while ((isTextHighlightOrScreenReaderNode(node) && offset >= node.textContent.length) || (isText(node) && offset > node.textContent.length)) {
        offset -= node.textContent.length;
        node = isTextOrTextHighlightOrScreenReaderNode(node.nextSibling) ? node.nextSibling : null;
    }
    // for element targets, highlight children might be artifically
    // inflating the range offset, fix.
    if (node && isElement(node)) {
        let search = node.childNodes[0];
        let offsetElementsFound = 0;
        let modifyOffset = 0;
        while (search && offsetElementsFound < offset) {
            offsetElementsFound++;
            if (isTextOrTextHighlightOrScreenReaderNode(search)) {
                search = search.nextSibling;
                while (isTextOrTextHighlightOrScreenReaderNode(search)) {
                    modifyOffset++;
                    search = search.nextSibling;
                }
            }
            else {
                search = search.nextSibling;
            }
        }
        offset += modifyOffset;
    }
    if (node && isHighlightOrScreenReaderNode(node)) {
        node = null;
    }
    if (isElement(node) && node.childNodes.length < offset) {
        node = null;
    }
    return [node, offset];
}
exports.getFirstByXPath = getFirstByXPath;
function followPart(node, part) {
    const findFirst = (nodeList, predicate) => Array.prototype.find.call(nodeList, (node) => predicate(node));
    const findFirstAfter = (nodeList, afterThis, predicate) => findFirst(Array.prototype.slice.call(nodeList, Array.prototype.indexOf.call(nodeList, afterThis) + 1), predicate);
    if (IS_PATH_PART_SELF.test(part)) {
        return node;
    }
    if (IS_PATH_PART_TEXT.test(part)) {
        let [, index] = part.match(IS_PATH_PART_TEXT);
        let text = findFirst(node.childNodes, isTextOrTextHighlightOrScreenReaderNode);
        while (text && index > 1) {
            let search = text;
            while (isTextOrTextHighlightOrScreenReaderNode(search)) {
                search = search.nextSibling;
            }
            index--;
            if (search) {
                text = findFirstAfter(node.childNodes, search, isTextOrTextHighlightOrScreenReaderNode);
            }
            else {
                text = search;
            }
        }
        return text;
    }
    if (IS_PATH_PART_ELEMENT.test(part)) {
        let [, type, index] = part.match(IS_PATH_PART_ELEMENT);
        const nodeMatches = (node) => isElement(node) && node.nodeName.toLowerCase() === type.toLowerCase() && !isHighlightOrScreenReaderNode(node);
        let element = findFirst(node.childNodes, nodeMatches);
        while (element && index > 1) {
            index--;
            element = findFirstAfter(node.childNodes, element, nodeMatches);
        }
        return element;
    }
}
//# sourceMappingURL=xpath.js.map