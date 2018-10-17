import sequence from "@start/plugin-sequence";
import jest from "@start/plugin-lib-jest";
import find from "@start/plugin-find";
import read from "@start/plugin-read";
import coveralls from "./plugins/coveralls";

export const test = () => jest({});

export const ci = () =>
    sequence(
        jest({
            collectCoverage: true,
            coverageReporters: ["lcov"],
        }),
        find("coverage/lcov.info"),
        read,
        coveralls(),
    );
