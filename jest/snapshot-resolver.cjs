// Jest keeps its own snapshot files so it never clashes with Vitest, which
// still runs the same `*.test.tsx` files and writes incompatible key formats
// (`A > B 1` vs Jest's `A B 1`) into `__snapshots__/*.snap`.
// Write to `<name>.jest.snap` instead.
// jest/snapshot-resolver.cjs
const path = require("node:path");

const JEST_INFIX = ".jest";

module.exports = {
  testPathForConsistencyCheck: "src/example.test.ts",
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    const dir = path.dirname(testPath);
    const base = path.basename(testPath);

    return path.join(dir, "__snapshots__", `${base}${JEST_INFIX}${snapshotExtension}`);
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    const dir = path.dirname(snapshotFilePath);
    const base = path.basename(snapshotFilePath, snapshotExtension).replace(JEST_INFIX, "");

    return path.join(path.dirname(dir), base);
  },
};