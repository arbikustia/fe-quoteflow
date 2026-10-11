// CJS shim: lets test files keep `import { describe, it, vi } from "vitest"`
// while running under Jest. Mapped via jest.config.ts moduleNameMapper.
// jest/vitest-shim.cjs
const jestGlobals = require("@jest/globals");

module.exports = {
  ...jestGlobals,
  vi: jestGlobals.jest,
};
