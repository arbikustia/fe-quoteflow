# Responsive migration audit

Scope: `src/app/**/index.tsx` and `src/modules/**`.

JS viewport detection found in these page entry files before migration:

- `src/app/dashboard/index.tsx`
- `src/app/order/index.tsx`
- `src/app/return/index.tsx`
- `src/app/report/index.tsx`
- `src/app/master-main/index.tsx`
- `src/app/order/detail/index.tsx`
- `src/app/order/create/index.tsx`
- `src/app/return/detail/index.tsx`

Each used `window.innerWidth <= 768`, `isMobile`, `useState`, and `useEffect`.

Initial migration removes viewport branching from:

- `src/app/dashboard/index.tsx`
- `src/app/order/index.tsx`
- `src/app/return/index.tsx`
- `src/app/report/main/index.tsx`

Remaining entries stay on legacy layouts for phased migration. No `isMobile` or `window.innerWidth` usage found in `src/modules/**`.

Responsive breakpoint contract:

- Mobile shell: `lg:hidden`
- Desktop sidebar/navbar: `hidden lg:flex` / `hidden lg:block`
- Content: `p-4 pb-20 lg:p-8 lg:pb-8`
