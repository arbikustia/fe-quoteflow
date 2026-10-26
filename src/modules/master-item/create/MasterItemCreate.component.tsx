import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import { formatRupiahInput } from "./MasterItemCreate.helpers";
import type { ItemFormContentProps, MasterItemCreateFormState } from "./MasterItemCreate.type";

/**
 * Extract error message from field error.
 * @param {FieldError | undefined} error - Field error object
 * @returns {string | null} Error message or null
 */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/**
 * Render status switch field (edit mode only).
 * @param {MasterItemCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (props: MasterItemCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
      <div className="flex flex-col"><span className="text-sm font-semibold text-text-primary">Status</span><span className="text-xs text-text-secondary">Toggle active or inactive status</span></div>
      <SwitchComponent label="Item status" checked={props.isActive} onChange={props.handleStatusChange} />
    </div>
  );
};

/**
 * Render mobile top back bar.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Bar element
 */
const _renderMobileBack = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Item" : "New Item";

  return (
  <div className="sticky top-0 z-20 flex items-center gap-3 bg-background-surface px-0 lg:hidden">
    <button
      type="button"
      onClick={goBack}
      aria-label="Back"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <div className="min-w-0">
      <h2 className="truncate text-4xl font-semibold leading-tight text-text-primary">{title}</h2>
    </div>
  </div>
  );
};

/**
 * Render page header with breadcrumb.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Header element
 */
const _renderHeaderSection = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Item" : "New Item";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master Item</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 hidden pl-1 lg:block">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
          {isEditMode ? "Update the item details below." : "Fill in the item details below."}
        </p>
      </div>
    </>
  );
};

const FIELD_CLASS = "w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-xl font-normal text-text-primary shadow-xs outline-none transition-all placeholder:font-normal placeholder:text-text-tertiary/60 focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:text-[15px]";

/**
 * Render basic input fields for item.
 * @param {ItemFormContentProps} props - Field props
 * @returns {ReactElement} Inputs
 */
const _renderBasicInputs = (props: ItemFormContentProps): ReactElement => (
  <>
    <InputComponent id="item-name" type="text" label="Item Name" className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base" placeholder="e.g. Wireless Microphone" required value={props.name} errorMessage={_getFieldError(props.errors?.name)} onChange={props.handleNameChange} />
    <div>
      <Select
        id="item-category"
        label="Category"
        labelClassName="text-base"
        className="[&_.ant-select-selection-item]:text-xl [&_.ant-select-selection-placeholder]:text-xl"
        required
        value={props.categoryId}
        disabled={props.isCategoryLoading}
        placeholder={props.isCategoryLoading ? "Loading categories..." : "Select category"}
        options={props.categories.map((cat) => ({ value: cat.id, label: cat.category_name }))}
        onChange={props.handleCategoryChange}
        errorMessage={props.categoryError ?? _getFieldError(props.errors?.categoryId)}
      />
    </div>
  </>
);

/**
 * Render numerical fields for item.
 * @param {ItemFormContentProps} props - Field props
 * @returns {ReactElement} Numerical inputs
 */
const _renderNumericalInputs = (props: ItemFormContentProps): ReactElement => (
  <>
    <div className="grid gap-4 sm:grid-cols-2">
      <InputComponent id="item-price" type="text" label="Price" className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base" placeholder="Rp 0" required inputMode="numeric" value={formatRupiahInput(props.price)} errorMessage={_getFieldError(props.errors?.price)} onChange={props.handlePriceChange} />
      <InputComponent id="item-stock" type="text" label="Stock" className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base" placeholder="0" required inputMode="numeric" value={props.stock} errorMessage={_getFieldError(props.errors?.stock)} onChange={props.handleStockChange} />
    </div>
    <InputComponent id="item-duration" type="text" label="Duration (Days)" className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base" placeholder="1" required inputMode="numeric" value={props.duration} errorMessage={_getFieldError(props.errors?.duration)} onChange={props.handleDurationChange} />
  </>
);

/**
 * Render extra fields for item.
 * @param {ItemFormContentProps} props - Field props
 * @returns {ReactElement} Extra inputs
 */
const _renderExtraInputs = (props: ItemFormContentProps): ReactElement => (
  <>
    <div>
      <label htmlFor="item-image" className="mb-1.5 block text-base font-bold uppercase tracking-wider text-text-secondary lg:text-xs">Upload Image</label>
      <input id="item-image" type="file" accept="image/*" aria-label="Upload image" onChange={props.handleImageChange} disabled={props.isImageUploading} className={FIELD_CLASS} />
      {props.isImageUploading && <p className="mt-2 text-xs text-text-secondary">Uploading image…</p>}
      {props.imageUploadError !== null && <p role="alert" className="mt-2 text-xs text-red-700">{props.imageUploadError}</p>}
      {props.image && (
        <a
          href={props.image}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block truncate text-xs font-medium text-brand-blue underline hover:text-brand-blue/80"
        >
          Uploaded: {props.image.split("/").pop()}
        </a>
      )}
    </div>
    <div>
      <label className="mb-1.5 block text-base font-bold uppercase tracking-wider text-text-secondary lg:text-xs">Remarks</label>
      <input type="text" aria-label="Remarks" placeholder="Optional notes" value={props.remark} onChange={props.handleRemarkChange} className={FIELD_CLASS} />
    </div>
  </>
);

/**
 * Render form action footer.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {boolean} isSubmitting - Submitting state
 * @returns {ReactElement} Action element
 */
const _renderFormActions = (isEditMode: boolean, isSubmitting: boolean): ReactElement => {
  const buttonText = isEditMode ? "Update Item" : "Create Item";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto lg:text-sm"
      >
        {isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Render create item form.
 * @param {MasterItemCreateFormState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterItemCreateForm = (props: MasterItemCreateFormState): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {props.successMessage && <AlertComponent type="success" message={props.successMessage} toast closable />}
    {_renderMobileBack(props.isEditMode, props.goBack)}
    <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:px-0 lg:text-base">
      {_renderHeaderSection(props.isEditMode, props.goBack)}
      <form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
        <div className="space-y-4">
          {_renderBasicInputs(props)}
          {_renderNumericalInputs(props)}
          {_renderExtraInputs(props)}
          {_renderStatusField(props)}
        </div>
        {_renderFormActions(props.isEditMode, props.isSubmitting)}
      </form>
    </div>
  </div>
);
