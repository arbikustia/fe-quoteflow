import * as React from "react";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import { ITEM_STATUS_BADGE_CLASS } from "../MasterItem.config";

import { ITEM_FORM_MODE_TEXT, ITEM_FORM_STATUS_MESSAGE } from "./MasterItemCreate.config";
import type { ItemFormModeText, ItemTextField, MasterItemCreateProps } from "./MasterItemCreate.type";
import { formatRupiahInput, getImageFileName } from "./MasterItemCreate.util";

import Layout from "@/app/layout";

const FIELD_CLASS_NAME = "!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 [&_.ant-input:not(.ant-input-status-error)]:!border-border-strong [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary";

/** Static props of each text input. */
const TEXT_FIELDS: { field: ItemTextField; id: string; label: string; placeholder: string; isNumeric: boolean; className?: string }[] = [
  { field: "name", id: "item-name", label: "Item Name", placeholder: "e.g. Wireless Microphone", isNumeric: false },
  { field: "price", id: "item-price", label: "Price", placeholder: "Rp 0", isNumeric: true },
  { field: "stock", id: "item-stock", label: "Stock", placeholder: "0", isNumeric: true },
  { field: "duration", id: "item-duration", label: "Duration (Days)", placeholder: "1", isNumeric: true, className: "lg:col-span-2" },
];

/**
 * Render the mobile title bar with back button.
 * @param {ItemFormModeText} modeText - Copy of the current mode
 * @param {() => void} onBack - Back callback
 * @returns {React.ReactElement} - Mobile title bar
 */
const _renderMobileHeader = (modeText: ItemFormModeText, onBack: () => void): React.ReactElement => (
  <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
    <BackButton onClick={onBack} />
    <div className="min-w-0">
      <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">{modeText.title}</h2>
      <p className="mt-1 truncate text-sm text-text-secondary">{modeText.subtitle}</p>
    </div>
  </div>
);

/**
 * Render the desktop breadcrumb and title.
 * @param {ItemFormModeText} modeText - Copy of the current mode
 * @param {() => void} onBack - Back callback
 * @returns {React.ReactElement} - Desktop header
 */
const _renderDesktopHeader = (modeText: ItemFormModeText, onBack: () => void): React.ReactElement => (
  <div className="hidden lg:block">
    <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary">
      <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">
        Master
      </button>
      <span aria-hidden="true">/</span>
      <span>Master Item</span>
      <span aria-hidden="true">/</span>
      <span className="text-text-primary">{modeText.title}</span>
    </nav>
    <div className="mb-6">
      <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{modeText.title}</h2>
      <p className="mt-2 text-sm text-text-secondary">{modeText.subtitle}</p>
    </div>
  </div>
);

/**
 * Render one required text input.
 * @param {MasterItemCreateProps} props - Form props
 * @param {(typeof TEXT_FIELDS)[number]} config - Static input props
 * @returns {React.ReactElement} - Text field
 */
const _renderTextField = (props: MasterItemCreateProps, config: (typeof TEXT_FIELDS)[number]): React.ReactElement => {
  const { values, fieldErrors, onTextChange } = props;
  const value = config.field === "price" ? formatRupiahInput(values.price) : values[config.field];

  return (
    <div key={config.field} className={config.className}>
      <InputComponent
        id={config.id}
        type="text"
        label={config.label}
        placeholder={config.placeholder}
        required={true}
        inputMode={config.isNumeric ? "numeric" : undefined}
        value={value}
        errorMessage={fieldErrors[config.field]}
        onChange={onTextChange[config.field]}
        className={FIELD_CLASS_NAME}
      />
    </div>
  );
};

/**
 * Render the category select.
 * @param {MasterItemCreateProps} props - Form props
 * @returns {React.ReactElement} - Category field
 */
const _renderCategoryField = (props: MasterItemCreateProps): React.ReactElement => (
  <Select
    id="item-category"
    label="Category"
    labelClassName="!text-lg !font-normal !normal-case !text-text-primary lg:!text-lg"
    className="mb-0 [&_.ant-select-selector]:!min-h-16 lg:[&_.ant-select-selector]:!min-h-14"
    selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg [&_.ant-select-content]:!font-normal"
    required={true}
    value={props.values.categoryId}
    disabled={props.isCategoryLoading}
    placeholder={props.isCategoryLoading ? "Loading categories..." : "Select category"}
    options={props.categoryOptions}
    onChange={props.onCategoryChange}
    errorMessage={props.categoryErrorMessage}
  />
);

/**
 * Render the image upload field with its status.
 * @param {MasterItemCreateProps} props - Form props
 * @returns {React.ReactElement} - Image field
 */
const _renderImageField = (props: MasterItemCreateProps): React.ReactElement => {
  const { values, isImageUploading, imageUploadError, onImageChange } = props;

  return (
    <div className="space-y-2">
      <span className="text-lg font-normal text-text-primary">Upload Image</span>
      <input
        id="item-image"
        type="file"
        accept="image/*"
        aria-label="Upload image"
        onChange={onImageChange}
        disabled={isImageUploading}
        className="h-16 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 py-3 text-xl font-normal outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-action-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-text-inverse hover:file:bg-action-primary-hover lg:h-14 lg:text-lg"
      />
      {isImageUploading && <p className="text-sm text-text-secondary">Uploading image…</p>}
      {imageUploadError && <p role="alert" className="text-sm text-danger">{imageUploadError}</p>}
      {values.image && (
        <a href={values.image} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium text-action-primary underline hover:text-action-primary-hover">
          Uploaded: {getImageFileName(values.image)}
        </a>
      )}
    </div>
  );
};

/**
 * Render the optional remark textarea.
 * @param {MasterItemCreateProps} props - Form props
 * @returns {React.ReactElement} - Remark field
 */
const _renderRemarkField = (props: MasterItemCreateProps): React.ReactElement => (
  <label className="block space-y-2 lg:col-span-2">
    <span className="text-lg font-normal text-text-primary">Remarks</span>
    <textarea
      value={props.values.remark}
      onChange={props.onRemarkChange}
      placeholder="Optional notes"
      aria-label="Remarks"
      className="min-h-36 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 py-4 text-xl font-normal outline-none placeholder:text-xl placeholder:font-normal placeholder:text-text-tertiary focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:min-h-28 lg:text-lg lg:placeholder:text-lg"
    />
  </label>
);

/**
 * Render the active status switch with its badge (edit mode only).
 * @param {MasterItemCreateProps} props - Form props
 * @returns {React.ReactElement | null} - Status field, or null in create mode
 */
const _renderStatusField = (props: MasterItemCreateProps): React.ReactElement | null => {
  const { mode, values, onStatusChange } = props;

  if (mode !== "edit") {
    return null;
  }

  const status = values.isActive ? "active" : "inactive";

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-normal text-text-primary">Status</span>
          <span className={`inline-flex rounded-full px-3 py-0.5 text-base font-semibold uppercase ${ITEM_STATUS_BADGE_CLASS[status]}`}>{status}</span>
        </div>
        <span className="text-base text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="Item status" checked={values.isActive} onChange={onStatusChange} />
    </div>
  );
};

/**
 * Render the cancel and submit buttons.
 * @param {MasterItemCreateProps} props - Form props
 * @param {ItemFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Form actions
 */
const _renderFormActions = (props: MasterItemCreateProps, modeText: ItemFormModeText): React.ReactElement => {
  const { isSubmitting, onBack } = props;

  return (
    <div className="mt-auto flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:border-border-default">
      <button
        type="button"
        onClick={onBack}
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
        {isSubmitting ? modeText.submittingLabel : modeText.submitLabel}
      </button>
    </div>
  );
};

/**
 * Render the form, or the unavailable message in its place.
 * @param {MasterItemCreateProps} props - Form props
 * @param {ItemFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Form or status message
 */
const _renderFormContent = (props: MasterItemCreateProps, modeText: ItemFormModeText): React.ReactElement => {
  const { formStatus, onSubmit } = props;

  if (formStatus !== "ready") {
    return <p className="py-12 text-center text-sm text-text-secondary">{ITEM_FORM_STATUS_MESSAGE[formStatus]}</p>;
  }

  const [nameField, ...numberFields] = TEXT_FIELDS;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:rounded-3xl lg:p-10"
    >
      <div className="pb-6">
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          {_renderTextField(props, nameField)}
          {_renderCategoryField(props)}
          {numberFields.map((config) => _renderTextField(props, config))}
          {_renderImageField(props)}
          {_renderRemarkField(props)}
          {_renderStatusField(props)}
        </div>
      </div>
      {_renderFormActions(props, modeText)}
    </form>
  );
};

/**
 * Render the item create / edit page.
 * @param {MasterItemCreateProps} props - Form props
 * @returns {React.ReactElement} - Item form page
 */
const MasterItemCreateComponent = (props: MasterItemCreateProps): React.ReactElement => {
  const { mode, errorMessage, onBack } = props;
  const modeText = ITEM_FORM_MODE_TEXT[mode];

  return (
    <Layout>
      <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
        {errorMessage && <AlertComponent type="error" message={errorMessage} toast closable />}
        {_renderMobileHeader(modeText, onBack)}
        <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
          {_renderDesktopHeader(modeText, onBack)}
          {_renderFormContent(props, modeText)}
          <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
        </div>
      </div>
    </Layout>
  );
};

export default MasterItemCreateComponent;
