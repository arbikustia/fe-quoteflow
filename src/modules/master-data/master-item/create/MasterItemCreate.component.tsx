import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import { formatRupiahInput } from "./MasterItemCreate.helpers";
import type {
  ItemFormContentProps,
  MasterItemCreateFormState,
} from "./MasterItemCreate.type";

/**
 * Extract error message from field error.
 * @param {FieldError | undefined} error - Field error object
 * @returns {string | null} Error message or null
 */
const _getFieldError = (error: FieldError | undefined): string | null =>
  error?.message?.toString() ?? null;

/**
 * Render back icon SVG.
 * @returns {ReactElement} Back icon
 */
const _renderBackIcon = (): ReactElement => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

/**
 * Render status switch field (edit mode only).
 * @param {MasterItemCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (
  props: MasterItemCreateFormState,
): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-normal text-text-primary">Status</span>
          <span className={`inline-flex rounded-full px-3 py-0.5 text-base font-semibold uppercase ${props.isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
            {props.isActive ? "active" : "inactive"}
          </span>
        </div>
        <span className="text-base text-text-secondary">
          Toggle active or inactive status
        </span>
      </div>
      <SwitchComponent
        label="Item status"
        checked={props.isActive}
        onChange={props.handleStatusChange}
      />
    </div>
  );
};

/**
 * Render mobile top back bar.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Bar element
 */
const _renderMobileBack = (
  isEditMode: boolean,
  goBack: () => void,
): ReactElement => {
  const title = isEditMode ? "Edit Item" : "New Item";
  const subtitle = isEditMode
    ? "Update the item details below."
    : "Fill in the item details below.";

  return (
    <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
      <BackButton onClick={goBack} />
      <div className="min-w-0">
        <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-1 truncate text-sm text-text-secondary">{subtitle}</p>
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
// eslint-disable-next-line max-lines-per-function
const _renderHeaderSection = (
  isEditMode: boolean,
  goBack: () => void,
): ReactElement => {
  const title = isEditMode ? "Edit Item" : "New Item";
  const subtitle = isEditMode
    ? "Update the item details below."
    : "Fill in the item details below.";

  return (
    <div className="hidden lg:block">
      <nav
        aria-label="Breadcrumb"
        className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary"
      >
        <button
          type="button"
          onClick={goBack}
          className="cursor-pointer hover:text-text-primary"
        >
          Master
        </button>
        <span aria-hidden="true">/</span>
        <span>Master Item</span>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="mb-6">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

// _renderInformationStepTab removed

/**
 * Render basic input fields for item.
 * @param {ItemFormContentProps} props - Field props
 * @returns {ReactElement} Inputs
 */
// eslint-disable-next-line max-lines-per-function
const _renderBasicInputs = (props: ItemFormContentProps): ReactElement => {
  const nameError = _getFieldError(props.errors?.name);

  return (
    <>
      <InputComponent
        id="item-name"
        type="text"
        label="Item Name"
        placeholder="e.g. Wireless Microphone"
        required
        value={props.name}
        errorMessage={nameError ?? undefined}
        onChange={props.handleNameChange}
        className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
          nameError
            ? "[&_.ant-input]:!border-danger"
            : "[&_.ant-input]:!border-border-strong"
        } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
      />
      <div>
        <Select
          id="item-category"
          label="Category"
          labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
          className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
          selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
          required
          value={props.categoryId}
          disabled={props.isCategoryLoading}
          placeholder={
            props.isCategoryLoading ? "Loading categories..." : "Select category"
          }
          options={props.categories.map((cat) => ({
            label: cat.category_name,
            value: cat.id,
          }))}
          onChange={props.handleCategoryChange}
          errorMessage={
            props.categoryError ?? _getFieldError(props.errors?.categoryId)
          }
        />
      </div>
    </>
  );
};

/**
 * Render numerical fields for item.
 * @param {ItemFormContentProps} props - Field props
 * @returns {ReactElement} Numerical inputs
 */
// eslint-disable-next-line max-lines-per-function
const _renderNumericalInputs = (props: ItemFormContentProps): ReactElement => {
  const priceError = _getFieldError(props.errors?.price);
  const stockError = _getFieldError(props.errors?.stock);
  const durationError = _getFieldError(props.errors?.duration);

  return (
    <>
      <InputComponent
        id="item-price"
        type="text"
        label="Price"
        placeholder="Rp 0"
        required
        inputMode="numeric"
        value={formatRupiahInput(props.price)}
        errorMessage={priceError ?? undefined}
        onChange={props.handlePriceChange}
        className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
          priceError
            ? "[&_.ant-input]:!border-danger"
            : "[&_.ant-input]:!border-border-strong"
        } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
      />
      <InputComponent
        id="item-stock"
        type="text"
        label="Stock"
        placeholder="0"
        required
        inputMode="numeric"
        value={props.stock}
        errorMessage={stockError ?? undefined}
        onChange={props.handleStockChange}
        className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
          stockError
            ? "[&_.ant-input]:!border-danger"
            : "[&_.ant-input]:!border-border-strong"
        } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
      />
      <div className="lg:col-span-2">
        <InputComponent
          id="item-duration"
          type="text"
          label="Duration (Days)"
          placeholder="1"
          required
          inputMode="numeric"
          value={props.duration}
          errorMessage={durationError ?? undefined}
          onChange={props.handleDurationChange}
          className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
            durationError
              ? "[&_.ant-input]:!border-danger"
              : "[&_.ant-input]:!border-border-strong"
          } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
        />
      </div>
    </>
  );
};

/**
 * Render extra fields for item.
 * @param {ItemFormContentProps} props - Field props
 * @returns {ReactElement} Extra inputs
 */
// eslint-disable-next-line max-lines-per-function
const _renderExtraInputs = (props: ItemFormContentProps): ReactElement => (
  <>
    <div className="space-y-2">
      <span className="text-lg font-normal text-text-primary lg:text-lg">
        Upload Image
      </span>
      <input
        id="item-image"
        type="file"
        accept="image/*"
        aria-label="Upload image"
        onChange={props.handleImageChange}
        disabled={props.isImageUploading}
        className="h-16 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 py-3 text-xl font-normal outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-action-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-text-inverse hover:file:bg-action-primary-hover lg:h-14 lg:text-lg"
      />
      {props.isImageUploading && (
        <p className="text-sm text-text-secondary">Uploading image…</p>
      )}
      {props.imageUploadError !== null && (
        <p role="alert" className="text-sm text-danger">
          {props.imageUploadError}
        </p>
      )}
      {props.image && (
        <a
          href={props.image}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-sm font-medium text-action-primary underline hover:text-action-primary-hover"
        >
          Uploaded: {props.image.split("/").pop()}
        </a>
      )}
    </div>
    <label className="block space-y-2 lg:col-span-2">
      <span className="text-lg font-normal text-text-primary lg:text-lg">
        Remarks
      </span>
      <textarea
        value={props.remark}
        onChange={props.handleRemarkChange}
        placeholder="Optional notes"
        aria-label="Remarks"
        className="min-h-36 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 py-4 text-xl font-normal outline-none placeholder:font-normal placeholder:text-xl placeholder:text-text-tertiary focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:min-h-28 lg:text-lg lg:placeholder:text-lg"
      />
    </label>
  </>
);

/**
 * Render form action footer.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {boolean} isSubmitting - Submitting state
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Action element
 */
const _renderFormActions = (
  isEditMode: boolean,
  isSubmitting: boolean,
  goBack: () => void,
): ReactElement => {
  const buttonText = isEditMode ? "Update Item" : "Create Item";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-auto flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:border-border-default">
      <button
        type="button"
        onClick={goBack}
        disabled={isSubmitting}
        className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50 lg:text-lg"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60 lg:text-lg"
      >
        {isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Render notification alerts.
 * @param {string | null} errorMessage - Error alert text
 * @param {string | null} successMessage - Success alert text
 * @returns {ReactElement | null} Alert element
 */
const _renderAlerts = (
  errorMessage: string | null,
  successMessage: string | null,
): ReactElement | null => {
  if (errorMessage) {
    return <AlertComponent type="error" message={errorMessage} toast closable />;
  }

  if (successMessage) {
    return (
      <AlertComponent
        type="success"
        message={successMessage}
        toast
        closable
      />
    );
  }

  return null;
};

/**
 * Render form card container.
 * @param {MasterItemCreateFormState} props - Form state
 * @returns {ReactElement} Form element
 */
const _renderFormCard = (
  props: MasterItemCreateFormState,
): ReactElement => (
    <form
      noValidate
      onSubmit={props.handleSubmit}
      className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:rounded-3xl lg:p-10"
    >
    <div className="pb-6">
      <section className="space-y-5">
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          {_renderBasicInputs(props)}
          {_renderNumericalInputs(props)}
          {_renderExtraInputs(props)}
          {_renderStatusField(props)}
        </div>
      </section>
    </div>
    {_renderFormActions(props.isEditMode, props.isSubmitting, props.goBack)}
  </form>
);

/**
 * Render create item form.
 * @param {MasterItemCreateFormState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterItemCreateForm = (
  props: MasterItemCreateFormState,
): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
    {_renderAlerts(props.errorMessage, props.successMessage)}
    {_renderMobileBack(props.isEditMode, props.goBack)}
    <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
      {_renderHeaderSection(props.isEditMode, props.goBack)}
      {_renderFormCard(props)}
      <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
    </div>
  </div>
);
