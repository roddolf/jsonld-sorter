import plugin, { StartFiles } from "@start/plugin";
import { Application } from "typedoc";

interface Options {
    out: string;
    mode?: "file" | "modules";
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
    plugin(PLUGIN_NAME, async ({ files, reporter }) => {
        const appOptions = {
            ...options,
            out: null,
            json: null,
        };
        const app = new Application(appOptions);

        const src = files.map(_ => _.path);
        const project = app.convert(src);

        if (!project) {
            reporter.emit("error", PLUGIN_NAME, "Failed to generate TypeDoc project.");
            return;
        }

        if (options.out) app.generateDocs(project, options.out);
        if (options.json) app.generateJson(project, options.json);

        if (app.logger.hasErrors()) {
            reporter.emit("error", PLUGIN_NAME, "Error generating TypeDoc output.");
            return;
        }
    });
