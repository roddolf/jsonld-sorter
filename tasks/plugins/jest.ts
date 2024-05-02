import { Config } from '@jest/types'
import plugin from '@start/plugin'
import { Arguments } from 'yargs';

export type JestArgv = Config.Argv extends Arguments<infer U> ? U : never;
const JEST_ARGS_REQUIRED: Arguments = {
    _: [],
    $0: "jest",
};

export default (argv?: JestArgv) =>
    plugin('jest', () => async () => {
        const { runCLI } = (await import('jest')).default;
        const projects = argv?.projects ?? [argv?.rootDir ?? process.cwd()];

        const result = await runCLI({
            ...JEST_ARGS_REQUIRED,
            ...argv,
        }, projects);

        if (
            !result.results.success ||
            result.results.numFailedTests > 0 ||
            result.results.numFailedTestSuites > 0 ||
            result.results.numTotalTests === 0
        ) {
            throw null;
        }
    });