import sequence from "@start/plugin-sequence";
import jest from "@start/plugin-lib-jest";
import find from "@start/plugin-find";
import read from "@start/plugin-read";
import remove from "@start/plugin-remove";
import coveralls from "./plugins/coveralls";

const JEST_YARGS_REQUIRED = {
    _: [],
    $0: "jest",
};

export const test = () =>
    jest({
        ...JEST_YARGS_REQUIRED,
    });

export const ci = () =>
    sequence(
        find("coverage"),
        remove,
        jest({
            ...JEST_YARGS_REQUIRED,
            collectCoverage: true,
            coverageReporters: ["lcov"],
        }),
        find("coverage/lcov.info"),
        read,
        coveralls(),
    );
