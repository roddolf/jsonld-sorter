import plugin, { StartDataFile, StartDataFilesProps } from "@start/plugin";
import type { CompilerOptions, Diagnostic, ParseConfigFileHost } from "typescript";

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


        function parseDiagnostics(diagnostics: readonly Diagnostic[]): string {
            const errors = diagnostics.map(diagnostic => {
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine);
                if (!diagnostic.file || diagnostic.start === undefined) return (message);

                const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
                return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
            });

            return `\n${errors.join('\n')}`;
        }

        function parsePluginOptions(): CompilerOptions {
            const root: string = process.cwd();
            const parsingResults = ts.convertCompilerOptionsFromJson(options, root, 'options');

            if (parsingResults.errors.length) {
                const errorMessage = parseDiagnostics(parsingResults.errors);
                throw errorMessage;
            }

            return parsingResults.options;
        }

        function parseAllOptions(): CompilerOptions {
            const pluginOptions = parsePluginOptions();

            const root: string = process.cwd();
            const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
            if (!configPath) return pluginOptions;


            const host: ParseConfigFileHost = {
                ...ts.sys,
                onUnRecoverableConfigFileDiagnostic: diagnostic => {
                    const errorMessage = parseDiagnostics([diagnostic]);
                    throw errorMessage;
                }
            };

            const parsingResults = ts.getParsedCommandLineOfConfigFile(configPath, pluginOptions, host);
            if (!parsingResults) return pluginOptions;

            if (parsingResults.errors.length) {
                const errorMessage = parseDiagnostics(parsingResults.errors);
                throw errorMessage;
            }

            return parsingResults.options;
        }

        
        // Create the TS program
        const fileNames = files.map(x => x.path);
        const parsedOptions = parseAllOptions();
        const program = ts.createProgram(fileNames, parsedOptions);

        // Check if any error
        const programErrors = ts.getPreEmitDiagnostics(program)
        if (programErrors.length) {
            const errorMessage = parseDiagnostics(programErrors);
            throw errorMessage;
        }

        const fileNamesSet = new Set(fileNames);
        const targetSourceFiles = program.getSourceFiles()
            .filter(x => fileNamesSet.has(x.fileName));

        const resultFiles: StartDataFile[] = [];
        for (const sourceFile of targetSourceFiles) {
            let resultFile: StartDataFile | undefined;

            // Emit JS file and create result
            const emitResult = program.emit(sourceFile, (fileName, contents) => {
                if (!fileName.endsWith('.js')) return;
                resultFile = {
                    path: fileName,
                    data: contents,
                };
            });
            if (!resultFile) continue;

            // Add map result
            resultFile.map = emitResult.sourceMaps?.[0]?.sourceMap;
            resultFiles.push(resultFile);
        }

        return {
            files: resultFiles,
        };
    });
