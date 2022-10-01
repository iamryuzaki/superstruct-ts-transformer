"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuperStructValidatorForm = exports.createSuperStructDotSuperstructPropAccess = exports.createSuperStructDotStructPropAccess = void 0;
var typescript_1 = __importDefault(require("typescript"));
var createSuperStructDotStructPropAccess = function () {
    return typescript_1.default.createPropertyAccess(typescript_1.default.createIdentifier("superstruct"), "struct");
};
exports.createSuperStructDotStructPropAccess = createSuperStructDotStructPropAccess;
var createSuperStructDotSuperstructPropAccess = function () {
    return typescript_1.default.createPropertyAccess(typescript_1.default.createIdentifier("superstruct"), "superstruct");
};
exports.createSuperStructDotSuperstructPropAccess = createSuperStructDotSuperstructPropAccess;
var createSuperstructObjectLiteralFromProps = function (_a) {
    var props = _a.props, strictNullChecks = _a.strictNullChecks;
    return typescript_1.default.createObjectLiteral(props.map(function (prop) {
        return typescript_1.default.createPropertyAssignment(prop.name, exports.createSuperStructValidatorForm(prop, prop.optional, strictNullChecks));
    }), true);
};
var createSuperstructLiteral = function (_a) {
    var name = _a.type;
    return typescript_1.default.createStringLiteral(name);
};
var wrapOptional = function (_a) {
    var exp = _a.exp, optional = _a.optional;
    return optional ? createSuperstructCall({ func: "optional", args: [exp] }) : exp;
};
var wrapNonStrictNullChecks = function (_a) {
    var exp = _a.exp, strictNullChecks = _a.strictNullChecks;
    return !strictNullChecks
        ? createSuperstructCall({
            func: "union",
            args: [
                typescript_1.default.createArrayLiteral([
                    createSuperstructLiteral({ type: "null" }),
                    exp
                ])
            ]
        })
        : exp;
};
var wrapOptionalOrNonStrictNullCheck = function (_a) {
    var exp = _a.exp, optional = _a.optional, strictNullChecks = _a.strictNullChecks;
    return wrapOptional({
        exp: wrapNonStrictNullChecks({ exp: exp, strictNullChecks: strictNullChecks }),
        optional: optional
    });
};
var createSuperstructCall = function (_a) {
    var func = _a.func, args = _a.args;
    return typescript_1.default.createCall(typescript_1.default.createPropertyAccess(exports.createSuperStructDotStructPropAccess(), func), undefined, args);
};
var createSuperStructValidatorForm = function (typeModel, optional, strictNullChecks, customValidators) {
    var funcName = typeModel.originalType && (customValidators === null || customValidators === void 0 ? void 0 : customValidators.get(typeModel.originalType));
    if (funcName) {
        return typescript_1.default.createStringLiteral(funcName);
    }
    switch (typeModel.kind) {
        case "any":
        case "unknown":
        case "esSymbol":
        case "uniqueEsSymbol":
        case "void":
        case "never":
        case "typeParameter":
        case "bigintLiteral":
        case "bigint":
        case "bigintLiteral":
            return createSuperstructLiteral({
                type: "any"
            });
        case "enum":
        case "enumLiteral":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructCall({
                    func: "union",
                    args: [
                        typescript_1.default.createArrayLiteral(typeModel.values.map(function (t) {
                            return exports.createSuperStructValidatorForm(t, false, strictNullChecks);
                        }))
                    ]
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "string":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructLiteral({ type: "string" }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "number":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructLiteral({ type: "number" }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "boolean":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructLiteral({ type: "boolean" }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "stringLiteral":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructCall({
                    func: "literal",
                    args: [typescript_1.default.createLiteral(typeModel.value)]
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "numberLiteral":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructCall({
                    func: "literal",
                    args: [typescript_1.default.createLiteral(typeModel.value)]
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "booleanLiteral":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructCall({
                    func: "literal",
                    args: [typescript_1.default.createLiteral(typeModel.value)]
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "undefined":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructLiteral({ type: "undefined" }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "null":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructLiteral({ type: "null" }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "objectWithIndex":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructCall({
                    func: "intersection",
                    args: [
                        typescript_1.default.createArrayLiteral([
                            createSuperstructCall({
                                func: "interface",
                                args: [
                                    createSuperstructObjectLiteralFromProps({
                                        props: typeModel.props,
                                        strictNullChecks: strictNullChecks
                                    })
                                ]
                            }),
                            exports.createSuperStructValidatorForm(typeModel.index, false, strictNullChecks)
                        ])
                    ]
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "object": {
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructObjectLiteralFromProps({
                    props: typeModel.props,
                    strictNullChecks: strictNullChecks
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        }
        case "union":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructCall({
                    func: "union",
                    args: [
                        typescript_1.default.createArrayLiteral(typeModel.types.map(function (t) {
                            return exports.createSuperStructValidatorForm(t, false, strictNullChecks);
                        }))
                    ]
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "index":
            if (typeModel.keyType.kind === "number") {
                return createSuperstructLiteral({
                    type: "any"
                });
            }
            else {
                return wrapOptionalOrNonStrictNullCheck({
                    exp: createSuperstructCall({
                        func: "record",
                        args: [
                            typescript_1.default.createArrayLiteral([
                                exports.createSuperStructValidatorForm(typeModel.keyType, false, true),
                                exports.createSuperStructValidatorForm(typeModel.valueType, false, strictNullChecks)
                            ])
                        ]
                    }),
                    optional: optional,
                    strictNullChecks: strictNullChecks
                });
            }
        case "intersection":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructCall({
                    func: "intersection",
                    args: [
                        typescript_1.default.createArrayLiteral(typeModel.types.map(function (t) {
                            return exports.createSuperStructValidatorForm(t, false, strictNullChecks);
                        }))
                    ]
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "indexedAccess":
            throw new Error("implement indexedAccess superstruct");
        case "conditional":
            throw new Error("implement conditional superstruct");
        case "substitution":
            throw new Error("implement substitution superstruct");
        case "nonPrimitive":
            throw new Error("implement nonPrimitive superstruct");
        case "unidentified":
            return typescript_1.default.createStringLiteral("any");
        case "array":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructCall({
                    func: "array",
                    args: [
                        typescript_1.default.createArrayLiteral([
                            exports.createSuperStructValidatorForm(typeModel.type, false, strictNullChecks)
                        ])
                    ]
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
        case "tuple":
            return wrapOptionalOrNonStrictNullCheck({
                exp: createSuperstructCall({
                    func: "tuple",
                    args: [
                        typescript_1.default.createArrayLiteral(typeModel.types.map(function (t) {
                            return exports.createSuperStructValidatorForm(t, false, strictNullChecks);
                        }))
                    ]
                }),
                optional: optional,
                strictNullChecks: strictNullChecks
            });
    }
    var _exhaustiveCheck = typeModel;
};
exports.createSuperStructValidatorForm = createSuperStructValidatorForm;
//# sourceMappingURL=validator.js.map