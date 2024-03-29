import find from "@start/plugin-find";
import remove from "@start/plugin-remove";
import sequence from "@start/plugin-sequence";
import jest from "./plugins/jest";

export const test = () =>
    jest();

export const testCoverage = () =>
    sequence(
        find("coverage"),
        remove,
        jest({
            collectCoverage: true,
            coverageThreshold: JSON.stringify({
                global: {
                    branches: 90,
                    functions: 90,
                    lines: 90,
                },
            }),
            coverageReporters: ["lcov"],
        }),
    );
