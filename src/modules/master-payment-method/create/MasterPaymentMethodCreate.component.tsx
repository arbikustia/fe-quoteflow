import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterPaymentMethodCreateFormState } from "./MasterPaymentMethodCreate.type";

/**
 * Read validation message from React Hook Form.
 * @param {FieldError | undefined} error - Field validation error
 * @returns {string | null} Validation message
 */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/**
 * Render status switch field.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement | null} Status field
 */
const _renderStatusField = (props: MasterPaymentMethodCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-text-primary lg:text-sm">Status</span>
        <span className="text-base text-text-secondary lg:text-xs">Toggle active or inactive status</span>
      </div>
      <SwitchComponent
        label="Payment method status"
        checked={props.isActive}
        onChange={props.handleStatusChange}
      />
    </div>
  );
};

/**
 * Render mobile back bar.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Back bar
 */
const _renderMobileBack = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Payment Method" : "New Payment Method";

  return (
  <div className="sticky top-0 z-20 flex items-center gap-3 bg-background-surface px-0 lg:hidden">
    <button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <h2 className="truncate text-4xl font-semibold leading-tight text-text-primary">{title}</h2>
  </div>
  );
};

/**
 * Render form header.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Header
 */
const _renderHeader = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Payment Method" : "New Payment Method";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master Payment Method</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 hidden pl-1 lg:block">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">{isEditMode ? "Update the payment method details below." : "Fill in the payment method details below."}</p>
      </div>
    </>
  );
};

/**
 * Render input fields.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement} Fields grid
 */
const _renderFields = (props: MasterPaymentMethodCreateFormState): ReactElement => {
  const { name, description, errors, isSubmitted, handleNameChange, handleDescriptionChange } = props;

  return (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <InputComponent
          id="payment-method-name"
          type="text"
          label="Payment Method Name"
          className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
          placeholder="e.g. Bank Transfer"
          value={name}
          required
          errorMessage={isSubmitted && !name ? "Payment method name is required." : _getFieldError(errors?.name)}
          onChange={handleNameChange}
        />
      </div>
      <div className="lg:col-span-2">
        <InputComponent
          id="payment-method-description"
          type="textarea"
          label="Description"
          className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
          placeholder="Describe this payment method"
          value={description}
          required
          errorMessage={isSubmitted && !description ? "Description is required." : _getFieldError(errors?.description)}
          onChange={handleDescriptionChange}
        />
      </div>
      {_renderStatusField(props)}
    </div>
  );
};

/**
 * Render payment method form content.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement} Form element
 */
const _renderForm = (props: MasterPaymentMethodCreateFormState): ReactElement => {
  const { isEditMode, isSubmitting, handleSubmit } = props;
  const buttonText = isEditMode ? "Update Payment Method" : "Create Payment Method";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
      {_renderFields(props)}
      <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
        <button type="submit" disabled={isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto lg:text-sm">{isSubmitting ? submittingText : buttonText}</button>
      </div>
    </form>
  );
};

/**
 * Render payment method create/edit form.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterPaymentMethodCreateForm = (props: MasterPaymentMethodCreateFormState): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {props.successMessage && <AlertComponent type="success" message={props.successMessage} toast closable />}
    {_renderMobileBack(props.isEditMode, props.goBack)}
    <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:px-0 lg:text-base">
      {_renderHeader(props.isEditMode, props.goBack)}
      {props.isLoadingInitialData ? (
        <p className="py-12 text-center text-sm text-text-secondary">Loading payment method data…</p>
      ) : (
        _renderForm(props)
      )}
    </div>
  </div>
);
