import sequence from "@start/plugin-sequence";
import microbundlePlugin from "./plugins/microbundle";

export const bundle = microbundlePlugin({});

export const build = () => sequence(bundle);
