import plugin, { StartDataFile, StartDataFilesProps } from "@start/plugin";
import { CompilerOptions } from "typescript";
import * as path from "path";
import * as fs from "fs";

export interface Options {
    module?: "commonjs";
    sourceMap?: boolean;
    sourceRoot?: string;
    outDir?: string;
    [option: string]: any;
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
        } catch {}

        const resultFiles: StartDataFile[] = files.map(file => {
            const transpileOutput = ts.transpileModule(file.data, {
                fileName: file.path,
                compilerOptions: targetOptions,
            });

            return {
                path: file.path.replace(/\.ts$/, ".js"),
                data: transpileOutput.outputText,
                map: transpileOutput.sourceMapText
                    ? JSON.parse(transpileOutput.sourceMapText)
                    : null,
            };
        });

        return {
            files: resultFiles,
        };
    });
