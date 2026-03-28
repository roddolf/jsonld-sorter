import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.spec.ts", "src/cli.ts"],
            thresholds: {
                branches: 90,
                functions: 90,
                lines: 90,
            },
            reporter: ["lcov", "text"],
        },
    },
});
