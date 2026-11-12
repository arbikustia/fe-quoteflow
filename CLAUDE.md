# CLAUDE.md

QuoteFlow: an employee-facing quotation and rental-management web app for Sonicline Multimedia
(dashboard, master data, orders, quotations, invoices, payments, item checklist/return, mail, notes,
reports, permissions).

## Stack

React 19 + TypeScript 6 + Vite 8, Redux Toolkit / RTK Query over Axios, React Router 7, Ant Design 6,
Tailwind 4, react-hook-form, Zod 4, jsPDF (+ autotable), Jest 30 + Testing Library, Playwright.

## Commands

```bash
npm run dev            # Vite on 127.0.0.1:5173
npm run build
npm run lint           # ESLint (must be 0 errors)
npx tsc -p tsconfig.app.json --noEmit
npm test               # jest --runInBand; coverage threshold 70% global
npx jest path/to/file.test.tsx            # single test
npx jest -u path/to/X.component.snap.tsx  # update a snapshot
npx playwright test    # e2e (e2e/tests, auth via auth.setup.ts → e2e/.auth/user.json)
```

## Code convention (mandatory)

Before writing, changing, reviewing or testing code, use the `code-convention` skill
(`.claude/skills/code-convention/SKILL.md`). The source of truth is
`../FE_Code_Convention_React.md`; query it with:

```bash
python3 .claude/skills/code-convention/scripts/convention_rag.py query "<topic>"
python3 .claude/skills/code-convention/scripts/convention_rag.py section 4.3
```

Project-specific decision: no lodash; fallbacks use Zod `.default()` once upstream.

## Layout

| Path | Role |
|---|---|
| `src/main.tsx` | Root: Redux `Provider` → `ThemeProvider` → `App` |
| `src/App.tsx` | All routes (`BrowserRouter`). `/` → `/login`; `/home` is the dashboard |
| `src/app/<page>/` | Thin route pages: each `index.tsx` only renders a module. `app/shared/` holds layouts (`PageLayout`, `ResponsiveLayout`, `MobileLayout`), `GlobalHeader`, `PagePermissionGuard` |
| `src/modules/<feature>/[sub]/` | Feature logic using the module file pattern (below). Master data lives in `modules/master-data/master-*` |
| `src/components/<Name>/` | Shared UI primitives (Table, Modal, Drawer, Select, DatePicker, Sidebar, Navbar, RichTextEditor, …) |
| `src/services/` | RTK Query endpoint injections + API→UI mappers, one per domain |
| `src/libs/api/ApiClient/ApiClient.ts` | Axios instance (base URL `https://hostmail.bantuit.com`). Adds the Bearer token from `localStorage.access_token`; the response interceptor auto-posts `/api/activity-log` for master-data endpoints |
| `src/libs/ApiRtkServices/` | `apiRtkClient` (`createApi` on an axios base query) and `genericEndpointsService` (`useGetByUrlQuery`, `useMutateByUrlMutation`) |
| `src/libs/unit-test.ts` | The only allowed test import: re-exports RTL + `test.assertSnapshots` (renders inside `MemoryRouter`) |
| `src/store/` | `configureStore` (theme slice + RTK Query api), typed hooks, `ThemeProvider` |
| `src/hooks/` | Shared hooks: `usePagination`, `usePagePermission`, `useSidebarCollapse`, `useActivityLog` |
| `src/types/` | Shared types: `common.type`, `api.type`, `pagination.type`, `master` |
| `src/constants/` | `endpoint.constant.ts` (`ENDPOINT`), `common.constant.ts`, `regex.constant.ts` |
| `src/utils/` | `pdfGenerator.ts` (quotation/invoice PDFs), `date.helpers`, `pagination.helpers` |
| `src/fixture/` | Test fixtures |
| `docs/design-system/` | UI foundations, components, page patterns, UI checklist. Follow these for UI work |
| `docs/manual-book/` | End-user manual |

Path alias: `@/*` → `src/*` (Vite, tsconfig, Jest).

## Module file pattern

Example: `src/modules/order/create/`

```
OrderCreate.container.tsx   # calls hooks, single upstream fallback, maps props
OrderCreate.component.tsx   # pure UI, props only, no hooks
OrderCreate.hook.ts         # useState/useEffect/useMemo/useCallback
OrderCreate.wrapper.tsx     # Suspense/boundaries/providers only (optional)
OrderCreate.type.ts         # Zod schemas + z.infer types (optional)
OrderCreate.config.ts       # static constants (optional)
OrderCreate.helpers.ts      # pure view helpers, state via params (+ test)
*.test.ts(x), *.snap.tsx    # unit + snapshot tests (__snapshots__/)
index.ts                    # exports the entry (wrapper or container)
```

Older modules (e.g. `quotation/detail`, `*.sections.tsx`) do not fully follow the pattern. Apply the
convention to new and changed code only.

## Gotchas

- **Duplicate service files.** Most domains have both `src/services/<x>.service.ts` and
  `src/services/<x>/<x>.service.ts`. Modules mostly import the flat file. `mail` imports the nested
  `quotation/quotation.service`. Check which one the module you are working on imports, and update
  both if they diverge.
- Domain API types (e.g. `ApiQuotation`) are defined in `src/modules/<feature>/<Feature>.type.ts` and
  imported by services, not the other way round.
- `apiClient` is only for the service/lib layer. Modules use RTK Query hooks.
- Jest only matches `*.test.ts(x)` and `*.snap.ts(x)` under `src/`. Coverage excludes `*.type`,
  `*.config`, `index`, `*.wrapper`, `*.style` and `src/types`.
- The dev server allows host `dev.arbikustia.site` with HMR `clientPort: 443` (reverse-proxied).
- Git: work on a feature branch; PRs target `development`. Commit format
  `<type>(<scope>): [BIT-<n>] <summary>` (see convention Section 10).
