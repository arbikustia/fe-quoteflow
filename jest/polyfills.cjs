// Node globals missing from jsdom (react-router needs TextEncoder/TextDecoder).
// jest/polyfills.cjs
const { TextDecoder, TextEncoder } = require("node:util");

globalThis.TextDecoder = TextDecoder;
globalThis.TextEncoder = TextEncoder;
