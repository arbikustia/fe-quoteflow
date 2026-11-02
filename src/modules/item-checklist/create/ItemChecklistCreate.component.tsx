import type { ReactElement } from "react";

import { CheckboxComponent } from "@/components/Checkbox";
import { SearchFilter } from "@/components/SearchFilter";
import { Select } from "@/components/Select";
import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import type { ChecklistCreateFormState, ChecklistOrderItemRow } from "./ItemChecklistCreate.type";

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
    />
  </div>
);

const _renderMobileItem = (row: ChecklistOrderItemRow, props: ChecklistCreateFormState): ReactElement => (
  <article key={row.id} className="min-w-0 rounded-2xl border border-border-default bg-background-surface p-4">
    <h4 className="break-words text-lg font-semibold text-text-primary">{row.itemName}</h4>
    <p className="mt-1 break-words text-sm text-text-secondary">{row.category} · {row.qty} {row.unit}</p>
    <p className="mt-1 break-words text-sm text-text-secondary">Sign: {row.sign}</p>
    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-t border-border-default pt-4">
      <CheckboxComponent
        label="Move Out"
        ariaLabel={`Move out ${row.itemName}`}
        checked={props.moveOutItemIds.includes(row.id)}
        onChange={(): void => props.onToggleMoveOut(row.id)}
      />
      <CheckboxComponent
        label="Move In"
        ariaLabel={`Move in ${row.itemName}`}
        checked={props.moveInItemIds.includes(row.id)}
        onChange={(): void => props.onToggleMoveIn(row.id)}
      />
    </div>
  </article>
);

const _getColumns = (props: ChecklistCreateFormState): TableColumn<ChecklistOrderItemRow>[] => [
  { key: "itemName", header: "Item Name", mobile: { primary: true } },
  { key: "category", header: "Category" },
  { key: "qty", header: "Qty", align: "center" },
  { key: "unit", header: "Unit", align: "center" },
  {
    key: "moveOut",
    header: "Move Out",
    align: "center",
    render: (row): ReactElement =>
      _renderMoveCheckbox(row, props.moveOutItemIds, props.onToggleMoveOut, "Move out"),
  },
  {
    key: "moveIn",
    header: "Move In",
    align: "center",
    render: (row): ReactElement =>
      _renderMoveCheckbox(row, props.moveInItemIds, props.onToggleMoveIn, "Move in"),
  },
  { key: "sign", header: "Sign", align: "center" },
];

/**
 * Render checklist creation form with rental order selection and items table.
 * @param {ChecklistCreateFormState} props - Checklist form state
 * @returns {ReactElement} Checklist creation content
 */
export const ItemChecklistCreateForm = (props: ChecklistCreateFormState): ReactElement => {
  const columns = _getColumns(props);
  const saveLabel = props.isEditMode ? "Update Checklist" : "Save Checklist";

  if (props.isLoadingInitialData) {
    return <SkeletonComponent rows={5} columns={[{ width: "30%" }, { width: "20%" }, { width: "10%" }, { width: "10%" }, { width: "15%" }, { width: "15%" }]} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-4xl border border-border-default bg-background-surface p-6 shadow-xs">
        {props.isEditMode ? (
          <div className="max-w-xl">
            <p className="text-sm font-medium text-text-secondary">Rental Order</p>
            <p className="mt-2 text-text-primary">{props.orderOptions.find((option) => option.value === props.selectedOrderId)?.label ?? "Linked to this checklist"}</p>
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
            className="max-w-xl"
          />
        )}
        {props.errorMessage && <p role="alert" className="mt-3 text-sm text-danger">{props.errorMessage}</p>}
      </div>

      {Boolean(props.selectedOrderId) && (
        <div className="rounded-4xl border border-border-default bg-background-surface p-6 shadow-xs">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-text-primary">Order Items</h3>
              <span className="text-sm font-medium text-text-secondary">
                {props.moveOutItemIds.length} move out · {props.moveInItemIds.length} move in
              </span>
            </div>
            <div className="w-full sm:w-72">
              <SearchFilter
                placeholder="Search items..."
                value={props.searchTerm}
                onChange={(event): void => props.handleSearchChange(event.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-3 md:hidden">
            {props.filteredOrderItems.length > 0 ? props.filteredOrderItems.map((row) => _renderMobileItem(row, props)) : (
              <p className="py-10 text-center text-sm text-text-secondary">
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
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border-default pt-5 sm:flex-row">
            <span className="text-sm font-medium text-text-secondary">
              Select Move Out and Move In independently for each item.
            </span>
            <button
              type="button"
              onClick={(): void => {
                void props.handleSave();
              }}
              disabled={props.isSubmitting}
              className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto lg:text-sm"
            >
              {props.isSubmitting ? "Saving…" : saveLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
