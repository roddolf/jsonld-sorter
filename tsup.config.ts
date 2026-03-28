import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["cjs", "esm"],
        dts: true,
        sourcemap: true,
        target: "es2021",
        minify: false,
        clean: true,
    },
    {
        entry: ["src/cli.ts"],
        format: ["esm"],
        sourcemap: true,
        target: "es2021",
        minify: false,
        banner: {
            js: "#!/usr/bin/env node",
        },
    },
]);
