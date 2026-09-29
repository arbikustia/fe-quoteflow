# FE Code Convention — ASUM Next.js Frontend Application

## Table of Contents
1. [Purpose & Scope](#1-purpose--scope)
2. [Module Architecture Standard](#2-module-architecture-standard)
3. [File Responsibility & Examples](#3-file-responsibility--examples)
4. [Enterprise Coding Rules](#4-enterprise-coding-rules)
5. [Testing Policy](#5-testing-policy)
6. [Shared Code Rules](#6-shared-code-rules)
7. [API Integration Standard](#7-api-integration-standard)
8. [Naming Variables & Functions](#8-naming-variables--functions)
9. [Git](#9-git)
10. [Enforcement](#10-enforcement)
11. [Conclusion](#11-conclusion)

---

## 1. Purpose & Scope

This document defines the **official enterprise coding standards** for Next.js frontend development.

**Goals:**
- Enforce **consistency** across teams
- Improve **maintainability and scalability**
- Reduce **technical debt**
- Ensure **testability and code quality**

> ⚠️ This convention **MUST** be followed by all contributors.

---

## 2. Module Architecture Standard

### 2.1 Standard Module Structure

Every module **MUST** follow this directory structure:

```
ModuleName/
├── ModuleName.component.tsx
├── ModuleName.component.snap.ts
├── ModuleName.component.test.ts
├── ModuleName.container.tsx
├── ModuleName.container.snap.tsx
├── ModuleName.container.test.ts
├── ModuleName.type.ts
├── ModuleName.config.ts
├── ModuleName.style.ts
├── ModuleName.wrapper.tsx
├── ModuleName.hook.ts
└── index.ts
```

---

## 3. File Responsibility & Examples

### 3.1 `ModuleName.component.tsx`

**Responsibility:**
- Pure UI component
- No API calls
- No Redux / side effects
- Receives data via props only
- Accept Event Handler

**Example:**
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

---

### 3.2 `ModuleName.container.tsx`

**Responsibility:**
- Business logic
- Redux / RTK Query _(if you consume a lot of hooks, move them to the `.hook.ts` file)_
- API interaction
- Prop mapping

**Example:**
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
const UserCardContainer = (props: Props) => {
  const { data } = useGetUserQuery();

  return (
    <UserCardComponent
      name={data?.name ?? ''}
      email={data?.email ?? ''}
    />
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserCardContainer);
```

---

### 3.3 `ModuleName.wrapper.tsx`

**Responsibility:**
- Server ↔ Client Component bridge
- Place of **SSR** implementation
- Used for Next.js App Router

**Example:**
```tsx
'use server'

import ModuleNameContainer from './ModuleName.container';

const ModuleNameContainerWrapper = async () => {
  return <ModuleNameContainer />;
};

export default ModuleNameContainerWrapper;
```

---

### 3.4 `ModuleName.type.ts`

**Responsibility:**
- Centralized typing
- Only define types here
- No logic
- No JSX

> ❌ Avoid using `Interface` — use `type` instead.

**Example:**
```ts
export type UserCardProps = {
  name: string;
  email: string;
};
```

---

### 3.5 `ModuleName.config.ts`

**Responsibility:**
- Static configuration
- Constants
- Feature flags

**Example:**
```ts
export const USER_CARD_CONFIG = {
  MAX_NAME_LENGTH: 50,
};
```

---

### 3.6 `ModuleName.style.ts`

**Responsibility:**
- Styling only
- No logic

**Example:**
```ts
// for inline style
import { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
};

export default styles;
```

---

### 3.7 `ModuleName.hook.ts`

**Responsibility:**
- Encapsulate `useState` and `useEffect`
- If your component has a lot of hooks, move them here
- Reusable logic
- If the hook is reusable, create it in the `@src/hooks` folder

**Example:**
```ts
import { useEffect, useState } from 'react';

export const useUserState = () => {
  const [isActive, setIsActive] = useState(false);

  return { isActive };
};

export const useUserEffect = () => {
  useEffect(() => {
    setIsActive(true);
  }, []);
};
```

---

### 3.8 `ModuleName.component.test.ts`

**Responsibility:**
- Unit testing functional behavior by scenario

**Example:**
```ts
import { _calculate } from './ModuleName.component';

jest.mock('module', () => 'module');

describe('Module Name Test', () => {
  it('Should calculate a + b', () => {
    const mockA = 1;
    const mockB = 2;

    const result = _calculate(mockA, mockB);

    expect(result).toBe(3);
  });
});
```

---

### 3.9 `ModuleName.component.snap.ts`

**Responsibility:**
- Snapshot testing by scenario

**Example:**
```ts
import test from '@/libs/unit-test';

import UserCardComponent from './ModuleName.component';

const configs = [
  {
    props: {},
    desc: 'Should Render UserCardComponent with default props',
    useHook: true,
  },
  // ...
];

it('ModuleName matches snapshot', () => {
  test.assertSnapshots(UserCardComponent, configs);
});
```

---

### 3.10 `index.ts`

**Responsibility:**
- Public module exports
- Clean import interface

**Example:**
```ts
export { default } from './ModuleName.wrapper';
```

---

## 4. Enterprise Coding Rules

### 4.1 Formatting & Style

- One blank line at the end of every file
- Semicolons are **mandatory**
- Add a blank line **before** the following keywords:
  - `return`
  - `if`
  - `switch`
  - `while`

---

### 4.2 Hooks Policy

| Rule | Status |
|------|--------|
| `useState` inside component | ❌ NOT allowed |
| `useEffect` inside component | ❌ NOT allowed |
| Must be moved to `.hook.ts` files | ✅ Required |

---

### 4.3 JSDoc Typing Policy

- JSDoc is **mandatory** for all public functions
- Explicit return types are **mandatory**
- `any` and `*` are **strictly prohibited**
- Always add a function description
- JSDoc format: `Name, type, and description` — with a hyphen before the description
- Place optional params at the **end** of function params

**✅ Correct Example:**
```ts
/**
 * Render Function Calculate
 * @param {number} a - a value
 * @param {number} b - b value
 * @param {number} [c] - c is optional params
 * @returns {number} - Result calculate
 */
const _calculate = (a: number, b: number, c?: number): number => a + b;
```

**❌ Incorrect Examples:**

```ts
// ❌ Using `number | undefined` for optional param type
* @param {number | undefined} c - c is optional params

// ❌ Optional param placed before required param
const _calculate = (a: number, c?: number, b: number): number => a + b;

// ❌ Destructuring object properties in JSDoc
* @param {User} user.userName
* @param {User} user.email

// ❌ Inline object type in JSDoc
* @param {{userName: string, email: string}} user

// ❌ Using object / any / * / unknown as param type
* @param {object | any | * | unknown} user
```

---

### 4.4 Event Handler Policy

**❌ Incorrect:**
```tsx
<Button onClick={() => handleClick()}>Submit</Button>
```

**✅ Correct:**
```tsx
<Button onClick={handleClick}>Submit</Button>
```

---

## 5. Testing Policy

| Requirement | Detail |
|-------------|--------|
| Test framework | Jest (mandatory) |
| Test types | Snapshot + Unit tests (both mandatory) |
| Minimum coverage | ≥ 70% |
| PR rejection | PRs will be rejected if coverage is below threshold |

---

## 6. Shared Code Rules

### 6.1 Common Types

Shared types go in:
```
type/common.type.ts
```

### 6.2 Shared Utilities

Shared utility functions go in:
```
libs/utils
```

---

## 7. API Integration Standard

API calls **MUST** use one of:
- **RTK Query**
- **Axios-based** client

```ts
import apiClient from '@/libs/api/ApiClient/ApiClient';
import {
  useGetByUrlQuery,
  useLazyGetByUrlQuery,
  useMutateByUrlMutation,
} from '@/libs/ApiRtkServices/genericEndpoints.service';
```

> ❌ Direct `fetch` usage is **prohibited**.

---

## 8. Naming Variables & Functions

### 8.1 General Principles

- Use **English**
- Names must be **descriptive and meaningful**
- Avoid unclear abbreviations: `usr`, `dt`, `val`
- Keep naming **consistent** across the project

> ⚠️ Avoid using `var` unless you explicitly need hoisting behavior.

---

### 8.2 Variable Naming

**✅ Use camelCase:**
```ts
const userName = "Camel Case";
const totalPrice = 10000;
const isLoggedIn = true;
```

**❌ Avoid:**
```ts
const username = "Subhan";  // unclear combined words
const usr = "Subhan";       // too short
const x = 10000;            // not meaningful
```

**Boolean Variables — use prefixes:**
```ts
const isActive = true;
const hasPermission = false;
const canEdit = true;
const shouldReload = false;
```
Allowed prefixes: `is`, `has`, `can`, `should`

**Arrays — use plural form:**
```ts
const users = [];
const products = [];
const orders = [];
```

**Constants — use UPPER_SNAKE_CASE:**
```ts
const MAX_RETRY = 3;
const API_BASE_URL = "https://api.example.com";
```

---

### 8.3 Function Naming

**✅ Use camelCase. Arrow functions are recommended:**
```ts
// ✅ Arrow function (recommended)
const getCompanyList = () => {};

// ⚠️ Function declaration (only when hoisting is needed)
function getUserData() {}
```

**Special prefixes:**
```ts
// Private function → prefix with _ (underscore)
const _renderCompanyList = () => {};

// Hook → prefix with `use`
const useListEffect = () => {};
```

**Prefixes by purpose:**

| Purpose | Prefix | Example |
|---------|--------|---------|
| Getter / Fetching | `get`, `fetch`, `load` | `getUser()`, `fetchProducts()` |
| Create / Actions | `create`, `submit`, `send` | `createUser()`, `submitForm()` |
| Update | `update`, `edit` | `updateProfile()`, `editUser()` |
| Delete | `delete`, `remove` | `deleteUser()`, `removeItem()` |
| Boolean return | `is`, `has`, `can` | `isValidEmail()`, `hasAccess()` |

---

### 8.4 Object & Class Naming

**Classes → PascalCase:**
```ts
class UserService {}
class PaymentController {}
class AuthRepository {}
```

**Object variables → camelCase:**
```ts
const userProfile = {
  firstName: "Brillian",
  lastName: "Andrie",
};
```

---

### 8.5 Context-Based Naming (Best Practice)

**API / Backend:**
```ts
const requestPayload = {};
const responseData = {};
const errorMessage = "";
```

**Testing (Jest / Unit Test) — use format: `should + expected behavior`:**
```ts
it("should return user data when API succeeds", () => {});
it("should throw an error when token is invalid", () => {});
```

---

### 8.6 What to Avoid

**❌ Inconsistent naming:**
```ts
get_user_data()   // snake_case
getUserData()     // camelCase
GetUserData()     // PascalCase
// → Pick one and stick with it
```

**❌ Non-descriptive names:**
```ts
const data = {};
const temp = {};
```

**❌ Overly verbose names:**
```ts
const userDataFromAPIResponseObject = {}; // too long
```

---

### 8.7 Additional Tips

- Use **singular vs plural** correctly
- Use **domain-specific language**: e.g., `premiumAmount`, `deductibleValue`
- Avoid generic names like `data`, `item` unless context is very clear

---

## 9. Git

### Commit & Branch Type Guide

| Prefix | Purpose |
|--------|---------|
| `fix` | Bug fix |
| `feat` | Addition of a new feature |
| `docs` | Documentation changes only |
| `style` | Changes that do not affect code meaning (spaces, formatting, semicolons) |
| `refactor` | Code changes that are neither bug fixes nor new features |
| `perf` | Code changes to improve performance |
| `test` | Adding or fixing tests (test suite) |
| `chore` | Updates to build tasks, package manager configs, etc. |

**Examples:**
```
Branch:         feat/IIAU-123-implement-JWT-refresh-token
Commit message: feat(product-config): [IIAU-123] - implement jwt refresh token
```

### Git Branching Strategy (Git Flow)

| Branch | Purpose |
|--------|---------|
| `feature/*` | Development of specific features. Branch off from `development` |
| `development` | Main branch for new feature integration |
| `uat` | Last static environment before entering production |
| `release/*` | Preparation for release to production |
| `release` | For release to production |

**Git Flow Order:**
```
feature/* → development → uat → release/* → release
```

---

## 10. Enforcement

All of the following **must pass** before code can be merged:

- ✅ ESLint errors must be resolved
- ✅ Unit tests must pass
- ✅ Typecheck must pass

> ❌ **Non-compliant code WILL NOT be merged.**

---

## 11. Conclusion

This convention ensures:

- **Enterprise-level code quality**
- **Clear separation of concerns**
- **Scalable Next.js architecture**
- **Long-term maintainability**
