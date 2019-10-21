import plugin from "@start/plugin";

export default (options: {} = {}) =>
    plugin("microbundle", props => async () => {
        const microbundle = (await import("microbundle")).default;
        try {
            const output = await microbundle({
                format: "es,cjs,umd",
                watch: false,
                target: "node",
                compress: true,
                cwd: ".",
                sourcemap: true,
                ...options,
            });
            props.logMessage(output);
        } catch (e) {
            throw e.message;
        }
    });
