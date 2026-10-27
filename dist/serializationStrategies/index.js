"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextPositionSelector = require("./TextPositionSelector");
const XpathRangeSelector = require("./XpathRangeSelector");
function getDeserializer(data) {
    switch (data.type) {
        case TextPositionSelector.discriminator:
            return {
                isLoadable: (highlighter) => TextPositionSelector.isLoadable(highlighter, data),
                load: (highlighter) => TextPositionSelector.load(highlighter, data),
            };
        case XpathRangeSelector.discriminator:
            return {
                isLoadable: (highlighter) => XpathRangeSelector.isLoadable(highlighter, data),
                load: (highlighter) => XpathRangeSelector.load(highlighter, data),
            };
        default:
            ((bad) => {
                throw new Error(`not a valid serialization: ${JSON.stringify(bad)}`);
                return null;
            })(data);
            return {
                isLoadable: () => false,
                load: (highlighter) => highlighter.document.createRange(),
            };
    }
}
exports.getDeserializer = getDeserializer;
//# sourceMappingURL=index.js.map