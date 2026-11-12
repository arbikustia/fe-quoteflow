import type { ChangeEvent, ReactElement } from "react";

import { CheckboxComponent } from "@/components/Checkbox";
import { SearchFilter } from "@/components/SearchFilter";
import { Select } from "@/components/Select";
import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import { FOCUS_AT_OPTIONS, MOVE_CHECKBOX_CLASS, SCAN_HIGHLIGHT_CLASS } from "./ItemChecklistCreate.config";
import { renderMoveCheckbox } from "./ItemChecklistCreate.helper";
import type { ChecklistCreateFormState, ChecklistOrderItemRow } from "./ItemChecklistCreate.type";
import { getOrderItemRowKey, getOrderItemsEmptyText, ignoreManualChange } from "./ItemChecklistCreate.util";

/**
 * Renders the mobile item card.
 * @param {ChecklistOrderItemRow} row - Item row data
 * @param {ChecklistCreateFormState} props - Form state props
 * @returns {ReactElement} - Mobile item card component
 */
const _renderMobileItem = (row: ChecklistOrderItemRow, props: ChecklistCreateFormState): ReactElement => (
  <article key={row.id} className={`min-w-0 rounded-3xl border border-border-default bg-background-surface p-5 shadow-small sm:p-6 ${row.id === props.highlightedRowId ? SCAN_HIGHLIGHT_CLASS : ""}`}>
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
        onChange={ignoreManualChange}
        disabled
      />
      <CheckboxComponent
        label="Move In"
        className={MOVE_CHECKBOX_CLASS}
        ariaLabel={`Move in ${row.itemName}`}
        checked={props.moveInItemIds.includes(row.id)}
        onChange={ignoreManualChange}
        disabled
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

  /**
   * Save the checklist.
   * @returns {void} No return value
   */
  const handleSaveClick = (): void => { void props.handleSave(); };

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
        onClick={handleSaveClick}
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
const _getColumns = (props: ChecklistCreateFormState): TableColumn<ChecklistOrderItemRow>[] => {
  /**
   * Renders move out checkbox.
   * @param {ChecklistOrderItemRow} row - Item row data
   * @returns {ReactElement} - Move out checkbox
   */
  const renderMoveOut = (row: ChecklistOrderItemRow): ReactElement => renderMoveCheckbox({ row, checkedItemIds: props.moveOutItemIds, label: "Move out" });

  /**
   * Renders move in checkbox.
   * @param {ChecklistOrderItemRow} row - Item row data
   * @returns {ReactElement} - Move in checkbox
   */
  const renderMoveIn = (row: ChecklistOrderItemRow): ReactElement => renderMoveCheckbox({ row, checkedItemIds: props.moveInItemIds, label: "Move in" });

  return [
    { key: "itemName", header: "Item Name", mobile: { primary: true } },
    { key: "category", header: "Category" },
    { key: "qty", header: "Qty", align: "center" },
    { key: "unit", header: "Unit", align: "center" },
    { key: "moveOut", header: "Move Out", align: "center", render: renderMoveOut },
    { key: "moveIn", header: "Move In", align: "center", render: renderMoveIn },
    { key: "sign", header: "Sign", align: "center" },
  ];
};

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
const _renderItemsTable = (props: ChecklistCreateFormState, columns: TableColumn<ChecklistOrderItemRow>[]): ReactElement => {
  /**
   * Get the highlight class of a scanned row.
   * @param {ChecklistOrderItemRow} row - Item row data
   * @returns {string} Row class name
   */
  const getRowClassName = (row: ChecklistOrderItemRow): string => (row.id === props.highlightedRowId ? SCAN_HIGHLIGHT_CLASS : "");
  const emptyText = getOrderItemsEmptyText(props.searchTerm);

  return (
  <>
    <div className="space-y-4 md:hidden">
      {props.filteredOrderItems.length > 0 ? props.filteredOrderItems.map((row) => _renderMobileItem(row, props)) : (
        <p className="py-10 text-center text-lg text-text-secondary">{emptyText}</p>
      )}
    </div>
    <div className="hidden md:block">
      <Table
        data={props.filteredOrderItems}
        columns={columns}
        keyExtractor={getOrderItemRowKey}
        rowClassName={getRowClassName}
        emptyText={emptyText}
      />
    </div>
  </>
  );
};

/**
 * Renders the items table section.
 * @param {ChecklistCreateFormState} props - Form state props
 * @param {TableColumn<ChecklistOrderItemRow>[]} columns - Table columns
 * @returns {ReactElement} - Items section
 */
const _renderItemsSection = (props: ChecklistCreateFormState, columns: TableColumn<ChecklistOrderItemRow>[]): ReactElement => {
  /**
   * Update the search term.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => props.handleSearchChange(event.target.value);

  return (
  <div className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-semibold text-text-primary">Order Items</h3>
        <p className="text-lg text-text-secondary">
          {props.moveOutItemIds.length} move out · {props.moveInItemIds.length} move in
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        {props.notFoundItemCode ? (
          <span role="alert" className="inline-flex items-center rounded-full border border-current bg-danger-subtle px-4 py-2 text-base font-semibold text-danger-strong">
            Item "{props.notFoundItemCode}" not found
          </span>
        ) : undefined}
        <div className="w-full sm:w-80">
          <SearchFilter
          placeholder="Search items..."
          value={props.searchTerm}
          onChange={handleSearch}
          className="w-full"
          inputClassName="h-14 !text-lg placeholder:!text-lg border-2 border-border-strong"
          />
        </div>
      </div>
    </div>
    {_renderItemsTable(props, columns)}
    <p className="mt-8 border-t border-border-default pt-5 text-base text-text-secondary">
      Select Move Out and Move In independently for each item.
    </p>
  </div>
  );
};

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
