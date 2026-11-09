import type { ReactElement } from "react";

import { CheckboxComponent } from "@/components/Checkbox";
import { SearchFilter } from "@/components/SearchFilter";
import { Select } from "@/components/Select";
import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import type { ChecklistCreateFormState, ChecklistOrderItemRow } from "./ItemChecklistCreate.type";

const MOVE_CHECKBOX_CLASS = "text-lg [&_.ant-checkbox]:h-7! [&_.ant-checkbox]:w-7! [&_.ant-checkbox]:rounded-lg! [&_.ant-checkbox]:border-2! [&_.ant-checkbox]:border-text-primary! [&_.ant-checkbox::after]:h-3.5! [&_.ant-checkbox::after]:w-2! [&_.ant-checkbox::after]:border-2! [&_.ant-checkbox::after]:border-t-0! [&_.ant-checkbox::after]:border-l-0!";
const FOCUS_AT_OPTIONS = [
  { value: "moveOut", label: "Move Out" },
  { value: "moveIn", label: "Move In" },
];

/**
 * Renders the move checkbox for an item.
 * @param {ChecklistOrderItemRow} row - Item row data
 * @param {string[]} checkedItemIds - Array of checked item IDs
 * @param {(id: string) => void} onToggle - Toggle handler
 * @param {string} label - Checkbox label
 * @returns {ReactElement} - Move checkbox component
 */
const _renderMoveCheckbox = (
  row: ChecklistOrderItemRow,
  checkedItemIds: string[],
  onToggle: (id: string) => void,
  label: string,
): ReactElement => (
  <div
    className="flex items-center justify-center"
    onClick={(event): void => event.stopPropagation()}
  >
    <CheckboxComponent
      ariaLabel={`${label} ${row.itemName}`}
      checked={checkedItemIds.includes(row.id)}
      onChange={(): void => onToggle(row.id)}
      className={MOVE_CHECKBOX_CLASS}
    />
  </div>
);

/**
 * Renders the mobile item card.
 * @param {ChecklistOrderItemRow} row - Item row data
 * @param {ChecklistCreateFormState} props - Form state props
 * @returns {ReactElement} - Mobile item card component
 */
const _renderMobileItem = (row: ChecklistOrderItemRow, props: ChecklistCreateFormState): ReactElement => (
  <article key={row.id} className="min-w-0 rounded-3xl border border-border-default bg-background-surface p-5 shadow-small sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <h4 className="max-w-[68%] min-w-0 break-words text-xl font-semibold text-text-primary">{row.itemName}</h4>
      <span className="shrink-0 text-right text-lg font-semibold text-text-secondary">{row.qty} {row.unit}</span>
    </div>
    <p className="mt-2 break-words text-lg text-text-secondary">{row.category}</p>
    <p className="mt-1 break-words text-lg text-text-secondary">Sign: {row.sign}</p>
    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-t border-border-default pt-4">
      <CheckboxComponent
        label="Move Out"
        className={MOVE_CHECKBOX_CLASS}
        ariaLabel={`Move out ${row.itemName}`}
        checked={props.moveOutItemIds.includes(row.id)}
        onChange={(): void => props.onToggleMoveOut(row.id)}
      />
      <CheckboxComponent
        label="Move In"
        className={MOVE_CHECKBOX_CLASS}
        ariaLabel={`Move in ${row.itemName}`}
        checked={props.moveInItemIds.includes(row.id)}
        onChange={(): void => props.onToggleMoveIn(row.id)}
      />
    </div>
  </article>
);

/**
 * Renders form actions.
 * @param {ChecklistCreateFormState} props - Form state props
 * @returns {ReactElement} - Form actions
 */
const _renderActions = (props: ChecklistCreateFormState): ReactElement => {
  const saveLabel = props.isEditMode ? "Update Checklist" : "Save Checklist";

  return (
    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-default/60 pt-5">
      <button
        type="button"
        onClick={props.goBack}
        disabled={props.isSubmitting}
        className="h-14 cursor-pointer rounded-xl border border-border-default bg-background-surface px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={(): void => { void props.handleSave(); }}
        disabled={props.isSubmitting}
        className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {props.isSubmitting ? "Saving…" : saveLabel}
      </button>
    </div>
  );
};

/**
 * Gets table columns.
 * @param {ChecklistCreateFormState} props - Form state props
 * @returns {TableColumn<ChecklistOrderItemRow>[]} - Table columns
 */
const _getColumns = (props: ChecklistCreateFormState): TableColumn<ChecklistOrderItemRow>[] => [
  { key: "itemName", header: "Item Name", mobile: { primary: true } },
  { key: "category", header: "Category" },
  { key: "qty", header: "Qty", align: "center" },
  { key: "unit", header: "Unit", align: "center" },
  {
    key: "moveOut",
    header: "Move Out",
    align: "center",
    /**
     * Renders move out checkbox.
     * @param {ChecklistOrderItemRow} row - Item row data
     * @returns {ReactElement} - Move out checkbox
     */
    render: (row): ReactElement =>
      _renderMoveCheckbox(row, props.moveOutItemIds, props.onToggleMoveOut, "Move out"),
  },
  {
    key: "moveIn",
    header: "Move In",
    align: "center",
    /**
     * Renders move in checkbox.
     * @param {ChecklistOrderItemRow} row - Item row data
     * @returns {ReactElement} - Move in checkbox
     */
    render: (row): ReactElement =>
      _renderMoveCheckbox(row, props.moveInItemIds, props.onToggleMoveIn, "Move in"),
  },
  { key: "sign", header: "Sign", align: "center" },
];

/**
 * Renders order selection controls.
 * @param {ChecklistCreateFormState} props - Form state props
 * @returns {ReactElement} - Order selection controls
 */
const _renderOrderSelection = (props: ChecklistCreateFormState): ReactElement => (
  <div className="grid gap-4 md:grid-cols-2">
    {props.isEditMode ? (
      <div>
        <p className="text-lg font-medium text-text-secondary">Rental Order</p>
        <p className="mt-2 text-xl font-semibold text-text-primary">{props.orderOptions.find((option) => option.value === props.selectedOrderId)?.label ?? "Linked to this checklist"}</p>
      </div>
    ) : (
      <Select
        id="checklist-order"
        label="Rental Order"
        placeholder={props.isOrdersLoading ? "Loading rental orders..." : "Select customer and order number"}
        value={props.selectedOrderId}
        options={props.orderOptions}
        onChange={props.handleOrderChange}
        disabled={props.isOrdersLoading}
        required
        labelClassName="!text-lg font-normal text-text-primary"
        selectClassName="h-14 !text-lg !border-2 !border-border-strong"
        popupClassName="text-lg"
      />
    )}
    <Select
      id="checklist-focus-at"
      label="Focus At"
      placeholder="Select checklist focus"
      value={props.focusAt}
      options={FOCUS_AT_OPTIONS}
      onChange={props.handleFocusAtChange}
      labelClassName="!text-lg font-normal text-text-primary"
      selectClassName="h-14 !text-lg !border-2 !border-border-strong"
      popupClassName="text-lg"
    />
  </div>
);

/**
 * Renders the items table section.
 * @param {ChecklistCreateFormState} props - Form state props
 * @param {TableColumn<ChecklistOrderItemRow>[]} columns - Table columns
 * @returns {ReactElement} - Items section
 */
const _renderItemsTable = (props: ChecklistCreateFormState, columns: TableColumn<ChecklistOrderItemRow>[]): ReactElement => (
  <>
    <div className="space-y-4 md:hidden">
      {props.filteredOrderItems.length > 0 ? props.filteredOrderItems.map((row) => _renderMobileItem(row, props)) : (
        <p className="py-10 text-center text-lg text-text-secondary">
          {props.searchTerm ? "No items matching search." : "No items found for this order."}
        </p>
      )}
    </div>
    <div className="hidden md:block">
      <Table
        data={props.filteredOrderItems}
        columns={columns}
        keyExtractor={(row): string => row.id}
        emptyText={props.searchTerm ? "No items matching search." : "No items found for this order."}
      />
    </div>
  </>
);

/**
 * Renders the items table section.
 * @param {ChecklistCreateFormState} props - Form state props
 * @param {TableColumn<ChecklistOrderItemRow>[]} columns - Table columns
 * @returns {ReactElement} - Items section
 */
const _renderItemsSection = (props: ChecklistCreateFormState, columns: TableColumn<ChecklistOrderItemRow>[]): ReactElement => (
  <div className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-semibold text-text-primary">Order Items</h3>
        <p className="text-lg text-text-secondary">
          {props.moveOutItemIds.length} move out · {props.moveInItemIds.length} move in
        </p>
      </div>
      <div className="w-full sm:w-80">
        <SearchFilter
          placeholder="Search items..."
          value={props.searchTerm}
          onChange={(event): void => props.handleSearchChange(event.target.value)}
          className="w-full"
          inputClassName="h-14 !text-lg placeholder:!text-lg border-2 border-border-strong"
        />
      </div>
    </div>
    {_renderItemsTable(props, columns)}
    <p className="mt-8 border-t border-border-default pt-5 text-base text-text-secondary">
      Select Move Out and Move In independently for each item.
    </p>
  </div>
);

/**
 * Renders checklist creation form.
 * @param {ChecklistCreateFormState} props - Checklist form state
 * @returns {ReactElement} - Checklist creation form
 */
export const ItemChecklistCreateForm = (props: ChecklistCreateFormState): ReactElement => {
  const columns = _getColumns(props);

  if (props.isLoadingInitialData) {
    return <SkeletonComponent rows={5} columns={[{ width: "30%" }, { width: "20%" }, { width: "10%" }, { width: "10%" }, { width: "15%" }, { width: "15%" }]} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 lg:-mt-4 lg:gap-8">
      <div className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10">
        {_renderOrderSelection(props)}
        {props.errorMessage && <p role="alert" className="mt-3 text-lg text-danger">{props.errorMessage}</p>}
      </div>

      {Boolean(props.selectedOrderId) && _renderItemsSection(props, columns)}
      {_renderActions(props)}
    </div>
  );
};
