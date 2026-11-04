import type { ReactElement } from "react";

import Modal from "@/components/Modal";
import { SearchFilter } from "@/components/SearchFilter";
import { Select } from "@/components/Select";
import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import type { ReturnCreateFormState, ReturnOrderItemRow } from "./ItemReturnCreate.type";

const _renderCaptureButton = (row: ReturnOrderItemRow, props: ReturnCreateFormState): ReactElement => {
  const displayUrl = props.stagedPhotoUrls.get(row.id) ?? (row.fileUrl || null);
  let label = "Take photo";
  if (displayUrl) label = "Retake photo";
  if (props.uploadingItemId === row.id) label = "Uploading…";

  return (
    <label className="relative inline-flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border border-border-default bg-background-surface px-5 py-2.5 text-lg font-medium text-text-primary hover:bg-background-subtle focus-within:ring-2 focus-within:ring-focus-ring">
      {label}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        aria-label={`Take photo for ${row.itemName}`}
        disabled={props.isSubmitting}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        onChange={(event): void => {
          const file = event.target.files?.[0];
          if (file) void props.onCaptureItem(row.id, file);
          event.target.value = "";
        }}
      />
    </label>
  );
};

const _renderViewPhotoButton = (row: ReturnOrderItemRow, props: ReturnCreateFormState): ReactElement | null => {
  const displayUrl = props.stagedPhotoUrls.get(row.id) ?? (row.fileUrl || null);
  if (!displayUrl) return null;

  return (
    <button
      type="button"
      onClick={(): void => props.openPhoto(row.id)}
      className="inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-2xl border border-action-primary/30 bg-action-primary-subtle px-4 py-2.5 text-lg font-semibold text-action-primary transition-colors hover:bg-action-primary hover:text-text-inverse focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      aria-label="View photo"
    >
      <img
        src={displayUrl}
        alt=""
        className="h-7 w-7 rounded-lg object-cover"
      />
      <span className="font-semibold tracking-wide">View photo</span>
    </button>
  );
};

const _renderCapture = (row: ReturnOrderItemRow, props: ReturnCreateFormState): ReactElement => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {_renderCaptureButton(row, props)}
    {_renderViewPhotoButton(row, props)}
  </div>
);

const _renderMobileItem = (row: ReturnOrderItemRow, props: ReturnCreateFormState): ReactElement => (
  <article key={row.id} className="min-w-0 rounded-3xl border border-border-default bg-background-surface p-5 sm:p-6 shadow-2xs">
    <div className="flex items-start justify-between gap-4">
      <h4 className="max-w-[68%] min-w-0 break-words text-xl font-bold text-text-primary">{row.itemName}</h4>
      <span className="shrink-0 text-right text-lg font-semibold text-text-secondary">{row.qty} {row.unit}</span>
    </div>
    <div className="mt-4">
      <label htmlFor={`return-remark-mobile-${row.id}`} className="block text-lg font-medium text-text-secondary">
        Remark
      </label>
      <textarea
        id={`return-remark-mobile-${row.id}`}
        value={row.notes}
        onChange={(event): void => props.onItemNotesChange(row.id, event.target.value)}
        disabled={props.isSubmitting}
        rows={3}
        placeholder="Optional item remark"
        className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-border-strong bg-background-surface px-4 py-3 text-lg text-text-primary placeholder:text-text-placeholder focus:border-action-primary focus:outline-none focus:ring-2 focus:ring-focus-ring disabled:opacity-50"
      />
    </div>
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-default pt-4">
      {_renderCaptureButton(row, props)}
      {_renderViewPhotoButton(row, props)}
    </div>
  </article>
);

const _getColumns = (props: ReturnCreateFormState): TableColumn<ReturnOrderItemRow>[] => [
  {
    key: "itemName",
    header: "Item Name",
    width: "28%",
    mobile: { primary: true },
    render: (row): ReactElement => <span className="text-lg font-semibold text-text-primary">{row.itemName}</span>,
  },
  {
    key: "category",
    header: "Category",
    width: "18%",
    render: (row): ReactElement => <span className="text-lg text-text-secondary">{row.category}</span>,
  },
  {
    key: "qty",
    header: "Qty",
    width: "12%",
    align: "center",
    render: (row): ReactElement => <span className="text-lg text-text-primary">{row.qty} {row.unit}</span>,
  },
  {
    key: "photo",
    header: "Return photo",
    align: "center",
    render: (row): ReactElement => _renderCapture(row, props),
  },
  {
    key: "notes",
    header: "Remark",
    render: (row): ReactElement => (
      <label className="block min-w-48 text-lg text-text-secondary">
        <span className="sr-only">Remark for {row.itemName}</span>
        <input
          type="text"
          value={row.notes}
          onChange={(event): void => props.onItemNotesChange(row.id, event.target.value)}
          disabled={props.isSubmitting}
          placeholder="Optional item remark"
          className="h-12 w-full rounded-2xl border border-border-strong bg-background-surface px-4 text-lg text-text-primary placeholder:text-text-placeholder focus:border-action-primary focus:outline-none focus:ring-2 focus:ring-focus-ring disabled:opacity-50"
        />
      </label>
    ),
  },
];

/**
 * Render return creation form with rental order selection and items table.
 * @param {ReturnCreateFormState} props - Return form state
 * @returns {ReactElement} Return creation content
 */
export const ItemReturnCreateForm = (props: ReturnCreateFormState): ReactElement => {
  const columns = _getColumns(props);
  const saveLabel = props.isEditMode ? "Update Return" : "Save Return";

  if (props.isLoadingInitialData) {
    return (
      <SkeletonComponent
        rows={5}
        columns={[
          { width: "30%" },
          { width: "20%" },
          { width: "10%" },
          { width: "15%" },
          { width: "15%" },
          { width: "10%" },
        ]}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="rounded-3xl border border-border-default bg-background-surface p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {props.isEditMode ? (
            <div>
              <p className="mb-1.5 text-lg font-medium text-text-secondary">Rental Order</p>
              <p className="flex h-14 items-center text-xl font-semibold text-text-primary">
                {props.orderOptions.find((option) => option.value === props.selectedOrderId)?.label ??
                  "Linked to this return"}
              </p>
            </div>
          ) : (
            <Select
              id="return-order"
              label="Rental Order"
              placeholder={props.isOrdersLoading ? "Loading rental orders..." : "Select customer and order number"}
              value={props.selectedOrderId}
              options={props.orderOptions}
              onChange={props.handleOrderChange}
              disabled={props.isOrdersLoading}
              required
              className="w-full"
              labelClassName="!text-lg font-medium"
              selectClassName="!h-14 [&_.ant-select-content]:!text-lg"
              popupClassName="text-lg"
            />
          )}

          <div>
            <label htmlFor="return-notes-mobile" className="mb-1.5 block text-lg font-medium text-text-secondary md:hidden">
              Return Remark
            </label>
            <label htmlFor="return-notes" className="mb-1.5 hidden text-lg font-medium text-text-secondary md:block">
              Return Remark
            </label>
            <textarea
              id="return-notes-mobile"
              rows={3}
              placeholder="Optional return remark"
              value={props.returnNotes}
              onChange={(event): void => props.handleNotesChange(event.target.value)}
              disabled={props.isSubmitting}
              className="min-h-24 w-full resize-y rounded-2xl border border-border-default bg-background-surface px-4 py-3 text-lg text-text-primary placeholder:text-text-placeholder focus:border-action-primary focus:outline-none focus:ring-1 focus:ring-action-primary md:hidden"
            />
            <input
              id="return-notes"
              type="text"
              placeholder="Optional return remark"
              value={props.returnNotes}
              onChange={(event): void => props.handleNotesChange(event.target.value)}
              disabled={props.isSubmitting}
              className="hidden h-14 w-full rounded-2xl border border-border-default bg-background-surface px-4 text-lg text-text-primary placeholder:text-text-placeholder focus:border-action-primary focus:outline-none focus:ring-1 focus:ring-action-primary md:block"
            />
          </div>
        </div>

        {props.errorMessage && (
          <p role="alert" className="mt-4 text-lg text-danger">
            {props.errorMessage}
          </p>
        )}
      </div>

      <Modal
        isOpen={Boolean(props.photoPreview)}
        onClose={props.closePhotoPreview}
        title={props.photoPreview ? `Preview: ${props.photoPreview.itemName}` : "Photo preview"}
        dialogClassName="h-auto max-h-[90vh]"
      >
        {props.photoPreview && (
          <div className="flex flex-col gap-4">
            <img src={props.photoPreview.url} alt={`Captured return for ${props.photoPreview.itemName}`} className="max-h-[60vh] w-full object-contain" />
            <p className="text-lg text-text-secondary">Check timestamp and location name. Photos upload when you save the return.</p>
            {props.errorMessage && <p role="alert" className="text-lg text-danger">{props.errorMessage}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={props.closePhotoPreview} disabled={props.isSubmitting} className="min-h-12 rounded-2xl border border-border-default px-6 text-lg font-medium text-text-primary hover:bg-background-subtle disabled:opacity-50">Discard</button>
              <button type="button" onClick={props.confirmPhoto} disabled={props.isSubmitting} className="min-h-12 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover disabled:opacity-50">Save photo for return</button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={Boolean(props.viewedPhoto)}
        onClose={props.closeViewedPhoto}
        title={props.viewedPhoto ? `Photo: ${props.viewedPhoto.itemName}` : "Return photo"}
        dialogClassName="h-auto max-h-[90vh]"
      >
        {props.viewedPhoto && (
          <img
            src={props.viewedPhoto.url}
            alt={`Return photo for ${props.viewedPhoto.itemName}`}
            className="max-h-[70vh] w-full object-contain"
          />
        )}
      </Modal>
      {Boolean(props.selectedOrderId) && (
        <div className="rounded-3xl border border-border-default bg-background-surface p-6 sm:p-8 shadow-xs">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-text-primary">Order Items</h3>
              <span className="text-lg font-medium text-text-secondary">
                {props.returnItemIds.length} items to return
              </span>
            </div>
            <div className="w-full sm:w-80">
              <SearchFilter
                placeholder="Search items..."
                value={props.searchTerm}
                onChange={(event): void => props.handleSearchChange(event.target.value)}
                className="w-full"
                inputClassName="text-lg placeholder:text-lg"
              />
            </div>
          </div>

          <div className="space-y-4 md:hidden">
            {props.filteredOrderItems.length > 0 ? (
              props.filteredOrderItems.map((row) => _renderMobileItem(row, props))
            ) : (
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

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border-default pt-6 sm:flex-row">
            <span className="hidden text-lg font-medium text-text-secondary sm:inline-block">
              Item photos and remarks are optional.
            </span>
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <button
                type="button"
                onClick={props.goBack}
                className="h-14 w-full cursor-pointer rounded-2xl border border-border-default bg-background-surface px-6 text-lg font-semibold text-text-primary hover:bg-background-subtle sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(): void => {
                  void props.handleSave();
                }}
                disabled={props.isSubmitting}
                className="h-14 w-full cursor-pointer rounded-2xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {props.isSubmitting ? "Saving…" : saveLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
