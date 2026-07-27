import type { Config } from "jest";
import nextJest from "next/jest.js";

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
