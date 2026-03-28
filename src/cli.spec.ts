import { describe, test, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

import { sortJSONLDFile } from "./cli.js";

vi.mock("fs");

// Sentinel error to stop execution after process.exit is called
class ExitError extends Error {
    code: number;
    constructor(code: number) {
        super(`process.exit(${code})`);
        this.code = code;
    }
}

describe("sortJSONLDFile", () => {
    beforeEach(() => {
        vi.restoreAllMocks();

        vi.spyOn(process, "exit").mockImplementation(
            (code?: number | string | null | undefined) => {
                throw new ExitError(typeof code === "number" ? code : 1);
            },
        );
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.spyOn(console, "info").mockImplementation(() => {});
    });

    test("should exit with error when no target file and no --self flag", () => {
        expect(() => sortJSONLDFile(["input.json"])).toThrow(ExitError);

        expect(console.error).toHaveBeenCalledWith(
            "A target file, or the --self frag is required.",
        );
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    test("should read, sort, and write JSON-LD to target file", () => {
        const inputJSON = { key1: "value", key0: "value" };
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(inputJSON));
        vi.mocked(fs.writeFileSync).mockImplementation(() => {});

        sortJSONLDFile(["input.json", "output.json"]);

        const resolvedInput = path.resolve(process.cwd(), "input.json");
        expect(fs.readFileSync).toHaveBeenCalledWith(resolvedInput, "utf8");

        const resolvedOutput = path.resolve(process.cwd(), "output.json");
        const expectedOutput = JSON.stringify(
            { key0: "value", key1: "value" },
            null,
            2,
        );
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            resolvedOutput,
            expectedOutput,
        );
    });

    test("should write sorted output back to same file with --self flag", () => {
        const inputJSON = { key1: "value", key0: "value" };
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(inputJSON));
        vi.mocked(fs.writeFileSync).mockImplementation(() => {});

        sortJSONLDFile(["input.json", "--self"]);

        const resolvedInput = path.resolve(process.cwd(), "input.json");
        expect(fs.readFileSync).toHaveBeenCalledWith(resolvedInput, "utf8");

        const expectedOutput = JSON.stringify(
            { key0: "value", key1: "value" },
            null,
            2,
        );
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            resolvedInput,
            expectedOutput,
        );
    });

    test("should exit with error when input file cannot be read", () => {
        vi.mocked(fs.readFileSync).mockImplementation(() => {
            throw new Error("ENOENT: no such file or directory");
        });

        expect(() =>
            sortJSONLDFile(["nonexistent.json", "output.json"]),
        ).toThrow(ExitError);

        expect(console.error).toHaveBeenCalledWith("Invalid file provided.");
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    test("should exit with error when input file contains invalid JSON", () => {
        vi.mocked(fs.readFileSync).mockReturnValue("not valid json {{{");

        expect(() => sortJSONLDFile(["invalid.json", "output.json"])).toThrow(
            ExitError,
        );

        expect(console.error).toHaveBeenCalledWith("Invalid file provided.");
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    test("should exit with error when target file cannot be written", () => {
        const inputJSON = { key0: "value" };
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(inputJSON));
        vi.mocked(fs.writeFileSync).mockImplementation(() => {
            throw new Error("EACCES: permission denied");
        });

        expect(() => sortJSONLDFile(["input.json", "output.json"])).toThrow(
            ExitError,
        );

        expect(console.error).toHaveBeenCalledWith(
            "Couldn't save the data in '%s'.",
            path.resolve(process.cwd(), "output.json"),
        );
        expect(process.exit).toHaveBeenCalledWith(1);
    });
});
