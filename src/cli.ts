#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import { sortJSONLD } from ".";

const argv = yargs
    .usage("$0 <file> [target_file] [options]", "Sort the LD-Data provided.")

    .version()
    .alias("v", "version")
    .alias("h", "help")

    .positional("file", {
        type: "string",
        description: "The JSON-LD file to be ordered",
    })
    .positional("target_file", {
        type: "string",
        description: "File to store the ordered data",
    })

    .option("self", {
        alias: "s",
        default: false,
        boolean: true,
        description: "Store data in the same file",
    })

    .argv; // prettier-ignore

if (!argv.self && !argv.target_file) {
    console.error("A target file, or the --self frag is required.");
    process.exit(1);
}

const workDirectory: string = process.cwd();

const file: string = path.resolve(workDirectory, argv.file!);
let fileJSON: object;
try {
    const fileString: string = fs.readFileSync(file, "utf8");
    fileJSON = JSON.parse(fileString);
} catch (e) {
    console.info(e);
    console.error("Invalid file provided.");
    process.exit(1);
}

const newJSON = sortJSONLD(fileJSON!);
const newString = JSON.stringify(newJSON, null, 2);

const target: string = !argv.self
    ? path.resolve(workDirectory, argv.target_file!)
    : file;
try {
    fs.writeFileSync(target, newString);
} catch (e) {
    console.info(e);
    console.error("Couldn't save the data in '%s'.", target);
    process.exit(1);
}
