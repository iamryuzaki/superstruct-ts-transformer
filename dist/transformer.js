"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = __importStar(require("typescript"));
var ts_type_visitor_1 = require("ts-type-visitor");
var validator_1 = require("./validator");
var flatten = function (arr) {
    return arr.reduce(function (acc, curr) { return __spreadArrays(acc, curr); }, []);
};
var createSuperStructValidator = function (typeModel, functionName, strictNullChecks, customValidators) {
    var customValidatorsObjectLiteralProps = [];
    if (customValidators && customValidators.size > 0) {
        customValidators === null || customValidators === void 0 ? void 0 : customValidators.forEach(function (funcName) {
            customValidatorsObjectLiteralProps.push(typescript_1.default.createPropertyAssignment(funcName, typescript_1.default.createIdentifier(funcName)));
        });
    }
    var superstructStructVariable = typescript_1.default.createVariableStatement(undefined, [
        typescript_1.default.createVariableDeclaration("struct", undefined, typescript_1.default.createCall(validator_1.createSuperStructDotSuperstructPropAccess(), undefined, [
            typescript_1.default.createObjectLiteral([
                typescript_1.default.createPropertyAssignment("types", typescript_1.default.createObjectLiteral(customValidatorsObjectLiteralProps))
            ])
        ]))
    ]);
    var superstructValidator = typescript_1.default.createCall(typescript_1.default.createIdentifier("struct"), undefined, [
        validator_1.createSuperStructValidatorForm(typeModel, false, strictNullChecks, customValidators)
    ]);
    var superstructValidatorVariable = typescript_1.default.createVariableStatement(undefined, [
        typescript_1.default.createVariableDeclaration("validator", undefined, superstructValidator)
    ]);
    var validatorCall = typescript_1.default.createCall(typescript_1.default.createIdentifier("validator"), undefined, [typescript_1.default.createIdentifier("jsonObj")]);
    var body = typescript_1.default.createBlock([
        superstructStructVariable,
        superstructValidatorVariable,
        typescript_1.default.createReturn(validatorCall)
    ], true);
    var validateFunc = typescript_1.default.createFunctionDeclaration(undefined, undefined, undefined, functionName, undefined, [
        typescript_1.default.createParameter(undefined, undefined, undefined, "jsonObj", undefined, undefined, undefined)
    ], undefined, body);
    return validateFunc;
};
function isOurModule(moduleName) {
    if (process.env.SUPERSTRUCT_TS_TRANSFORMER_ENV === "debug") {
        return moduleName == "../index";
    }
    return moduleName == "superstruct-ts-transformer";
}
var createVisitor = function (ctx, sourceFile, checker) {
    var typeModels = new Map();
    var visitor = function (node) {
        var pass = function () { return typescript_1.default.visitEachChild(node, visitor, ctx); };
        if (typescript_1.default.isImportDeclaration(node) &&
            typescript_1.default.isStringLiteral(node.moduleSpecifier) &&
            isOurModule(node.moduleSpecifier.text)) {
            var moduleTarget = ctx.getCompilerOptions().module;
            if (moduleTarget === typescript_1.default.ModuleKind.CommonJS) {
                return typescript_1.default.createVariableStatement([typescript_1.default.createModifier(typescript_1.default.SyntaxKind.ConstKeyword)], [
                    typescript_1.default.createVariableDeclaration("superstruct", undefined, typescript_1.default.createCall(typescript_1.default.createIdentifier("require"), undefined, [typescript_1.default.createLiteral("superstruct")]))
                ]);
            }
            else if (moduleTarget === typescript_1.default.ModuleKind.ES2015 ||
                moduleTarget === typescript_1.default.ModuleKind.ESNext) {
                var superstructStructImportClause = typescript_1.default.createImportClause(undefined, typescript_1.default.createNamespaceImport(typescript_1.default.createIdentifier("superstruct")));
                return typescript_1.default.createImportDeclaration(undefined, node.modifiers, superstructStructImportClause, typescript_1.default.createStringLiteral("superstruct"));
            }
            else {
                throw new Error("superstruct-ts-transformer doesn't support module targets other than CommonJS and ES2015+");
            }
        }
        if (typescript_1.default.isSourceFile(node)) {
            var newFileNode = typescript_1.default.visitEachChild(node, visitor, ctx);
            var options_1 = ctx.getCompilerOptions();
            var newValidators = flatten(Array.from(typeModels.values()).map(function (callsToImplement) {
                return callsToImplement.map(function (callToImplement) {
                    return createSuperStructValidator(callToImplement.typeModel, callToImplement.functionName, options_1.strict || options_1.strictNullChecks || false, callToImplement.customValidators);
                });
            }));
            var fileNodeWithValidators = typescript_1.default.updateSourceFileNode(newFileNode, __spreadArrays(newFileNode.statements, newValidators));
            return fileNodeWithValidators;
        }
        if (typescript_1.default.isCallExpression(node) &&
            typescript_1.default.isIdentifier(node.expression) &&
            node.typeArguments &&
            node.typeArguments.length > 0 &&
            node.arguments.length > 0) {
            var sym = checker.getSymbolAtLocation(node.expression);
            if (!!sym &&
                sym.declarations.some(function (decl) {
                    return typescript_1.default.isNamedImports(decl.parent) &&
                        typescript_1.default.isImportClause(decl.parent.parent) &&
                        typescript_1.default.isImportDeclaration(decl.parent.parent.parent) &&
                        typescript_1.default.isStringLiteral(decl.parent.parent.parent.moduleSpecifier) &&
                        isOurModule(decl.parent.parent.parent.moduleSpecifier.text);
                })) {
                var typeToValidateAgainst = checker.getTypeFromTypeNode(node.typeArguments[0]);
                var typeModel = ts_type_visitor_1.typeVisitor(checker, typeToValidateAgainst);
                var typeToValidateAgainstStr = checker
                    .typeToString(typeToValidateAgainst)
                    .replace(/\[/g, "ARRAY_")
                    .replace(/\]/g, "_ENDARRAY")
                    .replace(/\s/g, "_")
                    .replace(/[\,]/g, "");
                var functionName = node.expression.text;
                var newFunctionName = functionName + "_" + typeToValidateAgainstStr;
                var customValidators_1 = new Map();
                var customValidatorsArg = node.arguments[1];
                if (customValidatorsArg &&
                    typescript_1.default.isArrayLiteralExpression(customValidatorsArg)) {
                    customValidatorsArg.elements.forEach(function (element) {
                        var _a;
                        var sym = checker.getSymbolAtLocation(element);
                        var type = checker.getTypeAtLocation(element);
                        var sigs = checker.getSignaturesOfType(type, typescript_1.SignatureKind.Call);
                        var decl = (_a = sigs[0]) === null || _a === void 0 ? void 0 : _a.declaration;
                        var typeNode = decl === null || decl === void 0 ? void 0 : decl.type;
                        var typeNeeded = typeNode && typescript_1.default.isTypeNode(typeNode)
                            ? checker.getTypeFromTypeNode(typeNode)
                            : undefined;
                        if (typeNode && typescript_1.default.isTypePredicateNode(typeNode) && typeNode.type) {
                            customValidators_1.set(checker.getTypeFromTypeNode(typeNode.type), element.getText());
                        }
                    });
                }
                var newCallToImplement = {
                    typeModel: typeModel,
                    functionName: newFunctionName,
                    customValidators: customValidators_1
                };
                if (typeModels.has(sourceFile)) {
                    typeModels.set(sourceFile, __spreadArrays(typeModels.get(sourceFile), [
                        newCallToImplement
                    ]));
                }
                else {
                    typeModels.set(sourceFile, [newCallToImplement]);
                }
                return typescript_1.default.createCall(typescript_1.default.createIdentifier(newFunctionName), undefined, node.arguments.slice(0, 1));
            }
        }
        return pass();
    };
    return visitor;
};
var createValidatorTransformer = function (program) { return function (ctx) { return function (sf) {
    return typescript_1.default.visitNode(sf, createVisitor(ctx, sf, program.getTypeChecker()));
}; }; };
exports.default = createValidatorTransformer;
//# sourceMappingURL=transformer.js.map