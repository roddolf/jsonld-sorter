import plugin, { StartDataFilesProps } from "@start/plugin";

export default () =>
    plugin("coveralls", () => async ({ files }: StartDataFilesProps) => {
        // @ts-ignore
        const coveralls = (await import("coveralls")).handleInput;

        const sendToCoveralls = (data: string) =>
            new Promise<void>((resolve, reject) => {
                coveralls(data, (error: Error) => {
                    if (error) reject(error);
                    resolve();
                });
            });

        for (const file of files) {
            await sendToCoveralls(file.data);
        }
    });
