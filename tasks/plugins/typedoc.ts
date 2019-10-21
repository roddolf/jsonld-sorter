import plugin, { StartFilesProps } from "@start/plugin";

interface Options {
    out: string;
    mode?: "file" | "modules";
    tsconfig: string;
    json?: string;
    exclude?: string;
    includeDeclarations?: boolean;
    externalPattern?: string;
    excludeExternals?: boolean;
    excludePrivate?: boolean;
    excludeProtected?: boolean;
    module?: string;
    target?: string;
    theme?: string;
    name?: string;
    readme?: string;
    plugins?: string[];
    hideGenerator?: boolean;
    gaID?: string;
    gaSite?: string;
    entryPoint?: string;
    gitRevision?: string;
    includes?: string;
    media?: string;
    verbose?: boolean;
    version?: boolean;
}

const PLUGIN_NAME = "typedoc";
export default (options: Options) =>
    plugin(PLUGIN_NAME, () => async ({ files }: StartFilesProps) => {
        const { Application } = await import("typedoc");
        const app = new Application({
            ...options,
            out: null,
            json: null,
        });

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
