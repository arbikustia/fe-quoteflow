import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest/polyfills.cjs"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: [
    "**/src/modules/master-category/*.test.{ts,tsx}",
    "**/src/modules/master-category/*.snap.{ts,tsx}",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@testing-library/jest-dom/vitest$": "@testing-library/jest-dom",
    "^vitest$": "<rootDir>/jest/vitest-shim.cjs",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
    "^.+\\.(png|jpe?g|gif|svg|webp|avif|ico|bmp)$":
      "<rootDir>/jest/asset-transform.cjs",
  },
  snapshotResolver: "<rootDir>/jest/snapshot-resolver.cjs",
  coverageProvider: "v8",
  coverageReporters: ["text", "json", "html"],
  collectCoverageFrom: ["src/modules/master-category/**/*.{ts,tsx}"],
};

export default config;
