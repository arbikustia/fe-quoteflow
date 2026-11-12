import * as React from "react";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import { CUSTOMER_FORM_MODE_TEXT, CUSTOMER_FORM_STATUS_MESSAGE, CUSTOMER_INPUT_FIELD } from "./MasterCustomerCreate.config";
import type { CustomerFormModeText, CustomerInputFieldConfig, MasterCustomerCreateProps } from "./MasterCustomerCreate.type";

import Layout from "@/app/layout";

/**
 * Get the border class of a field for its validation state.
 * @param {string} [errorMessage] - Field validation message
 * @param {string} errorClass - Class used when the field is invalid
 * @param {string} validClass - Class used when the field is valid
 * @returns {string} - Border class
 */
const _getBorderClass = (errorMessage: string | undefined, errorClass: string, validClass: string): string => {
  return errorMessage ? errorClass : validClass;
};

/**
 * Render the mobile title bar with back button.
 * @param {CustomerFormModeText} modeText - Copy of the current mode
 * @param {() => void} onBack - Back callback
 * @returns {React.ReactElement} - Mobile title bar
 */
const _renderMobileHeader = (modeText: CustomerFormModeText, onBack: () => void): React.ReactElement => (
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
 * @param {CustomerFormModeText} modeText - Copy of the current mode
 * @param {() => void} onBack - Back callback
 * @returns {React.ReactElement} - Desktop header
 */
const _renderDesktopHeader = (modeText: CustomerFormModeText, onBack: () => void): React.ReactElement => (
  <div className="hidden lg:block">
    <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary">
      <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">
        Master
      </button>
      <span aria-hidden="true">/</span>
      <span>Master Customer</span>
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
 * Render a required text input.
 * @param {CustomerInputFieldConfig} field - Static input configuration
 * @param {string} value - Current value
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} onChange - Change callback
 * @param {string} [errorMessage] - Validation message
 * @returns {React.ReactElement} - Input field
 */
const _renderInputField = (
  field: CustomerInputFieldConfig,
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  errorMessage?: string,
): React.ReactElement => (
  <InputComponent
    id={field.id}
    type={field.type}
    label={field.label}
    placeholder={field.placeholder}
    value={value}
    required={true}
    inputMode={field.inputMode}
    pattern={field.pattern}
    title={field.title}
    onChange={onChange}
    className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${_getBorderClass(errorMessage, "[&_.ant-input]:!border-danger", "[&_.ant-input]:!border-border-strong")} [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
    errorMessage={errorMessage}
  />
);

/**
 * Render the address textarea.
 * @param {MasterCustomerCreateProps} props - Form props
 * @returns {React.ReactElement} - Address field
 */
const _renderAddressField = (props: MasterCustomerCreateProps): React.ReactElement => {
  const { values, fieldErrors, onAddressChange } = props;

  return (
    <label className="block space-y-2 lg:col-span-2">
      <span className="text-lg font-normal text-text-primary lg:text-lg">
        Address
        <span aria-hidden="true" className="ml-1 text-danger">
          *
        </span>
      </span>
      <textarea
        id="customer-address"
        value={values.address}
        onChange={onAddressChange}
        placeholder="e.g. Jl. Sudirman No. 45"
        className={`min-h-36 w-full rounded-2xl border-2 ${_getBorderClass(fieldErrors.address, "border-danger", "border-border-strong")} bg-background-surface px-4 py-4 text-xl font-normal outline-none placeholder:font-normal placeholder:text-xl placeholder:text-text-tertiary focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:min-h-28 lg:text-lg lg:placeholder:text-lg`}
      />
      {fieldErrors.address && (
        <p role="alert" className="mt-1.5 text-sm text-danger">
          {fieldErrors.address}
        </p>
      )}
    </label>
  );
};

/**
 * Render the active status switch (edit mode only).
 * @param {MasterCustomerCreateProps} props - Form props
 * @returns {React.ReactElement | null} - Status field, or null in create mode
 */
const _renderStatusField = (props: MasterCustomerCreateProps): React.ReactElement | null => {
  const { mode, values, onStatusChange } = props;

  if (mode !== "edit") {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col">
        <span className="text-lg font-normal text-text-primary">Status</span>
        <span className="text-base text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="Customer status" checked={values.isActive} onChange={onStatusChange} />
    </div>
  );
};

/**
 * Render the cancel and submit buttons.
 * @param {MasterCustomerCreateProps} props - Form props
 * @param {CustomerFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Form actions
 */
const _renderFormActions = (props: MasterCustomerCreateProps, modeText: CustomerFormModeText): React.ReactElement => {
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
 * Render the customer form card.
 * @param {MasterCustomerCreateProps} props - Form props
 * @param {CustomerFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Form card
 */
const _renderForm = (props: MasterCustomerCreateProps, modeText: CustomerFormModeText): React.ReactElement => {
  const { values, fieldErrors, onNameChange, onEmailChange, onPhoneNumberChange, onSubmit } = props;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:rounded-3xl lg:p-10"
    >
      <div className="pb-6">
        <section className="space-y-5">
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            {_renderInputField(CUSTOMER_INPUT_FIELD.name, values.name, onNameChange, fieldErrors.name)}
            {_renderInputField(CUSTOMER_INPUT_FIELD.email, values.email, onEmailChange, fieldErrors.email)}
            {_renderInputField(CUSTOMER_INPUT_FIELD.phoneNumber, values.phoneNumber, onPhoneNumberChange, fieldErrors.phoneNumber)}
            {_renderAddressField(props)}
            {_renderStatusField(props)}
          </div>
        </section>
      </div>
      {_renderFormActions(props, modeText)}
    </form>
  );
};

/**
 * Render the form, or the loading / error message in its place.
 * @param {MasterCustomerCreateProps} props - Form props
 * @param {CustomerFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Form or status message
 */
const _renderFormContent = (props: MasterCustomerCreateProps, modeText: CustomerFormModeText): React.ReactElement => {
  const { formStatus } = props;

  if (formStatus === "ready") {
    return _renderForm(props, modeText);
  }

  return <p className="py-12 text-center text-sm text-text-secondary">{CUSTOMER_FORM_STATUS_MESSAGE[formStatus]}</p>;
};

/**
 * Render the customer create / edit page.
 * @param {MasterCustomerCreateProps} props - Form props
 * @returns {React.ReactElement} - Customer form page
 */
const MasterCustomerCreateComponent = (props: MasterCustomerCreateProps): React.ReactElement => {
  const { mode, errorMessage, onBack } = props;
  const modeText = CUSTOMER_FORM_MODE_TEXT[mode];

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

export default MasterCustomerCreateComponent;
