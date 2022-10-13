import plugin from "@start/plugin";

export default (options: {} = {}) =>
    plugin("microbundle", utils => async () => {
        // @ts-ignore
        const microbundle = (await import("microbundle")).default;
        try {
            const { output } = await microbundle({
                entries: [],
                format: 'modern,esm,cjs,umd',
                // format: "esm,cjs,umd",
                watch: false,
                workers: false,
                'pkg-main': true,
                target: "node",
                compress: false,
                cwd: ".",
                sourcemap: true,
                ...options,
            });
            utils.logMessage(output);

        } catch (e) {
            throw e instanceof Error
                ? e.message
                : e;
        }
    });
