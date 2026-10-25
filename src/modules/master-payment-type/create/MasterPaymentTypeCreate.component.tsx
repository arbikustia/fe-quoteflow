import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterPaymentTypeCreateFormState } from "./MasterPaymentTypeCreate.type";

/**
 * Read validation message from React Hook Form.
 * @param {FieldError | undefined} error - Field validation error
 * @returns {string | null} Validation message
 */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/**
 * Render status switch field.
 * @param {MasterPaymentTypeCreateFormState} props - Form state
 * @returns {ReactElement | null} Status field
 */
const _renderStatusField = (props: MasterPaymentTypeCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text-primary">Status</span>
        <span className="text-xs text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="Payment type status" checked={props.isActive} onChange={props.handleStatusChange} />
    </div>
  );
};

/**
 * Render mobile back bar.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Back bar
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
 * Render form header.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Header
 */
const _renderHeader = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Payment Type" : "New Payment Type";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master Payment Type</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 pl-1">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">{isEditMode ? "Update the payment type details below." : "Fill in the payment type details below."}</p>
      </div>
    </>
  );
};

/**
 * Render payment type form body.
 * @param {MasterPaymentTypeCreateFormState} props - Form state
 * @returns {ReactElement} Form body
 */
const _renderForm = (props: MasterPaymentTypeCreateFormState): ReactElement => {
  const buttonText = props.isEditMode ? "Update Payment Type" : "Create Payment Type";
  const submittingText = props.isEditMode ? "Updating…" : "Creating…";
  const nameError = props.isSubmitted && !props.name ? "Payment type name is required." : _getFieldError(props.errors?.name);

  return (
    <form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
      <div className="space-y-4">
        <InputComponent
          id="payment-type-name"
          type="text"
          label="Payment Type Name"
          placeholder="e.g. Full Payment"
          value={props.name}
          required
          errorMessage={nameError}
          onChange={props.handleNameChange}
        />
        {_renderStatusField(props)}
      </div>
      <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
        <button type="submit" disabled={props.isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto">{props.isSubmitting ? submittingText : buttonText}</button>
      </div>
    </form>
  );
};

/**
 * Render payment type create/edit form.
 * @param {MasterPaymentTypeCreateFormState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterPaymentTypeCreateForm = (props: MasterPaymentTypeCreateFormState): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {props.successMessage && <AlertComponent type="success" message={props.successMessage} toast closable />}
    {_renderMobileBack(props.goBack)}
    <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-0 lg:mt-0 lg:px-0">
      {_renderHeader(props.isEditMode, props.goBack)}
      {props.isLoadingInitialData ? <p className="py-12 text-center text-sm text-text-secondary">Loading payment type data…</p> : _renderForm(props)}
    </div>
  </div>
);
