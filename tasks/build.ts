import sequence from "@start/plugin-sequence";
import find from "@start/plugin-find";
import read from "@start/plugin-read";
import write from "@start/plugin-write";
import microbundle from "./plugins/microbundle";
import typescript from "./plugins/typescript";

export const buildDist = () => microbundle({});

export const buildCLI = () =>
    sequence(
        find("src/cli.ts"),
        read,
        typescript({
            module: "commonjs",
            sourceMap: true,
            outDir: "dist/",
        }),
        write("dist/"),
    );

export const build = () => sequence(buildDist(), buildCLI());
