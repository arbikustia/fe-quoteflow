import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import type { MasterVoucherCreateFormState } from "./MasterVoucherCreate.type";

const CODE_MODE_OPTIONS = [
  { label: "Generate Code", value: "generate" },
  { label: "Type Code", value: "type" },
];
const FIELD_CLASS_NAME = "!mb-0 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary";

/**
 * Read validation message from error.
 *
 * @param {FieldError | undefined} error - Field validation error
 * @returns {string | null} Validation message
 */
const _getFieldError = (error: FieldError | undefined): string | null =>
  error?.message?.toString() ?? null;

/**
 * Get voucher page copy.
 *
 * @param {boolean} isEditMode - Edit mode flag
 * @returns {{ title: string; subtitle: string }} Page copy
 */
const _getPageCopy = (
  isEditMode: boolean,
): { title: string; subtitle: string } => ({
  title: isEditMode ? "Edit Voucher" : "New Voucher",
  subtitle: isEditMode
    ? "Update the voucher details below."
    : "Fill in the voucher details below.",
});

/**
 * Render mobile back bar.
 *
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Back bar
 */
const _renderMobileBack = (
  isEditMode: boolean,
  goBack: () => void,
): ReactElement => {
  const { title, subtitle } = _getPageCopy(isEditMode);

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
 * Render desktop page header.
 *
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Page header
 */
const _renderHeader = (
  isEditMode: boolean,
  goBack: () => void,
): ReactElement => {
  const { title, subtitle } = _getPageCopy(isEditMode);

  return (
    <div className="mb-6 hidden lg:block">
      <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master</button>
        <span aria-hidden="true">/</span>
        <span>Master Voucher</span>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
      <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
    </div>
  );
};

// _renderInformationTab removed

/**
 * Render voucher name field.
 *
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement} Name field
 */
const _renderNameField = (props: MasterVoucherCreateFormState): ReactElement => {
  const errorMessage = props.isSubmitted && !props.name
    ? "Voucher name is required."
    : _getFieldError(props.errors.name);

  return (
    <InputComponent
      id="voucher-name"
      type="text"
      label="Voucher Name"
      className={`${FIELD_CLASS_NAME} [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 ${errorMessage ? "[&_.ant-input]:!border-danger" : "[&_.ant-input]:!border-border-strong"}`}
      placeholder="e.g. Summer Promo"
      value={props.name}
      required
      errorMessage={errorMessage ?? undefined}
      onChange={props.handleNameChange}
    />
  );
};

/**
 * Render code option and optional code field.
 *
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement} Code fields
 */
const _renderCodeFields = (props: MasterVoucherCreateFormState): ReactElement => (
  <>
    <Select
      id="voucher-code-mode"
      label="Code Option"
      labelClassName="!text-lg !font-normal !text-text-primary"
      className="!mb-0"
      selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg"
      placeholder="Select code option"
      value={props.codeMode}
      options={CODE_MODE_OPTIONS}
      onChange={props.handleCodeModeChange}
      required
    />
    {props.codeMode === "type" && (
      <InputComponent
        id="voucher-code"
        type="text"
        label="Voucher Code"
        className={`${FIELD_CLASS_NAME} [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 ${props.errors.code ? "[&_.ant-input]:!border-danger" : "[&_.ant-input]:!border-border-strong"}`}
        placeholder="Min 7, max 8 chars (alphanumeric)"
        value={props.code}
        required
        errorMessage={_getFieldError(props.errors.code) ?? undefined}
        onChange={props.handleCodeChange}
      />
    )}
  </>
);

/**
 * Render discount field.
 *
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement} Discount field
 */
const _renderDiscountField = (props: MasterVoucherCreateFormState): ReactElement => {
  const errorMessage = props.isSubmitted && !props.discountPercent
    ? "Discount percentage is required."
    : _getFieldError(props.errors.discountPercent);

  return (
    <InputComponent
      id="discount-percent"
      type="number"
      label="Discount (%)"
      className={`${FIELD_CLASS_NAME} [&_.ant-input-number]:!h-16 lg:[&_.ant-input-number]:!h-14 [&_.ant-input-number]:!rounded-2xl [&_.ant-input-number]:!border-2 [&_.ant-input-number-input]:!h-full [&_.ant-input-number-input]:!px-4 [&_.ant-input-number-input]:!text-xl lg:[&_.ant-input-number-input]:!text-lg ${errorMessage ? "[&_.ant-input-number]:!border-danger" : "[&_.ant-input-number]:!border-border-strong"}`}
      placeholder="e.g. 10"
      value={props.discountPercent === "" ? null : Number(props.discountPercent)}
      min={0}
      max={100}
      required
      errorMessage={errorMessage ?? undefined}
      onChange={props.handleDiscountChange}
    />
  );
};

/**
 * Render status switch field.
 *
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement | null} Status field
 */
const _renderStatusField = (props: MasterVoucherCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-normal text-text-primary">Status</span>
        <span className={`w-fit rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${props.isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
          {props.isActive ? "active" : "inactive"}
        </span>
      </div>
      <SwitchComponent label="Voucher status" checked={props.isActive} onChange={props.handleStatusChange} />
    </div>
  );
};

/**
 * Render voucher form fields.
 *
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement} Form fields
 */
const _renderFields = (props: MasterVoucherCreateFormState): ReactElement => (
  <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
    {_renderNameField(props)}
    {_renderCodeFields(props)}
    {_renderDiscountField(props)}
    {_renderStatusField(props)}
  </div>
);

/**
 * Render form actions.
 *
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement} Form actions
 */
const _renderActions = (props: MasterVoucherCreateFormState): ReactElement => {
  const buttonText = props.isEditMode ? "Update Voucher" : "Create Voucher";
  const submittingText = props.isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-auto flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:border-border-default">
      <button type="button" onClick={props.goBack} className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
        Cancel
      </button>
      <button type="submit" disabled={props.isSubmitting} className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60">
        {props.isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Render voucher form card.
 *
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement} Form card
 */
const _renderForm = (props: MasterVoucherCreateFormState): ReactElement => (
  <form noValidate onSubmit={props.handleSubmit} className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:p-10">
    <div className="pb-6">
      <section className="space-y-5">{_renderFields(props)}</section>
    </div>
    {_renderActions(props)}
  </form>
);

/**
 * Render master voucher create/edit form.
 *
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement} Voucher form
 */
export const MasterVoucherCreateComponent = (props: MasterVoucherCreateFormState): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {_renderMobileBack(props.isEditMode, props.goBack)}
    <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
      {_renderHeader(props.isEditMode, props.goBack)}
      {_renderForm(props)}
      <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
    </div>
  </div>
);
