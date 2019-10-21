import plugin, { StartDataFilesProps } from "@start/plugin";

export default () =>
    plugin("coveralls", () => async ({ files }: StartDataFilesProps) => {
        const coveralls = (await import("coveralls")).handleInput;

        const sendToCoveralls = (data: string) =>
            new Promise((resolve, reject) => {
                coveralls(data, error => {
                    if (error) reject(error);
                    resolve();
                });
            });

        for (const file of files) {
            await sendToCoveralls(file.data);
        }
    });
