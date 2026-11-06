import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterPaymentMethodCreateFormState } from "./MasterPaymentMethodCreate.type";

/**
 * Read validation message from React Hook Form.
 * @param {FieldError | undefined} error - Field validation error
 * @returns {string | null} Validation message
 */
const _getFieldError = (error: FieldError | undefined): string | null =>
  error?.message?.toString() ?? null;

/**
 * Render back icon.
 * @returns {ReactElement} Back icon
 */


/**
 * Render mobile back bar.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Back bar
 */
const _renderMobileBack = (
  isEditMode: boolean,
  goBack: () => void,
): ReactElement => {
  const title = isEditMode ? "Edit Payment Method" : "New Payment Method";
  const subtitle = isEditMode ? "Update payment method information." : "Create a payment method for transactions.";

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
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Page header
 */
const _renderHeader = (
  isEditMode: boolean,
  goBack: () => void,
): ReactElement => {
  const title = isEditMode ? "Edit Payment Method" : "New Payment Method";
  const subtitle = isEditMode ? "Update payment method information." : "Create a payment method for transactions.";

  return (
    <div className="mb-6 hidden lg:block">
      <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master</button>
        <span aria-hidden="true">/</span>
        <span>Master Payment Method</span>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
      <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
    </div>
  );
};

// _renderInformationTab removed

const FIELD_CLASS_NAME = "!mb-0 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary";

/**
 * Render payment method name field.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement} Name field
 */
const _renderNameField = (
  props: MasterPaymentMethodCreateFormState,
): ReactElement => {
  const errorMessage = props.isSubmitted && !props.name
    ? "Payment method name is required."
    : _getFieldError(props.errors.name);

  return (
    <InputComponent
      id="payment-method-name"
      type="text"
      label="Payment Method Name"
      className={`${FIELD_CLASS_NAME} [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 ${errorMessage ? "[&_.ant-input]:!border-danger" : "[&_.ant-input]:!border-border-strong"}`}
      placeholder="e.g. Bank Transfer"
      value={props.name}
      required
      errorMessage={errorMessage ?? undefined}
      onChange={props.handleNameChange}
    />
  );
};

/**
 * Render payment method description field.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement} Description field
 */
const _renderDescriptionField = (
  props: MasterPaymentMethodCreateFormState,
): ReactElement => {
  const errorMessage = props.isSubmitted && !props.description
    ? "Description is required."
    : _getFieldError(props.errors.description);

  return (
    <InputComponent
      id="payment-method-description"
      type="textarea"
      label="Description"
      className={`${FIELD_CLASS_NAME} [&_.ant-input]:!min-h-36 lg:[&_.ant-input]:!min-h-28 [&_.ant-input]:!py-4 ${errorMessage ? "[&_.ant-input]:!border-danger" : "[&_.ant-input]:!border-border-strong"}`}
      placeholder="Describe this payment method"
      value={props.description}
      required
      errorMessage={errorMessage ?? undefined}
      onChange={props.handleDescriptionChange}
    />
  );
};

/**
 * Render payment method fields.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement} Fields grid
 */
const _renderFields = (
  props: MasterPaymentMethodCreateFormState,
): ReactElement => (
  <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
    <div className="lg:col-span-2">{_renderNameField(props)}</div>
    <div className="lg:col-span-2">{_renderDescriptionField(props)}</div>
    {_renderStatusField(props)}
  </div>
);

/**
 * Render status switch field.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement | null} Status field
 */
const _renderStatusField = (
  props: MasterPaymentMethodCreateFormState,
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
        <span className="text-base text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="Payment method status" checked={props.isActive} onChange={props.handleStatusChange} />
    </div>
  );
};

/**
 * Render form actions.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement} Form actions
 */
const _renderActions = (
  props: MasterPaymentMethodCreateFormState,
): ReactElement => {
  const buttonText = props.isEditMode
    ? "Update Payment Method"
    : "Create Payment Method";
  const submittingText = props.isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-8 flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button
        type="button"
        onClick={props.goBack}
        className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={props.isSubmitting}
        className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {props.isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Render form card.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement} Form card
 */
const _renderForm = (
  props: MasterPaymentMethodCreateFormState,
): ReactElement => (
  <form
    noValidate
    onSubmit={props.handleSubmit}
    className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:mb-5 lg:p-10"
  >
    <div className="pb-6">
      <section className="space-y-5">{_renderFields(props)}</section>
    </div>
    {_renderActions(props)}
  </form>
);

/**
 * Render payment method create/edit form.
 * @param {MasterPaymentMethodCreateFormState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterPaymentMethodCreateForm = (
  props: MasterPaymentMethodCreateFormState,
): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
    {props.errorMessage && (
      <AlertComponent type="error" message={props.errorMessage} toast closable />
    )}
    {props.successMessage && (
      <AlertComponent type="success" message={props.successMessage} toast closable />
    )}
    {_renderMobileBack(props.isEditMode, props.goBack)}
    <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
      {_renderHeader(props.isEditMode, props.goBack)}
      {props.isLoadingInitialData ? (
        <p className="py-12 text-center text-lg text-text-secondary">
          Loading payment method data…
        </p>
      ) : (
        _renderForm(props)
      )}
      <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
    </div>
  </div>
);
