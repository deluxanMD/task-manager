import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  verbose: true,
  clearMocks: true,
  testMatch: ["**/tests/**/*.test.ts"],
};

export default config;
