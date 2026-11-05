"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = require("./dom");
exports.getRange = (selection) => {
    if (selection.rangeCount < 1) {
        throw new Error('selection had no ranges');
    }
    // set up range to modify
    const range = selection.getRangeAt(0).cloneRange();
    const endRange = selection.getRangeAt(selection.rangeCount - 1);
    range.setEnd(endRange.endContainer, endRange.endOffset);
    return range;
};
const getDirection = (selection) => {
    const anchorNode = selection.anchorNode;
    const anchorOffset = selection.anchorOffset;
    const range = exports.getRange(selection);
    if (anchorNode !== range.startContainer || anchorOffset !== range.startOffset) {
        return 'backward';
    }
    return 'forward';
};
const snapToCode = (range) => {
    const getCode = (node) => dom_1.default(node).farthest('[data-type="code"]');
    const startCode = getCode(range.startContainer.nodeType === 3 /* #text */
        ? range.startContainer
        : range.startContainer.childNodes[range.startOffset] || range.startContainer);
    if (startCode) {
        range.setStartBefore(startCode);
    }
    const endCode = getCode(range.endContainer.nodeType === 3 /* #text */
        ? range.endContainer
        : range.endContainer.childNodes[range.endOffset - 1] || range.endContainer);
    if (endCode) {
        const endContainer = endCode.parentNode;
        range.setEnd(endContainer, Array.prototype.indexOf.call(endContainer.childNodes, endCode) + 1);
    }
};
const snapToMath = (range) => {
    const getMath = (node) => dom_1.default(node).farthest('.MathJax,.MathJax_Display,mjx-container');
    const startMath = getMath(range.startContainer.nodeType === 3 /* #text */
        ? range.startContainer
        : range.startContainer.childNodes[range.startOffset] || range.startContainer);
    if (startMath) {
        range.setStartBefore(startMath);
    }
    const endMath = getMath(range.endContainer.nodeType === 3 /* #text */
        ? range.endContainer
        : range.endContainer.childNodes[range.endOffset - 1] || range.endContainer);
    if (endMath) {
        const endElement = dom_1.default(endMath.nextSibling).matches('script[type="math/mml"]') ? endMath.nextSibling : endMath;
        const endContainer = endElement.parentNode;
        range.setEnd(endContainer, Array.prototype.indexOf.call(endContainer.childNodes, endElement) + 1);
    }
};
exports.snapSelection = (selection, options) => {
    const selectionDirection = getDirection(selection);
    const range = exports.getRange(selection);
    if (!range) {
        return;
    }
    if (options.snapTableRows) {
        if (['TBODY', 'TR'].indexOf(range.commonAncestorContainer.nodeName) > -1) {
            const startRow = dom_1.default(range.startContainer).farthest('tr');
            const endRow = dom_1.default(range.endContainer).farthest('tr');
            if (startRow) {
                range.setStartBefore(startRow.firstElementChild.firstChild);
            }
            if (endRow) {
                range.setEndAfter(endRow.lastElementChild.lastChild);
            }
        }
    }
    if (options.snapCode) {
        snapToCode(range);
    }
    if (options.snapMathJax) {
        snapToMath(range);
    }
    if (options.snapWords) {
        const shouldGobbleCharacter = (container, targetOffset) => targetOffset >= 0 && container.length >= targetOffset && /\S/.test(container.substr(targetOffset, 1));
        const shouldGobbleBackward = () => {
            return range.startContainer.textContent &&
                // ensure range of selection overlaps with startContainer before gobbling
                // fixes firefox behavior that prevented starting highlights on images
                range.startOffset < range.startContainer.textContent.length &&
                shouldGobbleCharacter(range.startContainer.textContent, range.startOffset - 1);
        };
        const shouldGobbleForward = () => {
            return range.endContainer.textContent &&
                // ensure range of selection overlaps with endContainer before gobbling
                // fixes firefox behavior that prevented ending highlights on images
                range.endOffset > 0 &&
                shouldGobbleCharacter(range.endContainer.textContent, range.endOffset);
        };
        const gobbleBackward = () => {
            range.setStart(range.startContainer, range.startOffset - 1);
        };
        const gobbleForward = () => {
            range.setEnd(range.endContainer, range.endOffset + 1);
        };
        if (range.startContainer.nodeName === '#text') {
            while (shouldGobbleBackward()) {
                gobbleBackward();
            }
        }
        if (range.endContainer.nodeName === '#text') {
            while (shouldGobbleForward()) {
                gobbleForward();
            }
        }
    }
    if (selectionDirection === 'backward') {
        // https://stackoverflow.com/a/10705853
        const endRange = range.cloneRange();
        endRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(endRange);
        selection.extend(range.startContainer, range.startOffset);
        return range;
    }
    selection.removeAllRanges();
    selection.addRange(range);
    return range;
};
//# sourceMappingURL=selection.js.map