import plugin, { StartFilesProps } from "@start/plugin";
import type { TypeDocOptions } from "typedoc";

interface Options extends Partial<TypeDocOptions> {
    out: string;
}

const PLUGIN_NAME = "typedoc";
export default (options: Options) =>
    plugin(PLUGIN_NAME, () => async ({ files }: StartFilesProps) => {
        const { Application, TSConfigReader, TypeDocReader } = await import("typedoc");
        const app = await Application.bootstrap({
            ...options,
            out: undefined,
            json: undefined,
            entryPoints: files.map(_ => _.path),
            entryPointStrategy: "Resolve",
        });
        app.options.addReader(new TSConfigReader());
        app.options.addReader(new TypeDocReader());

        const project = await app.convert();
        if (!project) {
            throw "Failed to generate TypeDoc project";
        }

        if (options.out) app.generateDocs(project, options.out);
        if (options.json) app.generateJson(project, options.json);

        if (app.logger.hasErrors()) {
            throw "Error generating TypeDoc output";
        }
    });
