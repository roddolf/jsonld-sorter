import plugin from "@start/plugin";
import microbundle from "microbundle";

const microbundlePlugin = (options?: {}) =>
    plugin("microbundle", async ({ logMessage }) => {
        const output = await microbundle({
            format: "es,cjs,umd",
            watch: false,
            target: "node",
            compress: true,
            cwd: ".",
            sourcemap: true,
            ...options,
        });

        logMessage( output );
    });

export default microbundlePlugin;
