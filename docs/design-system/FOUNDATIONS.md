# QuoteFlow Design System Foundations

Status: Initial foundation  
Version: 0.1  
Brand: Sonicline Multimedia  
Product: QuoteFlow

## 1. Product Context

QuoteFlow is an internal B2B application that helps Sonicline employees create and manage quotations for a rental business.

Primary modules:

- Dashboard: quotation metrics and status visualization.
- Master Data: category, customer, item, payment method, payment type, PIC, project/bundle, role, service type, user, and voucher.
- Order: quotation list and quotation form.
- Return: confirmation that rented items have been returned and the order is complete.
- Report: operational and quotation reporting.

The interface must prioritize efficient data entry, readable tables, clear quotation status, predictable actions, and long-session comfort for employees.

## 2. Design Direction

The approved visual direction is:

- Modern enterprise.
- Professional and trustworthy.
- Clean and data-focused.
- Medium information density.
- Minimal decoration.
- Strong and predictable visual hierarchy.
- Border-first surfaces with restrained shadows.
- Light and dark themes.

The interface must not resemble a generic marketing dashboard. It must feel like an operational tool designed around quotation workflows.

## 3. Core Principles

### 3.1 Clarity over decoration

Every visual element must support hierarchy, comprehension, navigation, status, or action. Decorative elements without a functional purpose must not be added.

### 3.2 Consistency over novelty

Reuse established tokens, components, layouts, and page patterns. A new visual pattern requires a documented use case and must be reusable beyond one isolated screen.

### 3.3 Explicit application states

Components and pages must define loading, empty, error, disabled, read-only, selected, and success states where applicable.

### 3.4 Efficient employee workflows

Forms and tables must minimize unnecessary clicks, scrolling, repeated input, and context switching.

### 3.5 Accessible by default

The target is WCAG 2.2 AA. Status and meaning must never depend on color alone.

## 4. Brand Colors

The palette is derived from the Sonicline logo. Sonicline blue is the primary interaction color. Sonicline orange is a restricted brand accent.

### 4.1 Primary — Sonicline Blue

| Token | Value |
|---|---|
| `primary-50` | `#EEF2FF` |
| `primary-100` | `#E0E7FF` |
| `primary-200` | `#C7D2FE` |
| `primary-300` | `#A5B4FC` |
| `primary-400` | `#7188FA` |
| `primary-500` | `#4A75F5` |
| `primary-600` | `#3550D7` |
| `primary-700` | `#2D43B8` |
| `primary-800` | `#293A91` |
| `primary-900` | `#273672` |
| `primary-950` | `#172047` |

Primary usage:

- Primary buttons.
- Links.
- Active navigation.
- Focus rings.
- Selected controls and rows.
- Information that represents an active interaction.

Default interaction mapping:

| State | Token |
|---|---|
| Default | `primary-600` |
| Hover | `primary-700` |
| Pressed | `primary-800` |
| Subtle background | `primary-50` |
| Focus ring | `primary-300` |

### 4.2 Accent — Sonicline Orange

| Token | Value |
|---|---|
| `accent-50` | `#FFF7ED` |
| `accent-100` | `#FFEDD5` |
| `accent-200` | `#FED7AA` |
| `accent-300` | `#FDBA74` |
| `accent-400` | `#FB923C` |
| `accent-500` | `#FF6E02` |
| `accent-600` | `#E85D00` |
| `accent-700` | `#C44B00` |
| `accent-800` | `#9C3C06` |
| `accent-900` | `#7C320B` |
| `accent-950` | `#431704` |

Accent usage is limited to:

- Brand highlights.
- Selected dashboard metrics.
- Notification dots.
- Small chart highlights.
- Intentional visual emphasis that is not a semantic warning.

Orange must not replace the primary color for standard actions and must not be used merely to make a screen more colorful.

## 5. Neutral Colors

| Token | Value |
|---|---|
| `neutral-0` | `#FFFFFF` |
| `neutral-50` | `#F8FAFC` |
| `neutral-100` | `#F1F5F9` |
| `neutral-200` | `#E2E8F0` |
| `neutral-300` | `#CBD5E1` |
| `neutral-400` | `#94A3B8` |
| `neutral-500` | `#64748B` |
| `neutral-600` | `#475569` |
| `neutral-700` | `#334155` |
| `neutral-800` | `#1E293B` |
| `neutral-900` | `#0F172A` |
| `neutral-950` | `#080F1F` |

Neutral colors provide page backgrounds, surfaces, borders, text hierarchy, disabled states, and overlays.

## 6. Semantic Colors

Brand colors and semantic colors have different responsibilities. Sonicline orange does not automatically mean warning.

| Meaning | Default | Subtle background | Strong text |
|---|---|---|---|
| Success | `#16A34A` | `#F0FDF4` | `#166534` |
| Warning | `#D97706` | `#FFFBEB` | `#92400E` |
| Danger | `#DC2626` | `#FEF2F2` | `#991B1B` |
| Information | `#2563EB` | `#EFF6FF` | `#1E40AF` |

Dark-theme semantic backgrounds must use dark translucent or low-lightness equivalents while maintaining readable foreground contrast.

## 7. Semantic Theme Tokens

Components must consume semantic tokens instead of raw palette values. For example, use `background-surface` instead of `neutral-0` and `action-primary` instead of `primary-600`.

### 7.1 Light theme

| Semantic token | Value |
|---|---|
| `background-page` | `#F8FAFC` |
| `background-surface` | `#FFFFFF` |
| `background-subtle` | `#F1F5F9` |
| `background-elevated` | `#FFFFFF` |
| `background-disabled` | `#F1F5F9` |
| `text-primary` | `#0F172A` |
| `text-secondary` | `#475569` |
| `text-tertiary` | `#64748B` |
| `text-disabled` | `#94A3B8` |
| `text-inverse` | `#FFFFFF` |
| `border-default` | `#E2E8F0` |
| `border-strong` | `#CBD5E1` |
| `border-focus` | `#A5B4FC` |
| `action-primary` | `#3550D7` |
| `action-primary-hover` | `#2D43B8` |
| `action-primary-pressed` | `#293A91` |
| `action-primary-subtle` | `#EEF2FF` |
| `focus-ring` | `#A5B4FC` |
| `sidebar-background` | `#FFFFFF` |
| `table-header` | `#F8FAFC` |
| `overlay` | `rgba(15, 23, 42, 0.48)` |

### 7.2 Dark theme

| Semantic token | Value |
|---|---|
| `background-page` | `#080F1F` |
| `background-surface` | `#0F172A` |
| `background-subtle` | `#162033` |
| `background-elevated` | `#1E293B` |
| `background-disabled` | `#1E293B` |
| `text-primary` | `#F8FAFC` |
| `text-secondary` | `#CBD5E1` |
| `text-tertiary` | `#94A3B8` |
| `text-disabled` | `#64748B` |
| `text-inverse` | `#0F172A` |
| `border-default` | `#293548` |
| `border-strong` | `#3B4A60` |
| `border-focus` | `#4A75F5` |
| `action-primary` | `#7188FA` |
| `action-primary-hover` | `#8FA0FC` |
| `action-primary-pressed` | `#A5B4FC` |
| `action-primary-subtle` | `#172047` |
| `focus-ring` | `#4A75F5` |
| `sidebar-background` | `#0B1324` |
| `table-header` | `#162033` |
| `overlay` | `rgba(0, 0, 0, 0.64)` |

Dark mode must use layered dark navy surfaces. It must not be implemented by simply inverting light-theme colors or using pure black for every surface.

## 8. Quotation and Order Status

| Status | Color family | Required treatment |
|---|---|---|
| Draft | Neutral | Text label and neutral badge |
| Pending review | Amber | Text label and warning badge |
| Sent | Blue | Text label and information badge |
| Viewed | Cyan | Text label and distinct icon when needed |
| Approved | Green | Text label and success badge |
| Rejected | Red | Text label and danger badge |
| Expired | Red-orange | Text label and expiration indicator |
| Cancelled | Neutral dark | Text label and muted badge |
| In progress | Purple | Text label and progress indicator |
| Completed | Teal | Text label and completed indicator |
| Returned | Green | Text label and return confirmation indicator |

Status must never be communicated by color alone. Use a text label and, when useful, an icon.

## 9. Typography

Primary font stack:

```css
font-family: Inter, ui-sans-serif, system-ui, sans-serif;
```

| Role | Size | Line height | Weight |
|---|---:|---:|---:|
| Page title | 24px | 32px | 600 |
| Section title | 18px | 28px | 600 |
| Component title | 16px | 24px | 600 |
| Body large | 16px | 24px | 400 |
| Body | 14px | 20px | 400 |
| Body emphasized | 14px | 20px | 500 |
| Label | 13px | 18px | 500 |
| Caption | 12px | 16px | 400 |
| Button | 14px | 20px | 500 |

Rules:

- Use sentence case for headings, labels, buttons, and table headers.
- Do not use uppercase text for ordinary labels or actions.
- Use `font-variant-numeric: tabular-nums` for prices, totals, percentages, quantities, and report columns.
- Body text defaults to 14px because QuoteFlow is an operational application with dense forms and tables.
- Avoid excessive weight differences; hierarchy should also use spacing, size, and placement.

## 10. Spacing

The spacing system uses a 4px base unit.

| Token | Value |
|---|---:|
| `space-0` | 0px |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

Context defaults:

| Context | Value |
|---|---:|
| Label to control | 8px |
| Related inline elements | 8px |
| Form fields | 16px |
| Form subsections | 24px |
| Major form sections | 32px |
| Card padding | 20–24px |
| Desktop page padding | 24–32px |
| Mobile page padding | 16px |
| Button icon gap | 8px |

Margin, padding, and gap must use this shared spacing scale. Arbitrary spacing values require a documented reason.

## 11. Density and Component Sizing

QuoteFlow uses medium density by default. Report tables may use compact density.

| Element | Size |
|---|---:|
| Small control | 32px |
| Default control | 40px |
| Large control | 48px |
| Textarea minimum | 96px |
| Compact table row | 40px |
| Default table row | 48px |
| Application header | 64px |
| Expanded sidebar | 248px |
| Collapsed sidebar | 72px |
| Small icon | 16px |
| Default icon | 20px |
| Large icon | 24px |

Use 40px controls in quotation forms. Use compact 40px rows only when a table must display substantial operational data.

## 12. Borders and Radius

### 12.1 Border radius

| Token | Value |
|---|---:|
| `radius-none` | 0px |
| `radius-small` | 4px |
| `radius-medium` | 8px |
| `radius-large` | 12px |
| `radius-xlarge` | 16px |
| `radius-full` | 9999px |

Default application:

| Element | Radius |
|---|---:|
| Input and select | 8px |
| Button | 8px |
| Card | 12px |
| Modal and drawer | 12px |
| Badge and avatar | Full |
| Tooltip | 6–8px |

### 12.2 Borders

- Default surface: 1px `border-default`.
- Input: 1px `border-strong`.
- Divider: 1px `border-default`.
- Focus state: focus ring plus a visible focus border.
- Validation error: semantic danger border and supporting error text.

## 13. Elevation and Shadow

| Token | Value |
|---|---|
| `shadow-none` | `none` |
| `shadow-small` | `0 1px 2px rgba(15, 23, 42, 0.06)` |
| `shadow-medium` | `0 4px 12px rgba(15, 23, 42, 0.10)` |
| `shadow-overlay` | `0 16px 40px rgba(15, 23, 42, 0.18)` |

Usage:

- Standard cards: border only or `shadow-small`.
- Dropdowns and popovers: `shadow-medium`.
- Modals and drawers: `shadow-overlay`.
- Do not use strong shadows on every card.

Dark-mode shadows may use higher opacity, but surface separation should still rely primarily on background and border tokens.

## 14. Iconography

- Use one icon library throughout the application.
- Prefer outlined icons with consistent stroke width.
- Use 16px icons for dense controls, 20px by default, and 24px for prominent standalone actions.
- An icon must communicate an action, status, navigation destination, or recognizable object.
- Do not add decorative icons to headings, cards, or empty spaces merely for visual interest.
- Icon-only buttons require accessible labels and tooltips when their meaning is not universally clear.

## 15. Layout System

### 15.1 Application shell

- Persistent left sidebar on desktop.
- Top application header.
- Subtle page background with surface-based content regions.
- Primary page action appears consistently at the upper right of the content header.
- Breadcrumb appears only when it adds orientation beyond the sidebar and page title.

### 15.2 Grid

- Use a 12-column layout grid for complex forms and dashboards.
- Use full available width for operational tables.
- Use readable maximum widths for settings, detail, and simple forms.
- Avoid excessively narrow centered forms for quotation workflows.

### 15.3 Required page patterns

- Dashboard.
- Master-data list.
- Master-data create/edit form.
- Quotation list.
- Quotation create/edit form.
- Quotation detail.
- Return confirmation.
- Report and filter page.
- User and role management.
- Not found, access denied, and application error.

Each pattern must document structure, actions, responsive behavior, and loading, empty, error, and permission states.

### 15.4 Quotation form structure

Recommended section order:

1. Customer information.
2. Project or bundle.
3. Service type: pickup or delivery.
4. Rental items.
5. Rental schedule and quantities.
6. Pricing and discount.
7. Voucher.
8. Payment terms and method.
9. Additional terms or notes.
10. Quotation summary.
11. Primary and secondary actions.

Use clear section headings and progressive disclosure. Do not place the entire form inside one visually undifferentiated card, and do not create one card for every field.

## 16. Responsive Breakpoints

Initial breakpoint values follow the Tailwind defaults:

| Token | Value |
|---|---:|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

Required behaviors:

- Collapse the sidebar on smaller screens.
- Convert multi-column forms to one column when space is insufficient.
- Allow data tables to scroll horizontally rather than hiding required columns.
- Preserve primary actions and essential totals on small screens.
- Do not transform every table into cards automatically; define the behavior per use case.
- Modals may become full-screen dialogs on small screens when they contain forms.

## 17. Interaction States

Every interactive component must define applicable states:

- Default.
- Hover.
- Focus-visible.
- Pressed.
- Selected.
- Disabled.
- Read-only.
- Loading.
- Error.
- Success.

Focus-visible styling must remain visible in both themes and must not rely only on a subtle color change.

## 18. Motion

| Token | Duration |
|---|---:|
| `duration-fast` | 100ms |
| `duration-normal` | 200ms |
| `duration-slow` | 300ms |

Motion rules:

- Use motion to explain state changes, hierarchy, and entry or exit.
- Avoid decorative bouncing, floating, pulsing, and continuous animation.
- Respect `prefers-reduced-motion`.
- Dropdowns, tooltips, and small state changes use fast or normal duration.
- Modals and drawers may use normal or slow duration.

## 19. Z-Index

| Token | Value |
|---|---:|
| `z-base` | 0 |
| `z-sticky` | 20 |
| `z-dropdown` | 40 |
| `z-popover` | 50 |
| `z-drawer` | 60 |
| `z-modal` | 70 |
| `z-toast` | 80 |
| `z-tooltip` | 90 |

Do not introduce arbitrary z-index values in components.

## 20. Content and Data Formatting

### 20.1 Language and microcopy

- Use one language consistently within a workflow.
- Use sentence case.
- Use consistent action verbs, such as Create quotation, Save draft, Submit, Approve, Reject, Confirm return, and Cancel.
- Error messages must explain what happened and how the user can recover.
- Confirmation dialogs must name the affected record and the consequence.
- Avoid generic marketing copy in operational screens.

### 20.2 Data formatting

Define shared formatters for:

- Indonesian Rupiah.
- Quantities and units.
- Percentages.
- Dates and time.
- Rental duration.
- Customer and PIC names.
- Quotation and order identifiers.
- Missing display values.

A display placeholder such as an em dash (`—`) may represent an unavailable value in the UI. It must not mutate source data or create fabricated business data.

## 21. Accessibility Requirements

- Target WCAG 2.2 AA contrast.
- All form controls require programmatically associated labels.
- Errors must be connected to their controls and announced when appropriate.
- Keyboard navigation must support all interactive workflows.
- Visible focus indicators are mandatory.
- Do not use color as the only status indicator.
- Interactive targets should be at least 40px in the standard desktop interface where practical.
- Icon-only actions require accessible names.
- Tables require correct header relationships and meaningful captions or context.
- Support reduced motion.

## 22. Anti-AI-Slop Rules

The following are prohibited unless explicitly required by an approved design:

- Inventing new colors, spacing, shadows, radii, or typography values.
- Decorative gradients.
- Excessive cards or placing every section inside a card.
- Oversized headings and excessive empty space in operational pages.
- Decorative icons that have no functional meaning.
- Random hard-coded Tailwind values.
- Multiple competing accent colors.
- Glassmorphism, glow effects, and excessive blur.
- Marketing-style hero sections inside employee workflows.
- Unnecessary statistic cards.
- Repeating the same information in cards, charts, and tables without purpose.
- Creating a new component when an existing shared component satisfies the requirement.
- Introducing a visual pattern on only one page without documenting why.

Before creating or modifying UI:

1. Read this document.
2. Inspect the nearest existing page with the same purpose.
3. Inspect reusable components and layouts.
4. Use existing semantic tokens.
5. Check the relevant reference image when one exists.
6. Verify both light and dark themes.

If no existing pattern covers a requirement, document the missing pattern and propose the smallest reusable extension before introducing a new visual language.

## 23. Tailwind Integration Direction

The design system must be implemented using CSS custom properties exposed through Tailwind semantic utilities.

Preferred usage:

```tsx
<main className="bg-background-page text-text-primary">
  <button className="bg-action-primary text-text-inverse hover:bg-action-primary-hover">
    Create quotation
  </button>
</main>
```

Avoid raw palette usage in feature components:

```tsx
<button className="bg-blue-600 text-white hover:bg-blue-700">
  Create quotation
</button>
```

Implementation principles:

- Primitive palettes define available color scales.
- Semantic CSS variables define meaning for each theme.
- Tailwind utilities map to semantic variables.
- Components consume semantic utilities.
- Theme switching changes semantic variables, not component markup.
- Arbitrary values must not be used when an established token exists.

Actual Tailwind configuration will be created after these foundations are reviewed and approved.

## 24. Initial Component Scope

### Actions

- Button.
- Icon button.
- Link.
- Dropdown action.

### Forms

- Form field.
- Input.
- Textarea.
- Select.
- Autocomplete.
- Date picker.
- Checkbox.
- Radio.
- Switch.
- File upload.
- Currency input.
- Quantity input.
- Error and helper message.

### Data display

- Table.
- Status badge.
- Card.
- Description list.
- Tooltip.
- Avatar.
- Empty state.
- Skeleton.
- Price and total summary.

### Navigation

- Sidebar.
- Header.
- Breadcrumb.
- Tabs.
- Pagination.
- Stepper.

### Feedback

- Alert.
- Toast.
- Modal.
- Confirmation dialog.
- Loading indicator.
- Error state.

## 25. Governance

- Reuse a shared component before creating a new one.
- Add a token only when existing tokens cannot express a recurring design need.
- Do not add a token for a single isolated screen without review.
- Document component anatomy, variants, states, accessibility, and examples.
- Test components in light and dark themes.
- Deprecate old patterns explicitly rather than maintaining silent duplicates.
- Keep reference screenshots and implemented examples synchronized.
- Stable design decisions belong in this repository; design rationale and historical discussion may remain in Obsidian.

## 26. Foundation Summary

```yaml
direction: modern-enterprise
brand: sonicline
product: quoteflow
primary: sonicline-blue
accent: sonicline-orange
neutral: slate
themes:
  - light
  - dark
density: medium
spacing-base: 4px
font: Inter
default-control-height: 40px
default-radius: 8px
card-radius: 12px
surface-style: border-first
decoration: minimal
gradient: prohibited-unless-approved
accessibility-target: WCAG-2.2-AA
```

## 27. Foundation Review Checklist

- [ ] Brand blue and orange are approved.
- [ ] Light and dark semantic colors are visually tested.
- [ ] Text and interactive contrast meet WCAG 2.2 AA.
- [ ] Typography and Inter font usage are approved.
- [ ] Medium density is validated against quotation forms and report tables.
- [ ] Status names match the actual backend and business workflow.
- [ ] Quotation form section order matches the business process.
- [ ] Responsive priorities are confirmed.
- [ ] Icon library is selected.
- [ ] Tailwind version and theme implementation approach are confirmed.
- [ ] Initial shared component inventory is compared with the existing codebase.
- [ ] Reference pages are selected for dashboard, list, form, detail, return, and report patterns.
