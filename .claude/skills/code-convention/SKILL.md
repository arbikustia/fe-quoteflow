---
name: code-convention
description: BANTUIT React FE code convention (FE_Code_Convention_React.md) as the reference for development. Use before writing, modifying, reviewing, or testing any React/TypeScript frontend code — creating a module, component, container, hook, type/Zod schema, config, util/helper, test or snapshot, API call (RTK Query), fallback handling, naming, JSDoc, formatting, branch name, commit message, or PR description. Retrieves the exact governing rule via a RAG script and enforces it.
---

# Code Convention (BANTUIT React FE)

The single source of truth is `FE_Code_Convention_React.md`
(`/home/ubuntu/projects/bantuit/frontend/FE_Code_Convention_React.md`).
This skill does not replace that document: it tells you how to **retrieve**
the governing rule and verify code against it. When this summary and the
document disagree, the document wins — always cite the document section.

## 1. Retrieve the rule before you write code (mandatory)

For every concern touched by the task, query the convention and read the
returned chunks before writing code:

```bash
RAG=.claude/skills/code-convention/scripts/convention_rag.py

python3 $RAG query "where do useState and useEffect go"   # top-4 relevant chunks
python3 $RAG query "fallback lodash get zod default" -k 6
python3 $RAG section 4.3                                  # full section by number
python3 $RAG list                                         # table of contents + lines
python3 $RAG query "commit message format" --json         # machine-readable
```

- Queries may be in English or Indonesian (`tipe`, `pengujian`, `penamaan`, ... are expanded).
- The document is found via `--doc PATH`, `$CODE_CONVENTION_DOC`, or by walking up
  from the cwd / script dir. No dependencies (pure Python stdlib, BM25).
- Output includes `Section X.Y` and `file:start-end` line ranges — cite these in
  explanations and reviews (e.g. "violates Section 4.2").

Typical query map:

| Task | Query / section |
|------|-----------------|
| New module scaffold | `section 2.1`, `section 3` |
| Component / container / wrapper | `section 3.1`, `3.2`, `3.3` |
| Hooks / state / effects | `section 4.2`, `3.7` |
| Types, Zod, JSDoc | `section 3.4`, `4.3` |
| Tests & snapshots | `section 3.8`, `5`, `8.5` |
| API calls | `section 7` |
| Default values / missing data | `section 9.1` |
| Branching logic | `section 9.2`–`9.5` |
| Naming | `section 8` |
| Git / PR | `section 10`, `11` |

## 2. Core rules (summary — verify details via RAG)

**Module structure (2.1).** Required: `.container.tsx`, `.container.test.tsx`,
`.container.snap.test.tsx`, `.component.tsx`, `.component.test.tsx`,
`.component.snap.test.tsx`, `.hook.ts`, `.hook.test.ts`, `index.ts`.
Optional (create only when needed): `.wrapper.tsx`, `.type.ts`, `.config.ts`,
`.style.ts` / `.module.css`, `.util.ts` (+ `.util.test.ts` required),
`.helper.{ts,tsx}` (+ `.helper.test.{ts,tsx}` required).
Any file containing JSX — tests included — uses `.tsx`.

**Responsibilities (3).**
- `component` — pure UI, data/callbacks via props only; no hooks of any kind,
  no API, no Redux, no side effects, no fallbacks on props.
- `container` — module entry; *calls* hooks (RTK Query, router/i18n, custom),
  applies the single upstream fallback, maps props. Defines no local state/effects.
- `wrapper` — only Suspense / error boundary / module providers; no hooks, no data,
  no `async` component, no `'use client'` / `'use server'`.
- `type.ts` — Zod schemas for external data; derive types with `z.infer`; no logic/JSX.
- `config.ts` — static constants only; never functions returning JSX.
- `hook.ts` — owns `useState`/`useEffect`/`useCallback`/`useMemo`/`useRef`; generic
  hooks go to `@/hooks`.
- `util.ts` — pure TS, no React/JSX. `helper.{ts,tsx}` — view/state helpers,
  receive state via params, no hooks.
- `index.ts` — exports the module entry (container, or wrapper if present) and public props type.

**Formatting (4.1).** Semicolons; one blank line at EOF; braces on every control-flow
body; blank line before `return`/`if`/`switch`/`for`/`while`/`try`/`throw`
unless it is the first statement in its block.

**Typing & JSDoc (4.3).** Explicit param + return types everywhere; optional params last;
no inline object types (use named types). Forbidden: `any`, untyped `object`,
`Record<string, unknown|any>`, loose index signatures for domain models,
`as unknown as T`. Bounded `Record<UnionKey, V>` is encouraged.
JSDoc on **every named function** (incl. private, hooks, `useCallback` handlers);
format `@param {Type} name - Description`, `@returns {Type} - Description`,
optional `[name]` / `[name=default]`. Inline anonymous callbacks are exempt.

**Events (4.4).** `onClick={handleClick}`, not `onClick={() => handleClick()}`.

**Testing (5, 3.8, 8.5).** Jest + RTL only through `@/libs/unit-test`
(no direct `@testing-library/*`); Jest globals allowed. Unit + snapshot tests for every
component and container; snapshots via `test.assertSnapshots`. Coverage ≥ 70%.
Test names / snapshot `desc`: `should <expected behavior>`.

**Shared code (6).** `@/types/common.type`, `@/libs/utils`, `@/hooks`. Search these
(and the repo's other shared folders) before creating new code.

**API (7).** Modules use RTK Query from `@/libs/ApiRtkServices/genericEndpoints.service`.
`apiClient` only inside the service layer; never import it in a module. No raw `fetch()`.

**Naming (8).** English; camelCase; booleans `is/has/can/should`; arrays plural;
constants `UPPER_SNAKE_CASE`; Zod `PascalCaseSchema`; types/components/classes PascalCase;
`const`/`let`, never `var`; arrow functions preferred; `_` = private to its file
(exported only for its own unit test, never imported elsewhere); hooks `use*`;
props `on<Event>`, implementations `handle<Event>`; action prefixes `get/fetch/load`,
`create/submit/send`, `update/edit`, `delete/remove`.

**Logic (9).** Fallback exactly once, upstream in the container; consumers never
re-fallback. The document allows Zod `.default()` or `lodash/get` — in fe-quoteflow use
Zod `.default()` only (see Section 5 of this skill).
Guard clauses over nesting. Value mapping → `Record<Union, Value>`; differing logic →
`switch` + `never` exhaustive check. Extract pure functions out of component bodies.

**Git (10).** Branch `<type>/[BIT-<n>-]<kebab-description>`; commit
`<type>(<scope>): [BIT-<n>] <summary>` (omit `[...]` when no ticket); types
`feat|fix|hotfix|docs|style|refactor|perf|test|chore`; PR body uses the Section 10.3
template.

## 3. Workflow

1. Identify every concern the task touches; run `query`/`section` for each (Section 1).
2. Inspect the nearest existing module in the repo for the established pattern.
3. Implement following the retrieved rules exactly.
4. Run the checklist below; for each failure, re-query the relevant section and fix.
5. Run the quality gate (Section 11): ESLint 0 errors, `tsc --noEmit`, Jest with coverage.
6. When reporting/reviewing, cite violations as `Section X.Y` with `file:line`.

## 4. Pre-completion checklist

- [ ] Required module files exist; optional files only when needed, each with its test (2.1)
- [ ] JSX files (incl. tests) use `.tsx` (2.1)
- [ ] Component: no hooks, no API/Redux, no side effects, no prop fallbacks (3.1, 4.2)
- [ ] Container only calls hooks; state/effects live in `.hook.ts` (4.2)
- [ ] Wrapper (if any): composition only, synchronous, no directives (3.3)
- [ ] Config has no logic/JSX; util has no React/JSX; helpers take state via params (3.5, 3.10)
- [ ] Zod for external data, types via `z.infer`, no duplicate manual types (3.4)
- [ ] No `any` / untyped `object` / open `Record` / loose index signature / `as unknown as` (4.3)
- [ ] Explicit param + return types; optional params last; no inline object types (4.3)
- [ ] JSDoc on every named function in the correct format (4.3)
- [ ] Handlers passed by reference; `on*` props / `handle*` implementations (4.4, 8.3)
- [ ] API via RTK Query; no `apiClient` in modules; no `fetch()` (7)
- [ ] Fallback applied once upstream, one mechanism per field (9.1)
- [ ] Guard clauses; `Record` lookup or `switch` + `never` where applicable (9.2–9.5)
- [ ] Naming rules (8); `_` functions not imported outside their file + test (8.3)
- [ ] Formatting: semicolons, braces, blank lines, EOF newline (4.1)
- [ ] Tests via `@/libs/unit-test`, unit + snapshot, `should ...` names, coverage ≥ 70% (5)
- [ ] Branch, commit, PR follow Section 10; quality gate passes (11)

## 5. Conflicts with other instructions

If other instructions or existing code disagree with `FE_Code_Convention_React.md`,
do not silently pick one. Cite both sources, tell the user about the conflict, and ask
which governs before changing code that depends on it. For existing code that predates
the convention, apply the convention to new/changed code only and do not refactor
unrelated code.

**fe-quoteflow decision (Section 9.1 mechanism):** lodash is NOT used in this project.
- Fallbacks use Zod `.default()` only (`zod` v4 is installed), applied once upstream.
- Where the document's examples use `get(data, 'path')` to read the raw response, use
  optional chaining instead (e.g. `normalizeUser(data?.data)`), with no `?? default`
  for fields the schema already defaults.
- Do NOT install or import `lodash` / `lodash/get`.
- Use Zod v4 APIs (e.g. `z.email()` rather than the deprecated `z.string().email()`).
