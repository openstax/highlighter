"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_selection_1 = require("serialize-selection");
exports.discriminator = 'TextPositionSelector';
function serialize(range, referenceElement) {
    // modified copy/paste out of 'serialize-selection' module
    const cloneRange = range.cloneRange();
    const startContainer = cloneRange.startContainer;
    const startOffset = cloneRange.startOffset;
    const contentLength = cloneRange.toString().length;
    cloneRange.selectNodeContents(referenceElement);
    cloneRange.setEnd(startContainer, startOffset);
    return {
        end: cloneRange.toString().length + contentLength,
        referenceElementId: referenceElement.id,
        start: cloneRange.toString().length,
        type: exports.discriminator,
    };
}
exports.serialize = serialize;
function isLoadable(highlighter, data) {
    return !!highlighter.document.getElementById(data.referenceElementId);
}
exports.isLoadable = isLoadable;
function load(highlighter, data) {
    const referenceElement = highlighter.getReferenceElement(data.referenceElementId);
    const selection = serialize_selection_1.default.restore(data, referenceElement);
    const range = selection.getRangeAt(0);
    selection.removeAllRanges();
    return range;
}
exports.load = load;
//# sourceMappingURL=index.js.map