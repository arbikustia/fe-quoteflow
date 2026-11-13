import type { ChangeEvent, ReactElement } from "react";

import type { TableColumn } from "@/components/Table";

import {
  CANCEL_BUTTON_CLASS,
  CAPTURE_INPUT_CLASS,
  CAPTURE_LABEL_CLASS,
  REMARK_INPUT_CLASS,
  REMARK_TEXTAREA_CLASS,
  REMOVE_PHOTO_CLASS,
  SAVE_BUTTON_CLASS,
} from "./ItemReturnCreate.config";
import type { ReturnCaptureHandler, ReturnCreateFormState, ReturnNotesChangeHandler, ReturnOrderItemRow, ReturnPhotoRemoveHandler, ReturnRowHandler, ReturnTextHandler } from "./ItemReturnCreate.type";

/**
 * Pick the label of the photo capture button.
 * @param {boolean} hasPhoto - Whether the row already has photos
 * @param {boolean} isUploading - Whether the row is uploading
 * @returns {string} - Button label
 */
export const getCaptureLabel = (hasPhoto: boolean, isUploading: boolean): string => {
  if (isUploading) {
    return "Uploading…";
  }

  return hasPhoto ? "Add more photos" : "Add photos";
};

/**
 * Build the change handler of a row's file input.
 * @param {string} rowId - Item row id
 * @param {ReturnCaptureHandler} onCaptureItem - Capture callback
 * @returns {(event: ChangeEvent<HTMLInputElement>) => void} - Input change handler
 */
export const createCaptureChangeHandler = (rowId: string, onCaptureItem: ReturnCaptureHandler): ((event: ChangeEvent<HTMLInputElement>) => void) => (event: ChangeEvent<HTMLInputElement>): void => {
  const files = Array.from(event.target.files ?? []);

  if (files.length) {
    void onCaptureItem(rowId, files);
  }

  event.target.value = "";
};

/**
 * Bind a row id to a click handler.
 * @param {ReturnRowHandler} handler - Handler receiving the row id
 * @param {string} rowId - Item row id
 * @returns {() => void} - Click handler
 */
export const createRowClickHandler = (handler: ReturnRowHandler, rowId: string): (() => void) => (): void => {
  handler(rowId);
};

/**
 * Bind a row id and photo index to a click handler.
 * @param {ReturnPhotoRemoveHandler} handler - Handler receiving row id and photo index
 * @param {string} rowId - Item row id
 * @param {number} photoIndex - Photo index
 * @returns {() => void} - Click handler
 */
export const createPhotoRemoveHandler = (handler: ReturnPhotoRemoveHandler, rowId: string, photoIndex: number): (() => void) => (): void => {
  handler(rowId, photoIndex);
};

/**
 * Bind a row id to a remark change handler.
 * @param {ReturnNotesChangeHandler} handler - Handler receiving row id and remark
 * @param {string} rowId - Item row id
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} - Change handler
 */
export const createNotesChangeHandler = (handler: ReturnNotesChangeHandler, rowId: string): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
  handler(rowId, event.target.value);
};

/**
 * Bind a text handler to an input or textarea change event.
 * @param {ReturnTextHandler} handler - Handler receiving the new text
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} - Change handler
 */
export const createTextChangeHandler = (handler: ReturnTextHandler): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
  handler(event.target.value);
};

/**
 * Bind a save action to a click handler that ignores the returned promise.
 * @param {() => Promise<void>} save - Save action
 * @returns {() => void} - Click handler
 */
export const createSaveClickHandler = (save: () => Promise<void>): (() => void) => (): void => {
  void save();
};

/**
 * Render the photo capture button of a row.
 * @param {ReturnOrderItemRow} row - Item row
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Capture button
 */
export const renderCaptureButton = (row: ReturnOrderItemRow, props: ReturnCreateFormState): ReactElement => {
  const stagedUrls = props.stagedPhotoUrls.get(row.id) ?? [];
  const hasPhoto = stagedUrls.length > 0 || row.fileUrls.length > 0;
  const label = getCaptureLabel(hasPhoto, props.uploadingItemId === row.id);

  return (
    <label className={CAPTURE_LABEL_CLASS}>
      {label}
      <input
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        aria-label={`Add photos for ${row.itemName}`}
        disabled={props.isSubmitting}
        className={CAPTURE_INPUT_CLASS}
        onChange={createCaptureChangeHandler(row.id, props.onCaptureItem)}
      />
    </label>
  );
};

/**
 * Render the saved and staged photo thumbnails of a row.
 * @param {ReturnOrderItemRow} row - Item row
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement | null} - Thumbnails, or null without photos
 */
export const renderViewPhotoButton = (row: ReturnOrderItemRow, props: ReturnCreateFormState): ReactElement | null => {
  const stagedUrls = props.stagedPhotoUrls.get(row.id) ?? [];
  const photos = [...row.fileUrls, ...stagedUrls];

  if (!photos.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {photos.map((photo, index) => (
        <div key={photo} className="relative">
          <button type="button" onClick={createRowClickHandler(props.openPhoto, row.id)} aria-label={`View photo ${index + 1}`}>
            <img src={photo} alt="" className="h-12 w-12 rounded-lg object-cover" />
          </button>
          <button
            type="button"
            onClick={createPhotoRemoveHandler(props.onRemovePhoto, row.id, index)}
            disabled={props.isSubmitting}
            aria-label={`Remove photo ${index + 1}`}
            className={REMOVE_PHOTO_CLASS}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

/**
 * Render the capture cell of the desktop table.
 * @param {ReturnOrderItemRow} row - Item row
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Capture cell
 */
export const renderCapture = (row: ReturnOrderItemRow, props: ReturnCreateFormState): ReactElement => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {renderCaptureButton(row, props)}
    {renderViewPhotoButton(row, props)}
  </div>
);

/**
 * Render one item as a mobile card.
 * @param {ReturnOrderItemRow} row - Item row
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Mobile item card
 */
export const renderMobileItem = (row: ReturnOrderItemRow, props: ReturnCreateFormState): ReactElement => (
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
        onChange={createNotesChangeHandler(props.onItemNotesChange, row.id)}
        disabled={props.isSubmitting}
        rows={3}
        placeholder="Optional item remark"
        className={REMARK_TEXTAREA_CLASS}
      />
    </div>
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-default pt-4">
      {renderCaptureButton(row, props)}
      {renderViewPhotoButton(row, props)}
    </div>
  </article>
);

/**
 * Render the remark input cell of the desktop table.
 * @param {ReturnOrderItemRow} row - Item row
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Remark cell
 */
export const renderRemarkCell = (row: ReturnOrderItemRow, props: ReturnCreateFormState): ReactElement => (
  <label className="block min-w-48 text-lg text-text-secondary">
    <span className="sr-only">Remark for {row.itemName}</span>
    <input
      type="text"
      value={row.notes}
      onChange={createNotesChangeHandler(props.onItemNotesChange, row.id)}
      disabled={props.isSubmitting}
      placeholder="Optional item remark"
      className={REMARK_INPUT_CLASS}
    />
  </label>
);

/**
 * Build the desktop table columns.
 * @param {ReturnCreateFormState} props - Form state
 * @returns {TableColumn<ReturnOrderItemRow>[]} - Table columns
 */
export const getColumns = (props: ReturnCreateFormState): TableColumn<ReturnOrderItemRow>[] => [
  {
    key: "itemName",
    header: "Item Name",
    width: "28%",
    mobile: { primary: true },
    /**
     * Render the item name cell.
     * @param {ReturnOrderItemRow} row - Item row
     * @returns {ReactElement} - Cell content
     */
    render: (row): ReactElement => <span className="text-lg font-semibold text-text-primary">{row.itemName}</span>,
  },
  {
    key: "category",
    header: "Category",
    width: "18%",
    /**
     * Render the category cell.
     * @param {ReturnOrderItemRow} row - Item row
     * @returns {ReactElement} - Cell content
     */
    render: (row): ReactElement => <span className="text-lg text-text-secondary">{row.category}</span>,
  },
  {
    key: "qty",
    header: "Qty",
    width: "12%",
    align: "center",
    /**
     * Render the quantity cell.
     * @param {ReturnOrderItemRow} row - Item row
     * @returns {ReactElement} - Cell content
     */
    render: (row): ReactElement => <span className="text-lg text-text-primary">{row.qty} {row.unit}</span>,
  },
  {
    key: "photo",
    header: "Return photo",
    align: "center",
    /**
     * Render the capture cell.
     * @param {ReturnOrderItemRow} row - Item row
     * @returns {ReactElement} - Cell content
     */
    render: (row): ReactElement => renderCapture(row, props),
  },
  {
    key: "notes",
    header: "Remark",
    /**
     * Render the remark cell.
     * @param {ReturnOrderItemRow} row - Item row
     * @returns {ReactElement} - Cell content
     */
    render: (row): ReactElement => renderRemarkCell(row, props),
  },
];

/**
 * Render the cancel and save buttons.
 * @param {ReturnCreateFormState} props - Form state
 * @returns {ReactElement} - Action bar
 */
export const renderActions = (props: ReturnCreateFormState): ReactElement => {
  const saveLabel = props.isEditMode ? "Update Return" : "Save Return";

  return (
    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-default/60 pt-5">
      <button type="button" onClick={props.goBack} disabled={props.isSubmitting} className={CANCEL_BUTTON_CLASS}>
        Cancel
      </button>
      <button type="button" onClick={createSaveClickHandler(props.handleSave)} disabled={props.isSubmitting} className={SAVE_BUTTON_CLASS}>
        {props.isSubmitting ? "Saving…" : saveLabel}
      </button>
    </div>
  );
};
