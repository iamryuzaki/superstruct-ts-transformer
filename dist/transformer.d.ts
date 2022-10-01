import ts from "typescript";
declare const createValidatorTransformer: (program: ts.Program) => (ctx: ts.TransformationContext) => ts.Transformer<ts.SourceFile>;
export default createValidatorTransformer;
//# sourceMappingURL=transformer.d.ts.map