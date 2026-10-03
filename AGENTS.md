# Project: Quoteflow (ASUM Frontend)

## Tech Stack
- React 18, TypeScript 5, Vite, Tailwind CSS
- Node.js, React Router

## Commands
- Build: `npm run build`
- Test: `npm run test`
- Lint: `npm run lint`
- Type Check: `npx tsc --noEmit`

## Code Conventions (from FE_Code_Convention.md)
- Strict module file separation (component, container, wrapper, type, config, style, hook, test, snap, index)
- Pure UI components (no API / Redux)
- Hooks in `.hook.ts` (useState/useEffect forbidden inside components)
- Mandatory JSDoc with explicit types (no `any`, no inline object types, optional params at the end)
- Boolean variables: `is`, `has`, `can`, `should`
- Arrays: plural form
- Constants: UPPER_SNAKE_CASE
- Arrow functions preferred, private functions prefixed with `_`
- Testing: Jest, snapshot + unit test >= 70% coverage

## Master Data Layout & Data Models
- Layout standard: Responsive cards grid (e.g., `grid-cols-1 md:grid-cols-3 gap-6`) with `brand-*` styling.
- Navigation: Centralized master main cards mapping to modules (`/master-user`, `/master-category`, `/master-item`).
