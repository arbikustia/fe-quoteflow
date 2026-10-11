# ASUM React FE Code Convention (AI-Readable Rules)

Project: React Frontend (ASUM FE). Stack: React, TypeScript, Redux / RTK Query, Axios, Jest.

This project uses framework-agnostic React. Do not introduce Next.js-specific APIs, conventions, directives, routing, Server Components, or file structures unless the project explicitly adopts Next.js in the future.

## 0. How to use this document (instructions for AI agents)

- Treat every rule here as binding. Keywords: **MUST** / **MUST NOT** = mandatory. **SHOULD** = strongly recommended. **MAY** = optional.
- Non-compliant code will not be merged. Before finishing any task, run the checklist in Section 13.
- When generating a new module, start from the templates in Section 4.
- When a rule conflicts with existing code, follow this document for new/changed code and do not refactor unrelated code.
- Rule IDs (e.g. `R-TYPE-03`) are provided so you can cite them in reviews.

---

## 1. Quick Reference (the 25 rules most often broken)

| ID | Rule |
|----|------|
| R-ARCH-01 | Every module MUST follow the standard folder structure (Section 2). |
| R-COMP-01 | `.component.tsx` is pure UI: no API calls, no Redux, no side effects, data via props only. |
| R-HOOK-01 | `useState` / `useEffect` MUST NOT be written inside a component. Move them to `ModuleName.hook.ts`. |
| R-TYPE-01 | Types live ONLY in `.type.ts`. Use `type`, NOT `interface`. |
| R-TYPE-02 | `any`, `unknown`, `object`, `*`, `Record<string, unknown>`, index signatures, and `as` type assertions are forbidden. |
| R-CFG-01 | `.config.ts` is static data only. No logic, no JSX. |
| R-JSDOC-01 | JSDoc is mandatory on public functions. Explicit return types are mandatory everywhere. |
| R-JSDOC-02 | Optional params MUST be last in the signature. JSDoc writes optional as `{number} [c]`, never `{number \| undefined}`. |
| R-EVT-01 | Pass handler references: `onClick={handleClick}`, NOT `onClick={() => handleClick()}`. |
| R-API-01 | API calls MUST use RTK Query or the Axios-based `apiClient`. Direct `fetch` is prohibited. |
| R-FMT-01 | Semicolons mandatory. One blank line at end of file. Blank line before `return`, `if`, `switch`, `while`. |
| R-NAME-01 | Variables and functions: `camelCase`. Constants: `UPPER_SNAKE_CASE`. Classes: `PascalCase`. |
| R-NAME-02 | Booleans start with `is` / `has` / `can` / `should`. Arrays are plural. |
| R-NAME-03 | `_` is reserved ONLY for private helper functions. Hooks start with `use`. |
| R-NAME-04 | Prefer arrow functions. Use `function` declarations only when hoisting is needed. Avoid `var`. |
| R-TEST-01 | Jest is mandatory. Snapshot + unit tests are mandatory. Coverage MUST be >= 70%. |
| R-GIT-01 | Branch: `<type>/<TICKET>-<kebab-description>`. Commit: `<type>(<scope>): [<TICKET>] - <message>`. |
| R-DATA-01 | Do not invent or silently substitute fallback data. Handle missing data explicitly. |
| R-REUSE-01 | Inspect and reuse all global/shared folders before creating new code. |

---

## 2. Module Architecture

### R-ARCH-01: Standard module structure

Every module MUST use this layout (`ModuleName` = the module's PascalCase name):

```
ModuleName/
├─ ModuleName.component.tsx        # pure UI
├─ ModuleName.component.snap.ts    # snapshot tests for component
├─ ModuleName.component.test.ts    # unit tests for component
├─ ModuleName.container.tsx        # business logic, API, Redux
├─ ModuleName.container.snap.tsx   # snapshot tests for container
├─ ModuleName.container.test.ts    # unit tests for container
├─ ModuleName.type.ts              # all types
├─ ModuleName.config.ts            # static constants only
├─ ModuleName.style.ts             # optional (or ModuleName.css)
├─ ModuleName.hook.ts              # useState / useEffect / grouped hooks
├─ ModuleName.utils.ts             # optional, private, non-generic logic
├─ ModuleName.helpers.ts           # optional, private, non-generic helpers (pure TS)
├─ ModuleName.helpers.tsx          # optional, helpers that return JSX
└─ index.ts                        # public exports
```

Data flow: `index.ts` -> `container` -> `component`.

---

## 3. File Responsibility Matrix

| File | MUST contain | MUST NOT contain |
|------|--------------|------------------|
| `.component.tsx` | Pure UI rendering, props in, event handlers accepted via props | API calls, Redux, side effects, `useState`, `useEffect` |
| `.container.tsx` | Business logic, Redux / RTK Query, API interaction, prop mapping | Large UI markup (delegate to component) |
| `.type.ts` | Centralized types (`type` only) | Logic, JSX, `interface`, ambiguous shapes |
| `.config.ts` | Static config, constants, feature flags | Any logic, any JSX / `React.createElement` / HTML tags |
| `.style.ts` / `.css` | Styling only | Logic |
| `.hook.ts` | Encapsulated `useState` / `useEffect`, grouped hooks, reusable module logic | JSX |
| `.component.test.ts` / `.container.test.ts` | Unit tests by scenario | Snapshot tests |
| `.component.snap.ts` / `.container.snap.tsx` | Snapshot tests by scenario | Unit assertions |
| `index.ts` | Public exports, clean import interface | Logic |
| `.utils.ts` | Private, module-specific, non-generic utility logic | Generic / shared global utils |
| `.helpers.ts` | Private pure TS helpers (formatting, calculations, mappers) | Generic / shared helpers, JSX |
| `.helpers.tsx` | Private helpers that return JSX / React nodes (modal message builders, dynamic alert text, table column renderers) | Generic / shared helpers |

Additional placement rules:

- Reusable hook (used by more than one module) -> put it in `@src/hooks`, not in the module.
- Local utils/helpers vs shared utils/helpers MUST be kept separate. Shared code goes to `libs/utils` (Section 7).
- If a component has many hooks, move them to `.hook.ts`. If a container consumes many hooks, move them to `.hook.ts` too.
- A function that builds UI and was tempted into `.config.ts` belongs in `.helpers.tsx`.

---

## 4. File Templates (copy these patterns)

### 4.1 `ModuleName.component.tsx`

```tsx
import * as React from 'react';

import { UserCardProps } from './ModuleName.type';
import style from './ModuleName.style';

/**
 * Render Header Card
 * @param {string} title - header title
 * @returns {React.ReactElement} - Header
 */
const _renderHeader = (title: string): React.ReactElement => (
  <h3>{title}</h3>
);

/**
 * Render Content Card
 * @param {string} email - card content
 * @returns {React.ReactElement} - Content
 */
const _renderContent = (email: string): React.ReactElement => (
  <p>{email}</p>
);

/**
 * Render UserCard Component
 * @param {UserCardProps} props - user card component props
 * @returns {React.ReactElement} - UserCardComponent
 */
export const UserCardComponent = (props: UserCardProps): React.ReactElement => {
  const { title, email } = props;

  return (
    <Card>
      {_renderHeader(title)}
      {_renderContent(email)}
    </Card>
  );
};
```

Notes: render sub-parts through private `_render*` functions; destructure props at top; blank line before `return`.

### 4.2 `ModuleName.container.tsx`

```tsx
import * as React from 'react';
import { connect } from 'react-redux';

import { useGetUserQuery } from '@/store/api/user.api';

import { UserCardComponent } from './ModuleName.component';
import type { Props } from './ModuleName.type';

/**
 * Render UserCard Container
 * @param {Props} props - props
 * @returns {React.ReactElement} - UserCard Container
 */
const UserCardContainer = (props: Props): React.ReactElement => {
  const { data } = useGetUserQuery();

  if (!data) {
    return <UserCardEmptyState />;
  }

  return <UserCardComponent title={data.name} email={data.email} />;
};

const mapStateToProps = (state: RootState) => ({});
const mapDispatchToProps = (dispatch: AppDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserCardContainer);
```

The container MUST handle loading, error, and missing-data states explicitly before rendering `UserCardComponent`. It MUST NOT hide missing API data with fallback values such as `?? ''`, `|| []`, placeholder objects, or hard-coded mock data.

### 4.3 `ModuleName.type.ts`

```ts
export type UserCardProps = {
  name: string;
  email: string;
};
```

### 4.4 `ModuleName.config.ts`

```ts
export const USER_CARD_CONFIG = {
  MAX_NAME_LENGTH: 50,
};
```

### 4.5 `ModuleName.style.ts`

```ts
import { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
};

export default styles;
```

### 4.6 `ModuleName.hook.ts`

```ts
import { useEffect, useState } from 'react';

export const useUserState = (): { isActive: boolean } => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
  }, []);

  return { isActive };
};
```

### 4.7 `ModuleName.component.test.ts` (unit)

```ts
import { _calculate } from './ModuleName.component';

jest.mock('module', () => 'module');

describe('Module Name Test', () => {
  it('should calculate a + b', () => {
    const mockA = 1;
    const mockB = 2;

    const result = _calculate(mockA, mockB);

    expect(result).toBe(3);
  });
});
```

### 4.8 `ModuleName.component.snap.ts` (snapshot)

```ts
import test from '@/libs/unit-test';

import UserCardComponent from './ModuleName.component';

const configs = [
  {
    props: {},
    desc: 'Should Render UserCardComponent with default props',
    useHook: true,
  },
  // add more scenarios
];

it('ModuleName matches snapshot', () => {
  test.assertSnapshots(UserCardComponent, configs);
});
```

### 4.9 `index.ts`

```ts
export { default } from './ModuleName.container';
```

---

## 5. Coding Rules

### 5.1 Formatting and style (R-FMT)

- R-FMT-01: Every file ends with exactly one blank line.
- R-FMT-02: Semicolons are mandatory.
- R-FMT-03: Put a blank line before each `return`, `if`, `switch`, and `while`.

### 5.2 Hooks policy (R-HOOK)

- R-HOOK-01: `useState` inside a component is NOT allowed.
- R-HOOK-02: `useEffect` inside a component is NOT allowed.
- R-HOOK-03: Move them to `ModuleName.hook.ts` (or `@src/hooks` if reusable).
- R-HOOK-04: Any function that is a hook MUST be named with the `use` prefix.

### 5.3 Type policy (R-TYPE)

- R-TYPE-01: Define types only in `.type.ts` (or `type/common.type.ts` for shared types).
- R-TYPE-02: Use `type`, NOT `interface`.
- R-TYPE-03: Forbidden (ambiguous shapes):

| Forbidden | Example |
|-----------|---------|
| `Record<string, unknown>` | `type User = Record<string, unknown>;` |
| Index signature | `type UserData = { [key: string]: string \| number };` |
| `unknown` | `let data: unknown;` / `type Data = unknown[];` |
| `any` | `let data: any;` |
| `object` | `let data: object;` |
| Type assertion | `const value = { ... } as User;` |

- Instead: define an explicit type with named fields.

```ts
// Correct
export type User = {
  name: string;
  age: number;
  active: boolean;
};
```

### 5.4 JSDoc policy (R-JSDOC)

- R-JSDOC-01: JSDoc is mandatory for public functions.
- R-JSDOC-02: Explicit return types are mandatory.
- R-JSDOC-03: `any` and `*` are strictly prohibited, including inside JSDoc.
- R-JSDOC-04: Every JSDoc has a function description.
- R-JSDOC-05: Param format = `@param {type} name - description` (hyphen before the description).
- R-JSDOC-06: Optional params go at the END of the function signature.
- R-JSDOC-07: Document an optional param as `{number} [c]`. Do NOT write `{number | undefined} c`.
- R-JSDOC-08: Params appear in JSDoc in the same order as in the signature.
- R-JSDOC-09: Do NOT document destructured sub-properties (`@param {User} user.userName`).
- R-JSDOC-10: Do NOT use inline object types in JSDoc (`{{userName: string, email: string}}`). Reference a named type from `.type.ts`.
- R-JSDOC-11: Do NOT use `{object | any | * | unknown}`.

Correct:

```ts
/**
 * Render Function Calculate
 * @param {number} a - a value
 * @param {number} b - b value
 * @param {number} [c] - c is optional param
 * @returns {number} - Result calculate
 */
const _calculate = (a: number, b: number, c?: number): number => a + b;
```

Incorrect (and why):

```ts
// 1. `{number | undefined}` for an optional param -> use `{number} [c]`
// 2. optional param placed before a required param -> optional must be last
// 3. documenting `user.userName`, `user.email` sub-properties -> not allowed
// 4. inline object type `{{userName: string, email: string}}` -> use a named type
// 5. `{object | any | * | unknown}` -> prohibited
```

### 5.5 Event handler policy (R-EVT)

```tsx
// Incorrect
<Button onClick={() => handleClick()}>Submit</Button>

// Correct
<Button onClick={handleClick}>Submit</Button>
```

### 5.6 Data integrity and fallback policy (R-DATA)

- R-DATA-01: Do not create fallback data merely to make rendering, tests, or TypeScript pass.
- R-DATA-02: Do not replace missing API data with `?? ''`, `|| []`, `|| {}`, fabricated objects, mock records, or hard-coded business values.
- R-DATA-03: Handle loading, empty, error, and unavailable states explicitly.
- R-DATA-04: A default value MAY be used only when it is an intentional product requirement or domain default. Its name or an adjacent comment MUST communicate that intent.
- R-DATA-05: Test fixtures are allowed only inside tests or dedicated fixture files and MUST NOT leak into production code.

Incorrect:

```ts
const users = response.data || [];
const userName = user?.name ?? 'Unknown User';
```

Correct:

```ts
if (!response.data) {
  return handleMissingUserData();
}

const users = response.data;
```

---

## 6. Testing Policy (R-TEST)

- R-TEST-01: Jest is mandatory.
- R-TEST-02: Both snapshot tests and unit tests are mandatory (`.snap.*` and `.test.*` files).
- R-TEST-03: Minimum coverage: >= 70%.
- R-TEST-04: A PR is rejected if coverage is below the threshold.
- R-TEST-05: Test names use the format `should + expected behavior`.
- R-TEST-06: Unit tests MUST focus on the logic or component under test.
- R-TEST-07: Mock only direct external dependencies required to isolate the subject. Do not test imported libraries, global helpers, framework internals, or unrelated child components again.
- R-TEST-08: Assertions MUST verify observable behavior, output, state transition, rendered content, or interaction owned by the subject under test. Avoid assertions tied only to internal implementation details.
- R-TEST-09: Each test file MUST have one clear primary subject. Unrelated logic belongs in its own test file.
- R-TEST-10: Reuse existing global test utilities, render helpers, fixtures, and mocks before creating local duplicates.

```ts
it("should return user data when API succeeds", () => {});
it("should throw an error when token is invalid", () => {});
```

---

## 7. Shared Code (R-SHARED)

| What | Location |
|------|----------|
| Common / shared types | `type/common.type.ts` |
| Shared utilities | `libs/utils` |
| Reusable hooks | `@src/hooks` |

Module-private code stays in the module's `.utils.ts` / `.helpers.ts(x)` / `.type.ts`.

### 7.1 Global code reuse policy (R-REUSE)

- R-REUSE-01: Before creating any helper, utility, hook, API client, service, type, constant, formatter, validator, test utility, or reusable component, search the global/shared code first.
- R-REUSE-02: Before implementation, inspect every relevant global/shared folder listed below. Do not limit the search to `src/libs`.
- R-REUSE-03: Reuse or extend an existing global implementation when it already satisfies the requirement. Do not copy its implementation into a module.
- R-REUSE-04: Import shared code through the repository's existing alias or public export. Do not bypass an available public export with an internal deep import.
- R-REUSE-05: Create module-local code only when the behavior is genuinely specific to that module and is not already available globally.
- R-REUSE-06: Move code to the shared/global area only when it is reused by multiple modules and the move is within the task scope. Do not perform unrelated refactors.
- R-REUSE-07: If similar global code exists but cannot be reused, explain the incompatibility before creating a new implementation.

Global/shared locations:

| Content | Absolute location | Project-relative location |
|---------|-------------------|---------------------------|
| Reusable components | `/home/arbi/project/bantuit/frontend/fe-quoteflow/src/components` | `src/components` |
| Global constants | `/home/arbi/project/bantuit/frontend/fe-quoteflow/src/constant` | `src/constant` |
| Fixtures and test/sample data | `/home/arbi/project/bantuit/frontend/fe-quoteflow/src/fixture` | `src/fixture` |
| Reusable hooks | `/home/arbi/project/bantuit/frontend/fe-quoteflow/src/hooks` | `src/hooks` |
| Global/shared types | `/home/arbi/project/bantuit/frontend/fe-quoteflow/src/types` | `src/types` |
| Global/shared utilities | `/home/arbi/project/bantuit/frontend/fe-quoteflow/src/utils` | `src/utils` |
| Libraries, API clients, services, and infrastructure | `/home/arbi/project/bantuit/frontend/fe-quoteflow/src/libs` | `src/libs` |

Search the folder that matches the code being created and search the other global folders when the responsibility may overlap. For example, inspect both `src/utils` and `src/libs` before creating a formatter or API-related utility.

Required inspection before implementation:

```bash
rg --files src/components src/constant src/fixture src/hooks src/types src/utils src/libs
rg "<relevant-name-or-behavior>" \
  src/components src/constant src/fixture src/hooks src/types src/utils src/libs
```

---

## 8. API Integration (R-API)

- R-API-01: API calls MUST use RTK Query and/or the Axios-based client.
- R-API-02: Direct `fetch` usage is prohibited.
- R-API-03: Use these project imports:

```ts
import apiClient from '@/libs/api/ApiClient/ApiClient';
import {
  useGetByUrlQuery,
  useLazyGetByUrlQuery,
  useMutateByUrlMutation,
} from '@/libs/ApiRtkServices/genericEndpoints.service';
```

- API calls belong in `.container.tsx` (or `.hook.ts` when many hooks), never in `.component.tsx`.

---

## 9. Naming (R-NAME)

### 9.1 General

- Use English.
- Names MUST be descriptive and meaningful.
- Avoid unclear abbreviations (`usr`, `dt`, `val`).
- Keep naming consistent across the project.
- Use singular vs plural correctly.
- Use domain-specific language (e.g. `premiumAmount`, `deductibleValue`).
- Avoid generic names like `data`, `item`, `temp` unless context is very clear.
- Avoid names that are too long (`userDataFromAPIResponseObject`).
- Avoid `var` unless hoisting is truly needed.

### 9.2 Naming table

| Kind | Convention | Good | Bad |
|------|-----------|------|-----|
| Variable | camelCase | `userName`, `totalPrice` | `username` (unclear combined words), `usr`, `x` |
| Boolean | prefix `is` / `has` / `can` / `should` | `isActive`, `hasPermission`, `canEdit`, `shouldReload` | `active`, `permission` |
| Array | plural | `users`, `products`, `orders` | `userList` (prefer plural), `user` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRY`, `API_BASE_URL` | `maxRetry` |
| Function | camelCase, arrow function preferred | `const getCompanyList = () => {}` | `get_user_data()`, `GetUserData()` |
| Private helper function | `_` prefix | `_renderCompanyList` | `renderCompanyListPrivate` |
| Hook | `use` prefix | `useListEffect` | `listEffect` |
| Class | PascalCase | `UserService`, `PaymentController`, `AuthRepository` | `userService` |
| Object variable | camelCase | `userProfile` | `UserProfile` |
| Test title | `should` + expected behavior | `"should throw an error when token is invalid"` | `"test error"` |
| API-related vars | context names | `requestPayload`, `responseData`, `errorMessage` | `payload1`, `res` |

### 9.3 Function prefix by purpose

| Purpose | Prefixes |
|---------|----------|
| Get / fetch | `get*`, `fetch*`, `load*` |
| Create / action | `create*`, `submit*`, `send*` |
| Update | `update*`, `edit*` |
| Delete | `delete*`, `remove*` |
| Boolean return | `is*`, `has*`, `can*` |

- Function style: prefer arrow functions. Use `function` declarations only if you really need hoisting.
- Do not mix naming styles (`get_user_data`, `getUserData`, `GetUserData` in the same project).
- The `_` prefix is reserved ONLY for private helper functions that are not exported outside their module.
- Do NOT prefix components, containers, hooks, event handlers, callbacks, Redux actions, selectors, services, API functions, test subjects, or exported functions with `_`.
- A private helper MAY use `_`, such as `_formatAmount`, `_mapResponse`, or `_renderContent`.

---

## 10. Git (R-GIT)

### 10.1 Type prefixes (for branches AND commits)

| Type | Meaning |
|------|---------|
| `fix` | Bug fix |
| `feat` | New feature |
| `docs` | Documentation only |
| `style` | No change in code meaning (spaces, formatting, semicolons) |
| `refactor` | Neither bug fix nor new feature |
| `perf` | Performance improvement |
| `test` | Add or fix tests |
| `chore` | Build tasks, package manager configs, etc. |

### 10.2 Formats

- Branch: `<type>/<TICKET>-<kebab-case-description>`
  - Example: `feat/IIAU-123-implement-JWT-refresh-token`
- Commit: `<type>(<scope>): [<TICKET>] - <message>`
  - Examples:
    - `feat(product-config): [IIAU-123] - implement jwt refresh token`
    - `feat(case-management): [IIAU-123] - implement jwt refresh token`
    - `feat(components): [IIAU-123] - implement jwt refresh token`
    - `feat(new-business): [IIAU-123] - implement jwt refresh token`
  - `<scope>` = the module / feature area, in kebab-case.

### 10.3 Git Flow branches

| Branch | Purpose |
|--------|---------|
| `feature/*` | Development of specific features |
| `development` | Main integration branch for new features |
| `uat` | Last static environment before production |
| `release/*` | Preparation for release to production |
| `release` | Release to production |

### 10.4 PR description template

```md
Link Ticket: <ticket URL>

📌 Summary:
<one-paragraph summary of the change>

🎯 Purpose / Background:
<why this change is needed>

🛠 Key Changes:
1. <area> — <File.name.tsx>: <what changed>
2. <area> — <File.name.ts>: <what changed>

📸 Screenshots:
<screenshots, or: success build, test, and linter>
```

---

## 11. Enforcement (R-ENF)

All of these MUST pass before merge:

1. ESLint: zero errors.
2. Unit tests pass, coverage >= 70%.
3. Typecheck passes.
4. Branch name follows the convention (Section 10).
5. PR description is detailed (use the template in 10.4).

---

## 12. "Where does this code go?" decision guide

| If you are writing... | Put it in... |
|-----------------------|--------------|
| JSX that only renders props | `.component.tsx` |
| API call / RTK Query hook / Redux mapping | `.container.tsx` (or `.hook.ts` if many hooks) |
| `useState` / `useEffect` | `.hook.ts` (or `@src/hooks` if reusable) |
| A type | `.type.ts` (or `type/common.type.ts` if shared) |
| A constant / feature flag | `.config.ts` |
| A pure function used only by this module (formatting, mapping, calculation) | `.helpers.ts` (or `.utils.ts`) |
| A function that returns JSX but isn't the main component | `.helpers.tsx` |
| Styling | `.style.ts` or `.css` |
| A function reused across modules | `libs/utils` |
| What the outside world imports | `index.ts` |

---

## 13. Pre-completion checklist (run before delivering code)

- [ ] Module follows the standard structure; files are in the right place (Section 3 / 12).
- [ ] No `useState` / `useEffect` inside components.
- [ ] No API calls or Redux in `.component.tsx`.
- [ ] No logic or JSX in `.config.ts` / `.type.ts` / `.style.ts`.
- [ ] Types use `type`, no `interface`, no `any` / `unknown` / `object` / `Record<string, unknown>` / index signature / `as`.
- [ ] Every function has an explicit return type; public functions have JSDoc in the correct format.
- [ ] Optional params are last and documented as `[name]`.
- [ ] Event handlers passed by reference.
- [ ] No direct `fetch`; API uses RTK Query / Axios client.
- [ ] No fabricated or silent fallback data; missing/loading/error/empty states are handled explicitly.
- [ ] All relevant global/shared folders (`components`, `constant`, `fixture`, `hooks`, `types`, `utils`, and `libs`) were searched before creating code.
- [ ] Existing global code is reused through its public export; duplicate helpers/utilities/hooks/components were not introduced.
- [ ] Unit tests focus only on the logic or component under test and reuse existing test utilities.
- [ ] Names follow Section 9 (booleans, arrays, constants, `_` only for private helpers, `use*` for hooks).
- [ ] Semicolons, blank line before `return`/`if`/`switch`/`while`, one blank line at EOF.
- [ ] Unit tests + snapshot tests added, coverage >= 70%.
- [ ] Branch name, commit message, and PR description follow Section 10.

---

## 14. React Project Boundaries

- The project MUST use standard React components and hooks.
- Next.js-specific imports, directives, routing conventions, Server Components, Server Actions, and `.wrapper.tsx` files MUST NOT be introduced.
- Routing MUST follow the routing library already installed in the project. Do not assume a router when none is configured.
- Build-tool-specific APIs MUST follow the tool already configured in the repository. Do not assume Vite, Create React App, Webpack, or another bundler without inspecting the project.
- Browser environment variables MUST follow the prefix and access pattern required by the configured build tool.
- Data fetching MUST follow Section 8 and remain in `.container.tsx` or `.hook.ts`.
- Application entry points and providers MUST follow the existing repository structure.

## 15. Design System

The canonical design-system documentation is located at:

`docs/design-system/`

For any task that creates, modifies, reviews, or tests UI, layout,
styling, visual states, responsive behavior, accessibility, or
user-facing content:

1. Read `docs/design-system/README.md`.
2. Read `docs/design-system/FOUNDATIONS.md`.
3. Read only the task-specific document:
   - Component task -> `COMPONENTS.md`
   - Page or layout task -> `PAGE_PATTERNS.md`
   - UI review or completion -> `UI_CHECKLIST.md`
4. Inspect the nearest existing implementation.
5. Inspect approved reference images when available.
6. Verify light and dark themes.
7. Run `UI_CHECKLIST.md` before completing the task.

Do not read every design-system document for tasks unrelated to UI.

If implementation and documentation conflict:

1. Do not silently introduce another pattern.
2. Report the conflict.
3. Determine which source is current.
4. Update documentation only when requested or clearly within scope.
