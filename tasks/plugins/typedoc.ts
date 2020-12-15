import plugin, { StartFilesProps } from "@start/plugin";
import type { TypeDocAndTSOptions } from "typedoc";

interface Options extends Partial<TypeDocAndTSOptions> {
    out: string;
}

const PLUGIN_NAME = "typedoc";
export default (options: Options) =>
    plugin(PLUGIN_NAME, () => async ({ files }: StartFilesProps) => {
        const appOptions = {
            ...options,
            out: null,
            json: null,
        };

        const { Application,TSConfigReader, TypeDocReader } = await import("typedoc");
        const app = new Application();
        app.options.addReader(new TSConfigReader());
        app.options.addReader(new TypeDocReader());
        app.bootstrap(appOptions);

        const src = files.map(_ => _.path);
        const project = app.convert(src);

        if (!project) {
            throw "Failed to generate TypeDoc project";
        }

        if (options.out) app.generateDocs(project, options.out);
        if (options.json) app.generateJson(project, options.json);

        if (app.logger.hasErrors()) {
            throw "Error generating TypeDoc output";
        }
    });
