import { TypeModel } from "ts-type-visitor";
import ts from "typescript";
export declare const createSuperStructDotStructPropAccess: () => ts.PropertyAccessExpression;
export declare const createSuperStructDotSuperstructPropAccess: () => ts.PropertyAccessExpression;
export declare const createSuperStructValidatorForm: (typeModel: TypeModel, optional: boolean, strictNullChecks: boolean, customValidators?: Map<ts.Type, string> | undefined) => ts.Expression;
//# sourceMappingURL=validator.d.ts.map