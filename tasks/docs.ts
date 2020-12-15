import sequence from "@start/plugin-sequence";
import find from "@start/plugin-find";
import typedoc from "./plugins/typedoc";

export const buildDocs = () =>
    sequence(
        find(["src/*.ts", "!src/cli.ts", "!src/*.spec.ts"]),
        typedoc({
            tsconfig: "./tsconfig.json",

            out: "docs/",
            mode: "file",
            version: true,
            excludePrivate: true,
            excludeProtected: true,
            excludeExternals: true,
        }),
    );
