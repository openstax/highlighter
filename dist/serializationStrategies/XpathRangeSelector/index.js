"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xpath_1 = require("./xpath");
exports.discriminator = 'XpathRangeSelector';
function serialize(range, referenceElement) {
    const [endContainer, endOffset] = xpath_1.getXPathForElement(range.endContainer, range.endOffset, referenceElement);
    const [startContainer, startOffset] = xpath_1.getXPathForElement(range.startContainer, range.startOffset, referenceElement);
    return {
        endContainer,
        endOffset,
        referenceElementId: referenceElement.id,
        startContainer,
        startOffset,
        type: exports.discriminator,
    };
}
exports.serialize = serialize;
function isLoadable(highlighter, data) {
    const referenceElement = highlighter.getReferenceElement(data.referenceElementId);
    if (!referenceElement) {
        return false;
    }
    const [startContainer] = xpath_1.getFirstByXPath(data.startContainer, data.startOffset, referenceElement);
    const [endContainer] = xpath_1.getFirstByXPath(data.endContainer, data.endOffset, referenceElement);
    return !!startContainer && !!endContainer;
}
exports.isLoadable = isLoadable;
function load(highlighter, data) {
    const range = highlighter.document.createRange();
    const referenceElement = highlighter.getReferenceElement(data.referenceElementId);
    const [startContainer, startOffset] = xpath_1.getFirstByXPath(data.startContainer, data.startOffset, referenceElement);
    const [endContainer, endOffset] = xpath_1.getFirstByXPath(data.endContainer, data.endOffset, referenceElement);
    if (startContainer && endContainer) {
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
    }
    return range;
}
exports.load = load;
//# sourceMappingURL=index.js.map