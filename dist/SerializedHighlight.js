"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const change_case_1 = require("change-case");
const api_1 = require("./api");
const Highlight_1 = require("./Highlight");
const serializationStrategies_1 = require("./serializationStrategies");
const XpathRangeSelector_1 = require("./serializationStrategies/XpathRangeSelector");
const mapKeys = (transform, obj) => Object.keys(obj).reduce((result, key) => (Object.assign({}, result, { [transform(key)]: obj[key] })), {});
class SerializedHighlight {
    constructor(data) {
        this._data = data;
        this.deserializer = serializationStrategies_1.getDeserializer(data);
    }
    get data() {
        return this._data;
    }
    get id() {
        return this.data.id;
    }
    get content() {
        return this.data.content;
    }
    /*
     * when (if?) tutor starts using the api, remove this method and
     * pull these property names down through the rest of the logic
     *
     * TODO - support more better api interaction when above
     * refactor happens:
     *   - loop over locationStrategies and pick the best one instead of
     *     the first one
     *   - use location strategy bindings instead of arbitrary mapKeys
     *     or revise swagger definition to properly use oneOf so that it
     *     does it automatically
     */
    static fromApiResponse(highlight) {
        if (!highlight.locationStrategies) {
            throw new Error('highlight with no location strategies');
        }
        if (!highlight.highlightedContent) {
            throw new Error('highlight with no location strategies');
        }
        if (!highlight.anchor) {
            throw new Error('highlight with no location strategies');
        }
        return new SerializedHighlight(Object.assign({}, mapKeys(change_case_1.camelCase, highlight.locationStrategies[0]), { annotation: highlight.annotation, content: highlight.highlightedContent, id: highlight.id, referenceElementId: highlight.anchor, style: highlight.color }));
    }
    /*
     * when (if?) tutor starts using the api, rename these fields in the rest of the code
     * so that less mapping is necessary
     */
    getApiPayload(highlighter, highlight) {
        const _a = this.data, { id, content, style, annotation, referenceElementId } = _a, serializationData = __rest(_a, ["id", "content", "style", "annotation", "referenceElementId"]);
        const prevHighlight = highlighter.getHighlightBefore(highlight);
        const nextHighlight = highlighter.getHighlightAfter(highlight);
        if (!style) {
            throw new Error('a style is requred to create an api payload');
        }
        if (!api_1.styleIsColor(style)) {
            throw new Error(`style ${style} doesn't match an api color`);
        }
        return {
            anchor: referenceElementId,
            annotation,
            color: style,
            highlightedContent: content,
            id,
            locationStrategies: [mapKeys(change_case_1.snakeCase, serializationData)],
            nextHighlightId: nextHighlight && nextHighlight.id,
            prevHighlightId: prevHighlight && prevHighlight.id,
        };
    }
    isLoadable(highlighter) {
        return this.deserializer.isLoadable(highlighter);
    }
    load(highlighter) {
        const range = this.deserializer.load(highlighter);
        const highlightOptions = highlighter.getHighlightOptions();
        return new Highlight_1.default(range, this.data, highlightOptions);
    }
}
SerializedHighlight.defaultSerializer = XpathRangeSelector_1.serialize;
exports.default = SerializedHighlight;
//# sourceMappingURL=SerializedHighlight.js.map