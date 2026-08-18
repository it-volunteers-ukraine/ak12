import type { Config } from "jest";
import nextJest from "next/jest.js";

(process.env as { NODE_ENV?: string }).NODE_ENV = "test";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^server-only$": "<rootDir>/__mocks__/server-only.ts",
  },
  coverageThreshold: {
    global: {
      statements: 30,
      lines: 30,
    },
    "./src/utils/": {
      statements: 90,
      lines: 90,
    },
    "./src/schemas/": {
      statements: 90,
      lines: 90,
    },
    "./src/actions/": {
      statements: 90,
      lines: 90,
    },
    "./src/lib/": {
      statements: 90,
      lines: 90,
    },
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/*.test.{ts,tsx}", "!src/**/index.{ts,tsx}"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "text-summary", "lcov"],
};

export default createJestConfig(config);
