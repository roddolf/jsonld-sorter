import find from "@start/plugin-find";
import read from "@start/plugin-read";
import remove from "@start/plugin-remove";
import sequence from "@start/plugin-sequence";
import coveralls from "./plugins/coveralls";
import jest from "./plugins/jest";

export const test = () =>
    jest();

export const testCI = () =>
    sequence(
        find("coverage"),
        remove,
        jest({
            collectCoverage: true,
            coverageReporters: ["lcov"],
        }),
        find("coverage/lcov.info"),
        read,
        coveralls(),
    );
