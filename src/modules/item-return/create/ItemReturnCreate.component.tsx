import type { ReactElement } from "react";

import Modal from "@/components/Modal";
import { SearchFilter } from "@/components/SearchFilter";
import { Select } from "@/components/Select";
import { SkeletonComponent } from "@/components/Skeleton";
import Table from "@/components/Table";

import {
  CONFIRM_BUTTON_CLASS,
  DISCARD_BUTTON_CLASS,
  EMPTY_ORDER_TEXT,
  EMPTY_SEARCH_TEXT,
  ITEMS_SKELETON_COLUMNS,
  ITEMS_SKELETON_ROWS,
  NOTES_INPUT_CLASS,
  NOTES_TEXTAREA_CLASS,
} from "./ItemReturnCreate.config";
import { createTextChangeHandler, getColumns, renderActions, renderMobileItem } from "./ItemReturnCreate.helper";
import type { ReturnCreateFormState, ReturnOrderItemRow } from "./ItemReturnCreate.type";

/**
 * Get the row key for the items table.
 * @param {ReturnOrderItemRow} row - Item row
 * @returns {string} - Row id
 */
const _getRowKey = (row: ReturnOrderItemRow): string => row.id;

/**
 * Render the rental order field: read-only in edit mode, a select otherwise.
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Order field
 */
export const _renderOrderField = (props: ReturnCreateFormState): ReactElement => {
  if (props.isEditMode) {
    const label = props.orderOptions.find((option) => option.value === props.selectedOrderId)?.label ?? "Linked to this return";

    return (
      <div>
        <p className="mb-1.5 text-lg font-medium text-text-secondary">Rental Order</p>
        <p className="flex h-14 items-center text-xl font-semibold text-text-primary">{label}</p>
      </div>
    );
  }

  return (
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
  );
};

/**
 * Render the return remark field (textarea on mobile, input on desktop).
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Remark field
 */
export const _renderNotesField = (props: ReturnCreateFormState): ReactElement => (
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
      onChange={createTextChangeHandler(props.handleNotesChange)}
      disabled={props.isSubmitting}
      className={NOTES_TEXTAREA_CLASS}
    />
    <input
      id="return-notes"
      type="text"
      placeholder="Optional return remark"
      value={props.returnNotes}
      onChange={createTextChangeHandler(props.handleNotesChange)}
      disabled={props.isSubmitting}
      className={NOTES_INPUT_CLASS}
    />
  </div>
);

/**
 * Render the header card with order, remark and error.
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Header card
 */
export const _renderHeaderCard = (props: ReturnCreateFormState): ReactElement => (
  <div className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {_renderOrderField(props)}
      {_renderNotesField(props)}
    </div>
    {props.errorMessage && (
      <p role="alert" className="mt-4 text-lg text-danger">
        {props.errorMessage}
      </p>
    )}
  </div>
);

/**
 * Render the modal that previews a captured photo before staging.
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Preview modal
 */
export const _renderPreviewModal = (props: ReturnCreateFormState): ReactElement => (
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
          <button type="button" onClick={props.closePhotoPreview} disabled={props.isSubmitting} className={DISCARD_BUTTON_CLASS}>Discard</button>
          <button type="button" onClick={props.confirmPhoto} disabled={props.isSubmitting} className={CONFIRM_BUTTON_CLASS}>Save photo for return</button>
        </div>
      </div>
    )}
  </Modal>
);

/**
 * Render the modal that shows a saved or staged photo.
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Viewer modal
 */
export const _renderViewerModal = (props: ReturnCreateFormState): ReactElement => (
  <Modal
    isOpen={Boolean(props.viewedPhoto)}
    onClose={props.closeViewedPhoto}
    title={props.viewedPhoto ? `Photo: ${props.viewedPhoto.itemName}` : "Return photo"}
    dialogClassName="h-auto max-h-[90vh]"
  >
    {props.viewedPhoto && (
      <img src={props.viewedPhoto.url} alt={`Return photo for ${props.viewedPhoto.itemName}`} className="max-h-[70vh] w-full object-contain" />
    )}
  </Modal>
);

/**
 * Render the order items card (search, mobile cards, desktop table).
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Items card
 */
export const _renderItemsCard = (props: ReturnCreateFormState): ReactElement => {
  const emptyText = props.searchTerm ? EMPTY_SEARCH_TEXT : EMPTY_ORDER_TEXT;

  return (
    <div className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-text-primary">Order Items</h3>
          <span className="text-lg font-medium text-text-secondary">{props.returnItemIds.length} items to return</span>
        </div>
        <div className="w-full sm:w-80">
          <SearchFilter
            placeholder="Search items..."
            value={props.searchTerm}
            onChange={createTextChangeHandler(props.handleSearchChange)}
            className="w-full"
            inputClassName="text-lg placeholder:text-lg"
          />
        </div>
      </div>
      <div className="space-y-4 md:hidden">
        {props.filteredOrderItems.length > 0
          ? props.filteredOrderItems.map((row) => renderMobileItem(row, props))
          : <p className="py-10 text-center text-lg text-text-secondary">{emptyText}</p>}
      </div>
      <div className="hidden md:block">
        <Table data={props.filteredOrderItems} columns={getColumns(props)} keyExtractor={_getRowKey} emptyText={emptyText} />
      </div>
      <p className="mt-8 border-t border-border-default pt-5 text-base text-text-secondary">Item photos and remarks are optional.</p>
    </div>
  );
};

/**
 * Render return creation form with rental order selection and items table.
 * @param {ReturnCreateFormState} props - Return form state
 * @returns {ReactElement} - Return creation content
 */
export const ItemReturnCreateForm = (props: ReturnCreateFormState): ReactElement => {
  if (props.isLoadingInitialData) {
    return <SkeletonComponent rows={ITEMS_SKELETON_ROWS} columns={ITEMS_SKELETON_COLUMNS} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 lg:-mt-4 lg:gap-8">
      {_renderHeaderCard(props)}
      {_renderPreviewModal(props)}
      {_renderViewerModal(props)}
      {Boolean(props.selectedOrderId) && _renderItemsCard(props)}
      {renderActions(props)}
    </div>
  );
};
