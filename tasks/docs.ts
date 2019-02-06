import sequence from "@start/plugin-sequence";
import find from "@start/plugin-find";
import typedoc from "./plugins/typedoc";

export const buildDocs = () =>
    sequence(
        find(["src/*.ts", "!src/cli.ts", "!src/*.spec.ts"]),
        typedoc({
            target: "es5",
            module: "es2015",
            
            out: "docs/",
            mode: "modules",
            version: true,
            excludePrivate: true,
            excludeProtected: true,
            excludeExternals: true,
        }),
    );