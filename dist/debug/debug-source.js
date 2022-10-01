"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obj = exports.isUuid = void 0;
var index_1 = require("../index");
var uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var isUuid = function (value) {
    return typeof value === "string" && !!value && uuidRegExp.test(value);
};
exports.isUuid = isUuid;
exports.obj = index_1.validate(JSON.parse("a4e1b0cf-2a08-4297-83f3-4db896d7e0fb"), [exports.isUuid]);
//# sourceMappingURL=debug-source.js.map