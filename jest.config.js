module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
        },
    },
    coverageReporters: ["lcov", "text"],
};
