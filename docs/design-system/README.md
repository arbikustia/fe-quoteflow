# QuoteFlow Design System

Status: In development  
Brand: Sonicline Multimedia  
Product: QuoteFlow

## Purpose

QuoteFlow Design System is the shared visual and interaction language for Sonicline's employee-facing quotation and rental-management application.

It exists to make the interface consistent, accessible, efficient, and recognizable across dashboard, master data, quotation, return, and report workflows.

The design system prioritizes:

- Fast and accurate data entry.
- Clear quotation and order status.
- Readable tables and reports.
- Predictable actions and navigation.
- Consistent light and dark themes.
- Accessibility and long-session comfort.
- Reuse over duplicate implementation.

## Design Direction

- Modern enterprise.
- Professional and trustworthy.
- Clean and data-focused.
- Medium density.
- Minimal decoration.
- Border-first surfaces.
- Restrained shadows.
- Sonicline blue as the primary interaction color.
- Sonicline orange as a restricted brand accent.

## Documentation

| Document | Purpose | Status |
|---|---|---|
| [`FOUNDATIONS.md`](./FOUNDATIONS.md) | Theme, colors, typography, spacing, sizing, radius, shadow, layout, accessibility, and Tailwind direction | Initial |
| [`COMPONENTS.md`](./COMPONENTS.md) | Component anatomy, variants, states, behavior, and accessibility | Initial |
| [`PAGE_PATTERNS.md`](./PAGE_PATTERNS.md) | Dashboard, list, form, detail, return, and report structures | Initial |
| [`UI_CHECKLIST.md`](./UI_CHECKLIST.md) | Required quality gate for UI implementation and review | Initial |

## Source of Truth

Use this priority when sources overlap:

1. Approved design tokens and shared components implemented in the repository.
2. Documents inside `docs/design-system`.
3. Approved reference pages and screenshots.
4. Current feature requirements.
5. Obsidian design notes and historical discussion.
6. General assumptions.

Do not silently resolve a conflict. Report conflicts that affect behavior, accessibility, or visual consistency.

## Required Reading

Before creating or modifying UI:

1. Read this README.
2. Read `FOUNDATIONS.md`.
3. Read the task-specific document below.
4. Inspect the nearest implemented page with the same purpose.
5. Inspect reusable components, layouts, tokens, and utilities.
6. Check an approved reference image when one exists.
7. Verify light and dark themes.

| Task | Additional document |
|---|---|
| Create or change a component | `COMPONENTS.md` |
| Create or change a page layout | `PAGE_PATTERNS.md` |
| Review or complete UI work | `UI_CHECKLIST.md` |
| Change tokens or themes | `FOUNDATIONS.md` |

Do not load unrelated design documents merely to increase context.

## Implementation Locations

Inspect these locations before creating reusable code:

```text
src/components
src/constant
src/fixture
src/hooks
src/types
src/utils
src/libs
```

When present, also inspect:

```text
src/layouts
src/styles
```

Reuse or extend existing global code whenever it satisfies the requirement. If similar code cannot be reused, document the incompatibility before adding another implementation.

## Token Architecture

```text
Primitive palette
→ semantic CSS variables
→ Tailwind semantic utilities
→ shared components
→ page patterns
→ feature pages
```

Feature code should use semantic classes:

```tsx
<main className="bg-background-page text-text-primary">
  <button className="bg-action-primary text-text-inverse hover:bg-action-primary-hover">
    Create quotation
  </button>
</main>
```

Feature code should not depend directly on raw palette values:

```tsx
<button className="bg-blue-600 text-white hover:bg-blue-700">
  Create quotation
</button>
```

## Current Status

| Area | Status |
|---|---|
| Brand palette | Defined |
| Light theme | Defined |
| Dark theme | Defined |
| Typography | Defined |
| Spacing and sizing | Defined |
| Radius and elevation | Defined |
| Component rules | Defined; implementation audit pending |
| Page patterns | Defined; reference audit pending |
| Icon library | Pending selection |
| Tailwind implementation | Pending |
| Reference screenshots | Pending |
| Visual regression tests | Pending |

## Contribution Workflow

Before adding a token, component, variant, or layout:

1. Search documentation and shared code.
2. Confirm that no existing pattern satisfies the requirement.
3. Explain the unmet need.
4. Propose the smallest reusable extension.
5. Define light and dark behavior.
6. Define interaction states and accessibility.
7. Add tests and usage examples.
8. Update the relevant documentation and status.

Do not create a design-system pattern solely for one isolated screen without review.

## Anti-AI-Slop Baseline

Do not introduce:

- Unapproved colors or arbitrary Tailwind values.
- Decorative gradients.
- Excessive cards.
- Oversized headings or wasteful empty space.
- Decorative icons without functional meaning.
- Glassmorphism, glow, or excessive blur.
- Random shadows and radii.
- Marketing-style sections inside employee workflows.
- Unnecessary metric cards.
- Duplicate shared components.
- A visual language used on only one page.

If no approved pattern exists, propose a reusable extension instead of improvising.

## Repository Structure

```text
docs/design-system/
├── README.md
├── FOUNDATIONS.md
├── COMPONENTS.md
├── PAGE_PATTERNS.md
├── UI_CHECKLIST.md
└── references/
    ├── dashboard/
    ├── list/
    ├── form/
    ├── detail/
    ├── return/
    └── report/
```

Stable design decisions belong in the repository. Obsidian may contain exploration, feedback, meeting notes, and historical rationale.
