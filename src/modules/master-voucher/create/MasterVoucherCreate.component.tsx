/* eslint-disable jsdoc/require-param-type, jsdoc/require-param-description, jsdoc/require-returns */
import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import type { MasterVoucherCreateFormState } from "./MasterVoucherCreate.type";

/**
 * Read validation message from error.
 * @param error
 */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/**
 * Render status switch field (edit mode only).
 * @param props
 */
const _renderStatusField = (props: MasterVoucherCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text-primary">Status</span>
        <span className="text-xs text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="Voucher status" checked={props.isActive} onChange={props.handleStatusChange} />
    </div>
  );
};

/**
 * Render mobile back button bar.
 * @param goBack
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-surface px-0 lg:hidden">
    <button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  </div>
);

/**
 * Render breadcrumb and page title header.
 * @param isEditMode
 * @param goBack
 */
const _renderHeader = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Voucher" : "New Voucher";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master Voucher</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 pl-1">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
          {isEditMode ? "Update the voucher details below." : "Fill in the voucher details below."}
        </p>
      </div>
    </>
  );
};

const CODE_MODE_OPTIONS = [
  { label: "Generate Code", value: "generate" },
  { label: "Type Code", value: "type" },
];

/**
 * Render code option dropdown and custom code field when active.
 * @param props
 */
const _renderCodeOption = (props: MasterVoucherCreateFormState): ReactElement => (
  <>
    <Select
      id="voucher-code-mode"
      label="Code Option"
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
        placeholder="Min 7, max 8 chars (alphanumeric)"
        value={props.code}
        required
        errorMessage={_getFieldError(props.errors?.code)}
        onChange={props.handleCodeChange}
      />
    )}
  </>
);

/**
 * Render form fields.
 * @param props
 */
const _renderFields = (props: MasterVoucherCreateFormState): ReactElement => {
  const nameError = props.isSubmitted && !props.name ? "Voucher name is required." : _getFieldError(props.errors?.name);
  const discountError = props.isSubmitted && !props.discountPercent ? "Discount percentage is required." : _getFieldError(props.errors?.discountPercent);

  return (
    <div className="space-y-4">
      <InputComponent
        id="voucher-name"
        type="text"
        label="Voucher Name"
        placeholder="e.g. Summer Promo"
        value={props.name}
        required
        errorMessage={nameError}
        onChange={props.handleNameChange}
      />
      {_renderCodeOption(props)}
      <InputComponent
        id="discount-percent"
        type="number"
        label="Discount (%)"
        placeholder="e.g. 10"
        value={props.discountPercent === "" ? null : Number(props.discountPercent)}
        min={0}
        max={100}
        required
        errorMessage={discountError}
        onChange={props.handleDiscountChange}
      />
      {_renderStatusField(props)}
    </div>
  );
};

/**
 * Render form tag and submit button.
 * @param props
 */
const _renderForm = (props: MasterVoucherCreateFormState): ReactElement => {
  const buttonText = props.isEditMode ? "Update Voucher" : "Create Voucher";
  const submittingText = props.isEditMode ? "Updating…" : "Creating…";

  return (
    <form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
      {_renderFields(props)}
      <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
        <button type="submit" disabled={props.isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto">
          {props.isSubmitting ? submittingText : buttonText}
        </button>
      </div>
    </form>
  );
};

/**
 * Render master voucher create/edit form.
 * @param props
 */
export const MasterVoucherCreateComponent = (props: MasterVoucherCreateFormState): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {_renderMobileBack(props.goBack)}
    <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-0 lg:mt-0 lg:px-0">
      {_renderHeader(props.isEditMode, props.goBack)}
      {_renderForm(props)}
    </div>
  </div>
);
