import type { Config } from "jest";

const config: Config = {
  rootDir: ".",
  roots: ["<rootDir>/src"],
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest/polyfills.cjs"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: [
    "<rootDir>/src/**/*.test.ts",
    "<rootDir>/src/**/*.test.tsx",
    "<rootDir>/src/**/*.snap.ts",
    "<rootDir>/src/**/*.snap.tsx",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/coverage/",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/.worktrees/",
    "<rootDir>/dist/",
    "<rootDir>/coverage/",
  ],
  watchPathIgnorePatterns: [
    "<rootDir>/.worktrees/",
    "<rootDir>/dist/",
    "<rootDir>/coverage/",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
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
  coverageProvider: "v8",
  coverageDirectory: "<rootDir>/node_modules/.cache/jest-coverage",
  coverageReporters: ["text", "json", "html"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.snap.{ts,tsx}",
    "!src/**/*.type.{ts,tsx}",
    "!src/**/*.config.{ts,tsx}",
    "!src/**/index.{ts,tsx}",
    "!src/**/*.style.ts",
    "!src/**/*.wrapper.tsx",
    // Static SVG icon map — no logic to exercise.
    "!src/components/Icons.tsx",
    // Type-only declarations.
    "!src/types/**/*.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/coverage/",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default config;
