# QuoteFlow Page Patterns

Status: Initial specification  
Dependencies: [`FOUNDATIONS.md`](./FOUNDATIONS.md), [`COMPONENTS.md`](./COMPONENTS.md)

## 1. Purpose

This document defines reusable page structures for QuoteFlow. Page patterns provide consistent hierarchy, action placement, responsive behavior, and application states without forcing every module to look identical.

## 2. Universal Page Anatomy

Use only the elements needed by the page:

1. Optional breadcrumb.
2. Page header.
3. Title and concise description.
4. Primary and secondary actions.
5. Optional tabs or status context.
6. Main content.
7. Loading, empty, error, and permission states.

Rules:

- The primary action is normally placed at the upper right of the page header.
- Keep the title concise and use sentence case.
- Do not add a subtitle when it merely repeats the title.
- Keep action placement consistent across modules.
- Avoid decorative hero sections.
- Avoid wrapping the whole page in one unnecessary card.

## 3. Application Shell

### Desktop

- Expanded sidebar: 248px.
- Collapsed sidebar: 72px.
- Header: 64px.
- Content padding: 24–32px.
- Main content uses the available width appropriate to the page type.

### Small screens

- Sidebar becomes an overlay or drawer.
- Content padding becomes 16px.
- Primary actions remain visible and usable.
- Multi-column forms collapse progressively.

## 4. Dashboard

### Purpose

Provide a concise operational overview of quotation activity and status.

### Recommended structure

1. Page title and date context.
2. Small set of decision-relevant metrics.
3. Quotation status visualization.
4. Trend or volume visualization when actionable.
5. Recent or attention-required quotations.

### Rules

- Every metric must support a decision or action.
- Limit the number of top-level metric cards.
- Do not display the same values repeatedly in cards, charts, and tables.
- Charts require legends, accessible labels, and non-color distinctions.
- Status colors must match badges used elsewhere.
- Provide a clear time range.
- Empty and partial-data states must remain useful.

## 5. Master-Data List

Applies to category, customer, item, payment method, payment type, PIC, project, role, service type, user, and voucher.

### Structure

1. Page header.
2. Create action when permitted.
3. Search and relevant filters.
4. Data table.
5. Pagination.

### Rules

- Reuse one master-data list pattern across modules.
- Show only useful columns.
- Place row actions consistently.
- Distinguish active, inactive, and unavailable records.
- No-result and no-data states require different messages.
- Preserve search, filters, sorting, and page state when navigating back.

## 6. Master-Data Create/Edit Form

### Structure

1. Breadcrumb or back navigation.
2. Page title indicating create or edit mode.
3. Form sections.
4. Sticky or consistently positioned actions when the form is long.

### Rules

- Use one column for simple forms.
- Use two columns only for logically related short fields.
- Do not place unrelated fields side by side merely to fill space.
- Preserve input after validation errors.
- Clearly distinguish Save, Save and add another, and Cancel when applicable.
- Warn before discarding meaningful unsaved changes.

## 7. Quotation List

### Structure

1. Page header and Create quotation action.
2. High-value filters: status, customer, project, service type, and date.
3. Search by quotation number or relevant identity.
4. Quotation table.
5. Pagination and total count.

### Suggested columns

- Quotation number.
- Customer.
- Project or bundle.
- Rental period.
- Total.
- Status.
- Updated time.
- Responsible PIC when relevant.
- Actions.

### Rules

- Quotation number is the primary scannable identifier.
- Status mapping is consistent with dashboard and detail pages.
- Numeric values align right.
- Filters can be cleared individually and together.
- Do not hide critical columns solely to avoid horizontal scrolling.

## 8. Quotation Create/Edit Form

### Recommended sequence

1. Customer information.
2. Project or bundle selection.
3. Service type: pickup or delivery.
4. Rental schedule.
5. Rental items.
6. Pricing and discount.
7. Voucher.
8. Payment method and terms.
9. Additional terms or notes.
10. Quotation summary.
11. Actions.

### Layout

- Use a 12-column grid.
- Main form may occupy 8 columns and summary 4 columns on large screens.
- Stack content on smaller screens.
- A summary may remain sticky only when it does not obscure form content.

### Rules

- Divide the form into meaningful sections.
- Do not create one card per field.
- Rental items should support efficient repeated entry.
- Display subtotal, discount, tax when applicable, and final total clearly.
- Recalculation must not erase user input.
- Do not invent customer, item, price, quantity, voucher, or payment data.
- Make Save draft and final submission distinct.
- Submission errors should take the user to the affected section.
- Protect against accidental loss of significant work.

## 9. Quotation Detail

### Structure

1. Quotation identity, customer, and status.
2. Contextual actions based on status and permission.
3. Summary information.
4. Item table.
5. Pricing summary.
6. Terms, notes, and payment information.
7. Activity or status history when available.

### Rules

- The current status and next valid action must be obvious.
- Do not show unavailable actions as if they are valid.
- Use description lists for label-value information.
- Match financial formatting used in the form and report.
- Preserve printable readability when printing is supported.

## 10. Return Confirmation

### Purpose

Confirm which rented items were returned and whether the rental can be completed.

### Structure

1. Order and customer summary.
2. Expected rental items.
3. Returned quantity and condition.
4. Missing, damaged, or exceptional item handling when supported.
5. Return notes.
6. Completion summary.
7. Confirm return action.

### Rules

- Show expected and returned quantities side by side.
- Do not default an item to returned unless that is an approved business rule.
- Confirming completion must clearly state its consequence.
- Exceptions require explicit handling.
- Preserve partially entered return data after recoverable errors.
- Completed records become read-only unless reopening is supported.

## 11. Report Page

### Structure

1. Page header.
2. Date range and report-specific filters.
3. Applied-filter summary.
4. Optional summary metrics.
5. Report table or visualization.
6. Export action.

### Rules

- Filters describe the exact dataset shown.
- Reports must include timezone and date context where relevant.
- Export uses the same filters as the visible report.
- Loading large reports should not freeze unrelated navigation.
- Empty results explain which filters produced no data.
- Charts supplement rather than replace required tabular data.
- Numeric formatting stays consistent with the rest of QuoteFlow.

## 12. User and Role Management

- Separate identity information from access configuration.
- Explain role changes and permission consequences.
- Avoid exposing permissions users cannot understand.
- Destructive or access-removing changes require clear confirmation.
- Do not imply that a permission change succeeded before the server confirms it.

## 13. Authentication and Access States

Required patterns:

- Sign in.
- Session expired.
- Access denied.
- Account inactive when applicable.
- Not found.
- Application error.

Error pages provide a safe next action without exposing sensitive implementation details.

## 14. Filters

- Place commonly used filters directly above the data.
- Move advanced filters to a popover or drawer only when necessary.
- Show active filters clearly.
- Provide Clear all when multiple filters can be active.
- Do not reset filters unexpectedly.
- Use the URL for shareable or restorable filter state when appropriate.

## 15. Responsive Behavior

- Preserve task priority, not desktop appearance.
- Stack form columns before reducing control usability.
- Keep important quotation totals and actions discoverable.
- Use horizontal table scrolling when essential columns cannot fit.
- Avoid hiding actions only on smaller screens.
- Test at content breakpoints, not only device presets.

## 16. Page-State Requirements

Every data-driven page defines:

- Initial loading.
- Background refresh when applicable.
- No data.
- No filter results.
- Partial data.
- Recoverable error.
- Unrecoverable error.
- Permission denied.
- Read-only state.

Do not replace missing data with fabricated fallback content.

## 17. Reference Requirements

Approved references should eventually exist for:

```text
references/dashboard/
references/list/
references/form/
references/detail/
references/return/
references/report/
```

Each reference must document:

- Intended page pattern.
- Elements that are mandatory.
- Elements that are optional.
- Behavior not visible in the screenshot.
- Light or dark theme.
- Approval status and date.

## 18. Page Acceptance Criteria

A page is complete only when:

- It follows an approved pattern.
- The main user goal is obvious.
- Primary and secondary actions are correctly prioritized.
- Relevant global components are reused.
- Loading, empty, error, permission, and responsive states are handled.
- Light and dark themes are verified.
- Keyboard navigation and focus order are usable.
- No unnecessary cards, gradients, decorative icons, or duplicate patterns were introduced.
- Relevant tests and the UI checklist pass.
