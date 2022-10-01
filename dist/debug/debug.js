"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = __importDefault(require("typescript"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var transformer_1 = __importDefault(require("../transformer"));
compile({
    rootNames: [path_1.default.resolve(__dirname, "debug-source.ts")],
    options: {
        target: typescript_1.default.ScriptTarget.ESNext,
        module: typescript_1.default.ModuleKind.ESNext,
        strict: true
    }
});
function compile(createProgramOptions) {
    var program = typescript_1.default.createProgram(createProgramOptions);
    var result = program.emit(undefined, undefined, undefined, undefined, {
        before: [transformer_1.default(program)]
    });
    return;
    createProgramOptions.rootNames.forEach(function (filename) {
        var sourceText = fs_1.default.readFileSync(path_1.default.resolve(__dirname, filename), {
            encoding: "utf-8"
        });
        var output = typescript_1.default.transpileModule(sourceText, {
            compilerOptions: createProgramOptions.options,
            transformers: {
                before: [transformer_1.default(program)]
            }
        });
        console.log(output.outputText);
    });
}
//# sourceMappingURL=debug.js.map