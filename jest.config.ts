import type { Config } from "jest";
import nextJest from "next/jest.js";

// Jest only defaults NODE_ENV to "test" when it is UNSET. Some environments (CI
// containers, this dev box) export NODE_ENV=production globally, which then leaks into
// the test run: React loads its production build (which omits `React.act`, breaking
// @testing-library/react) and NODE_ENV-dependent app code takes its production branch.
// Force "test" before next/jest and the workers read it.
(process.env as { NODE_ENV?: string }).NODE_ENV = "test";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // The real `server-only` package throws when imported outside a Server Component;
    // stub it so modules guarded by `import "server-only"` are testable under jsdom.
    "^server-only$": "<rootDir>/__mocks__/server-only.ts",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/*.test.{ts,tsx}", "!src/**/index.{ts,tsx}"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "text-summary", "lcov"],
};

export default createJestConfig(config);
