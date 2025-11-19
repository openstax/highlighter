"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const highlights_client_1 = require("@openstax/highlights-client");
__export(require("@openstax/highlights-client"));
exports.styleIsColor = (style) => Object.values(highlights_client_1.NewHighlightColorEnum).includes(style);
//# sourceMappingURL=api.js.map