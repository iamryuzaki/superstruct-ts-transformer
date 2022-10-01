"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUuid = void 0;
var uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var isUuid = function (value) {
    return typeof value === "string" && !!value && uuidRegExp.test(value);
};
exports.isUuid = isUuid;
//# sourceMappingURL=debug-source2.js.map