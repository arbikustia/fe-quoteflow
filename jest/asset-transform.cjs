// Maps static asset imports (png/jpg/svg/...) to the same URL form Vite serves
// under Vitest (`/` + path relative to the project root), so existing
// snapshots written by Vitest keep matching under Jest.
// jest/asset-transform.cjs
const path = require("node:path");

const ROOT = process.cwd();

/** @param {string} _sourceText raw asset bytes (ignored) @param {string} sourcePath absolute path of the imported asset @returns {{code: string}} */
const processAsset = (_sourceText, sourcePath) => {
  const relative = path.relative(ROOT, sourcePath).split(path.sep).join("/");

  return { code: `module.exports = ${JSON.stringify(`/${relative}`)};` };
};

module.exports = { process: processAsset };