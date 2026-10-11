# QuoteFlow UI Quality Checklist

Use this checklist before completing any UI task or approving a UI pull request. Mark items not applicable only when the reason is clear from the task.

## 1. Context and Scope

- [ ] The user goal and acceptance criteria are understood.
- [ ] The relevant design-system documents were read.
- [ ] The nearest comparable page or component was inspected.
- [ ] Existing global components, layouts, tokens, hooks, types, utilities, fixtures, and libraries were searched.
- [ ] The implementation stays within the requested scope.
- [ ] No unrelated redesign or refactor was introduced.

## 2. Design-System Compliance

- [ ] Semantic tokens are used instead of raw palette values.
- [ ] Spacing uses the approved scale.
- [ ] Typography uses approved roles, sizes, weights, and line heights.
- [ ] Border radius uses approved tokens.
- [ ] Shadows use approved elevation tokens.
- [ ] Control and table sizes follow the selected density.
- [ ] No arbitrary Tailwind values were introduced without a documented reason.
- [ ] Light and dark themes use the same component structure.

## 3. Reuse and Architecture

- [ ] Existing shared components are reused where appropriate.
- [ ] No duplicate component, helper, hook, type, constant, fixture, API client, or utility was created.
- [ ] Similar global code that was not reused has a documented incompatibility.
- [ ] Generic components contain no feature-specific business logic.
- [ ] Feature composition follows the repository convention.
- [ ] Public imports use established exports or aliases.

## 4. Visual Hierarchy

- [ ] The page title and primary goal are clear.
- [ ] There is normally one primary action per region.
- [ ] Primary, secondary, tertiary, and destructive actions are visually distinct.
- [ ] Related information is grouped logically.
- [ ] Cards represent meaningful units rather than decorating every section.
- [ ] Spacing communicates hierarchy consistently.
- [ ] Important totals, status, and next actions are easy to scan.
- [ ] The interface remains professional and operational, not marketing-oriented.

## 5. Color and Theme

- [ ] Sonicline blue is used for primary interaction.
- [ ] Sonicline orange is used only as a restricted accent.
- [ ] Semantic success, warning, danger, and information colors are used correctly.
- [ ] Status colors match the approved mapping.
- [ ] Status meaning does not rely on color alone.
- [ ] Text, borders, controls, charts, and focus states are readable in light mode.
- [ ] Text, borders, controls, charts, and focus states are readable in dark mode.
- [ ] No unapproved gradient, glow, or glass effect was added.

## 6. Forms

- [ ] Every editable control has a visible label.
- [ ] Placeholder text is not used as the only label.
- [ ] Required and optional states are clear.
- [ ] Related fields are grouped logically.
- [ ] Fields are not placed side by side merely to fill space.
- [ ] Helper text is concise and useful.
- [ ] Validation appears near the relevant control.
- [ ] Error messages explain how to correct the value.
- [ ] User input is preserved after recoverable errors.
- [ ] Disabled and read-only states are visually and behaviorally distinct.
- [ ] No missing value is replaced with fabricated fallback business data.
- [ ] Keyboard order follows the visual order.

## 7. Quotation Workflow

- [ ] Customer, project, service type, schedule, items, pricing, payment, terms, and summary follow the approved sequence.
- [ ] Rental items can be entered efficiently.
- [ ] Price, quantity, discount, and totals use consistent formatting.
- [ ] Calculations do not erase user input.
- [ ] Save draft and final submission are clearly distinct.
- [ ] Submission errors identify and navigate to affected sections.
- [ ] Meaningful unsaved work is protected from accidental loss.
- [ ] No customer, item, price, voucher, quantity, or payment data is invented.

## 8. Tables and Reports

- [ ] Column headers are clear and use sentence case.
- [ ] Primary identifiers are easy to scan.
- [ ] Numeric values align right and use tabular numbers.
- [ ] Status and action columns are positioned consistently.
- [ ] Sorting behavior is understandable.
- [ ] Active filters are visible and removable.
- [ ] Pagination preserves search, filter, and sorting state.
- [ ] Required columns are not hidden merely to avoid horizontal scrolling.
- [ ] Exported data uses the same filters as the visible report.
- [ ] Empty dataset and no-search-result states are different.

## 9. Application States

- [ ] Initial loading is handled.
- [ ] Localized loading does not unnecessarily block the page.
- [ ] Empty state is specific to its cause.
- [ ] No-result state explains the active search or filters.
- [ ] Recoverable errors provide a valid recovery action.
- [ ] Unrecoverable errors provide a safe next action.
- [ ] Permission-denied behavior is defined.
- [ ] Read-only behavior is defined.
- [ ] Success is shown only after server confirmation.
- [ ] No failure is hidden by a silent catch or placeholder result.

## 10. Interaction

- [ ] Default, hover, focus-visible, pressed, selected, disabled, read-only, loading, error, and success states are defined where applicable.
- [ ] Buttons use specific action labels.
- [ ] Destructive actions communicate consequence.
- [ ] Confirmations are reserved for meaningful or destructive actions.
- [ ] Icon-only actions have accessible names.
- [ ] Tooltips are not required to understand primary workflows.
- [ ] Motion communicates state and respects reduced-motion settings.
- [ ] No continuous decorative animation was introduced.

## 11. Responsive Layout

- [ ] The layout works at supported widths.
- [ ] Multi-column forms collapse logically.
- [ ] Primary actions remain discoverable.
- [ ] Important totals and status remain visible.
- [ ] Tables use an intentional small-screen strategy.
- [ ] Drawers and dialogs remain usable on small screens.
- [ ] Content does not overflow unexpectedly.
- [ ] Touch and pointer targets remain usable.

## 12. Accessibility

- [ ] Text and interactive contrast meet WCAG 2.2 AA.
- [ ] All functionality is keyboard accessible.
- [ ] Focus indicators are visible in both themes.
- [ ] Focus order is logical.
- [ ] Labels and descriptions are associated with controls.
- [ ] Validation messages are programmatically connected.
- [ ] Dialog focus is trapped and restored correctly.
- [ ] Status and errors are not communicated by color alone.
- [ ] Tables use correct header relationships.
- [ ] Icons and images have appropriate accessible names or are hidden when decorative.
- [ ] Reduced-motion preferences are respected.

## 13. Content and Formatting

- [ ] Language is consistent within the workflow.
- [ ] Labels, titles, actions, and headers use sentence case.
- [ ] Action terminology is consistent across pages.
- [ ] Error and confirmation messages are specific.
- [ ] Currency, quantity, percentage, date, and time use shared formatters.
- [ ] Missing display values do not mutate or fabricate source data.
- [ ] No generic marketing copy appears in operational screens.

## 14. Anti-AI-Slop Review

- [ ] No unnecessary metric cards were added.
- [ ] Not every section was placed inside a card.
- [ ] No oversized heading or excessive empty space was introduced.
- [ ] No decorative icon was added without meaning.
- [ ] No random accent color was introduced.
- [ ] No glassmorphism, glow, or excessive blur was introduced.
- [ ] No generic dashboard layout replaced a task-specific workflow.
- [ ] No one-off visual language was created for a single page.
- [ ] The result looks consistent with approved QuoteFlow references.

## 15. Testing and Verification

- [ ] The diff was reviewed for accidental scope expansion.
- [ ] Component unit tests focus on behavior owned by the component.
- [ ] Relevant interaction tests pass.
- [ ] Relevant snapshots are intentionally updated and reviewed.
- [ ] Lint passes.
- [ ] Type-check passes.
- [ ] Relevant unit tests pass.
- [ ] Required coverage is maintained.
- [ ] Build passes when applicable.
- [ ] Light mode was visually checked.
- [ ] Dark mode was visually checked.
- [ ] At least one narrow and one wide viewport were checked.
- [ ] Any check that could not run is reported with the reason and remaining risk.

## 16. Completion Gate

The UI task may be marked complete only when:

- [ ] Acceptance criteria are satisfied.
- [ ] The applicable sections above pass.
- [ ] No duplicate or fabricated fallback implementation was introduced.
- [ ] The implementation is consistent with QuoteFlow design direction.
- [ ] Remaining assumptions, risks, and known limitations are documented.
