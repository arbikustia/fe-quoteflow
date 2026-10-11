# QuoteFlow Component Standards

Status: Initial specification  
Dependency: [`FOUNDATIONS.md`](./FOUNDATIONS.md)

## 1. Purpose

This document defines the behavior, variants, composition, states, and accessibility expectations for reusable QuoteFlow UI components.

It does not define raw colors, spacing, typography, or elevation. Those decisions belong in `FOUNDATIONS.md`.

## 2. Component Principles

- Prefer composition over large configurable components.
- Expose only variants supported by a real recurring use case.
- Use semantic tokens, never feature-specific raw colors.
- Support light and dark themes without changing component markup.
- Keep visual and interaction behavior consistent across modules.
- Keep business rules outside generic UI components.
- Do not silently substitute fallback business data.
- Define keyboard, focus, disabled, read-only, loading, empty, and error behavior where applicable.
- Reuse global components before creating module-local alternatives.

## 3. Required Component Documentation

Every shared component must document:

1. Purpose.
2. Anatomy.
3. Variants.
4. Sizes.
5. States.
6. Behavior.
7. Accessibility.
8. Content rules.
9. Usage examples.
10. Do and do not guidance.

## 4. Button

### Variants

| Variant | Usage |
|---|---|
| Primary | One main action in a region, such as Save or Create quotation |
| Secondary | Supporting action, such as Preview or Export |
| Tertiary | Low-emphasis action in dense interfaces |
| Danger | Destructive action requiring clear consequence |
| Ghost | Toolbar or compact surface action |
| Link | Navigation-like action inside text or data views |

### Sizes

- Small: 32px.
- Default: 40px.
- Large: 48px.

### Rules

- A page region should normally have one primary action.
- Button labels use a clear verb: Save draft, Create quotation, Confirm return.
- Avoid vague labels such as OK, Yes, Continue, or Submit when a precise action is available.
- Loading buttons preserve their width and communicate progress.
- Destructive actions must not use primary blue.
- Icon-only buttons require accessible names and, when unclear, tooltips.
- Do not use an icon when it repeats the label without adding recognition.

## 5. Form Field

Form Field is the standard wrapper for label, control, description, required indicator, and validation message.

### Anatomy

1. Label.
2. Optional required indicator.
3. Control.
4. Optional helper text.
5. Optional error message.

### Rules

- Every editable control requires a visible label.
- Placeholder text must not replace the label.
- Required state must be communicated consistently.
- Error messages explain how to correct the value.
- Error text must be associated programmatically with the control.
- Preserve entered values after validation errors.
- Read-only and disabled are distinct states.
- Use default values only when they represent an intentional product rule.

## 6. Text Input and Textarea

### Variants

- Default.
- With prefix or suffix.
- Search.
- Currency.
- Quantity.
- Read-only.

### Rules

- Default height is 40px.
- Textarea minimum height is 96px.
- Prefixes and suffixes must clarify units or format, not decorate the field.
- Numeric fields use appropriate alignment and tabular numbers.
- Format values without changing their underlying meaning.
- Do not clear invalid input before the user can correct it.

## 7. Select and Autocomplete

- Use Select for small, stable option sets.
- Use Autocomplete for searchable, long, or remote option sets.
- Show loading, empty, error, and no-result states explicitly.
- Preserve keyboard navigation.
- Display selected values using the same label used in the option list.
- Do not fabricate an option when data is unavailable.
- Provide a clear action only when clearing the selection is permitted.

## 8. Checkbox, Radio, and Switch

- Checkbox: independent selection or multiple choices.
- Radio: one choice from a visible set.
- Switch: immediate on/off setting.
- Do not use a switch for an action that still requires Save unless that behavior is explicitly communicated.
- Labels must be clickable.
- Selected state must remain recognizable without relying on color alone.

## 9. Date and Rental Period

- Use shared date formatting and timezone rules.
- Rental periods should make start date, end date, and calculated duration visible.
- Invalid date ranges require an actionable error.
- Do not silently replace missing dates with today.
- Define whether end dates are inclusive in product requirements.
- A date picker must remain keyboard accessible.

## 10. Currency and Quantity

- Store values as numeric data, not formatted strings.
- Display Indonesian Rupiah consistently.
- Use tabular numerals.
- Align numeric table columns to the right.
- Make the unit visible for quantities.
- Validation must distinguish empty, invalid, zero, and negative values.
- Do not infer a price, discount, tax, or quantity when the source value is missing.

## 11. Table

### Anatomy

1. Optional table title and description.
2. Toolbar and filters.
3. Column headers.
4. Rows.
5. Selection controls when needed.
6. Row actions.
7. Pagination.
8. Loading, empty, and error states.

### Rules

- Headers describe the data clearly and use sentence case.
- Numeric columns align right; textual columns align left.
- Dates, status, and action columns use predictable widths.
- The primary identifier should be easy to scan.
- Row actions use a consistent location.
- Sticky headers are allowed for long tables.
- Horizontal scrolling is preferable to hiding required columns.
- Do not turn every desktop table into cards.
- Skeleton rows must resemble the final column structure.
- Empty state must distinguish no records from no search results.
- Sorting, filtering, and pagination state should be reflected in the URL when useful.

## 12. Status Badge

- Use approved quotation and order status mappings from `FOUNDATIONS.md`.
- Include a text label.
- Use one status vocabulary across dashboard, list, detail, and report pages.
- Avoid custom colors for feature-specific statuses without design-system review.
- Badge size and typography remain consistent.
- Icons are optional and must add meaning.

## 13. Card

- Use Card to group information that forms a meaningful independent unit.
- Do not wrap every section in a card.
- Standard cards use a border and no shadow or a small shadow.
- Card padding is 20–24px.
- Nested cards are discouraged.
- Do not use clickable cards when a standard link or button is clearer.

## 14. Summary and Metric Card

- Use only for high-value metrics that support a decision.
- A metric includes label, value, context, and optional comparison.
- Avoid adding a card merely because data exists.
- Dashboard metrics must not repeat the same information without a clear analytical reason.
- Charts and colors must remain readable in both themes.

## 15. Modal and Confirmation Dialog

### Modal

- Use for focused tasks that do not require a full page.
- Do not place large or multi-section quotation forms inside a modal.
- Preserve user input when recoverable errors occur.
- Trap focus and return focus to the trigger on close.

### Confirmation dialog

- Name the affected record.
- State the consequence.
- Use a specific confirmation label.
- Destructive confirmation uses the danger variant.
- Do not request confirmation for easily reversible low-risk actions.

## 16. Drawer

- Use for supporting context, filters, or compact secondary workflows.
- Do not use a drawer as a substitute for a complex detail page.
- Drawer width follows defined sizing tokens.
- Mobile drawers may become full-screen.

## 17. Alert and Toast

### Alert

- Persistent and placed near the relevant content.
- Used for information, warning, error, and success that requires attention.

### Toast

- Temporary confirmation for completed actions.
- Must not contain critical information required to continue.
- Avoid stacking excessive toasts.
- Error toasts should direct users to the failing area when possible.

## 18. Empty, Loading, and Error States

### Empty

Distinguish:

- No data exists yet.
- No search or filter results.
- User lacks access.
- Data is unavailable.

### Loading

- Use skeletons for page structures and tables.
- Use spinners for localized actions.
- Avoid blocking the whole page for one localized request.

### Error

- Explain the failed action.
- Preserve recoverable input.
- Provide retry only when retry is valid.
- Never show fabricated fallback records.

## 19. Navigation Components

### Sidebar

- Groups destinations by workflow.
- Shows one clear active destination.
- Supports expanded and collapsed states.
- Icons remain consistent and functional.

### Breadcrumb

- Use when hierarchy is not already clear.
- Do not repeat the current page as a clickable item.

### Tabs

- Use for peer sections within one context.
- Do not use tabs for sequential steps.
- Tab state should be linkable when it represents meaningful navigation.

### Stepper

- Use for sequential multi-stage workflows.
- Show current, completed, and unavailable steps.
- Do not use a stepper when users can complete sections in any order.

## 20. Pagination

- Preserve filters and sorting when changing pages.
- Display total records when available.
- Page-size options must reflect real operational needs.
- Disable unavailable actions instead of allowing invalid navigation.

## 21. Component Acceptance Criteria

A shared component is complete only when:

- Its purpose and API are clear.
- All required states are implemented.
- Light and dark themes are verified.
- Keyboard behavior is verified.
- Accessible names and relationships are correct.
- It uses semantic tokens.
- It has focused unit tests.
- Visual states are represented in Storybook or the design-system showcase.
- It does not duplicate an existing shared component.
- Documentation includes at least one correct usage example.
