import plugin, { StartDataFile, StartDataFilesProps } from "@start/plugin";
import * as fs from "fs";
import * as path from "path";
import { CompilerOptions } from "typescript";

export interface Options {
    module?: "commonjs";
    sourceMap?: boolean;
    sourceRoot?: string;
    outDir?: string;
    [option: string]: any;
}

declare module "typescript" {
    export interface EmitResult {
        sourceMaps?: Array<{
            inputSourceFileNames: SourceFile[];
            sourceMap: {};
        }>
    }
}

export default (options: Options) =>
    plugin("typescript", () => async ({ files }: StartDataFilesProps) => {
        const ts = await import("typescript");

        function parseOptions(options: object): CompilerOptions {
            const root: string = process.cwd();
            return ts.convertCompilerOptionsFromJson(options, root).options;
        }

        let targetOptions: CompilerOptions = parseOptions(options);

        // Extend project options
        try {
            const configPath = path.resolve(process.cwd(), "tsconfig.json");
            const projectJSON = JSON.parse(fs.readFileSync(configPath, "utf8"));
            const projectOptions = parseOptions(projectJSON.compilerOptions);

            targetOptions = Object.assign(projectOptions, targetOptions);
        } catch { }

        const fileNames = files.map(x => x.path);
        const program = ts.createProgram(fileNames, targetOptions);

        // TODO: report errors
        const allDiagnostics = ts.getPreEmitDiagnostics(program);
        // .concat(emitResult.diagnostics);

        const fileNamesSet = new Set(fileNames);
        const targetSourceFiles = program.getSourceFiles()
            .filter(x => fileNamesSet.has(x.fileName));

        const resultFiles: StartDataFile[] = [];
        for (const sourceFile of targetSourceFiles) {
            const resultFile: StartDataFile = {
                path: sourceFile.fileName,
                data: '',
            };

            // Emit JS file and add result
            const emitResult = program.emit(sourceFile, (fileName, contents) => {
                if (!fileName.endsWith('.js')) return;
                resultFile.data = contents;
            });

            // Add map result
            resultFile.map = emitResult.sourceMaps?.[0]?.sourceMap;

            resultFiles.push(resultFile);
        }

        return {
            files: resultFiles,
        };
    });
