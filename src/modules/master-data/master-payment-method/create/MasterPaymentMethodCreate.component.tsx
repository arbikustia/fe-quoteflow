import * as React from "react";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import { PAYMENT_METHOD_STATUS_BADGE_CLASS } from "../MasterPaymentMethod.config";

import { PAYMENT_METHOD_FORM_MODE_TEXT, PAYMENT_METHOD_FORM_STATUS_MESSAGE } from "./MasterPaymentMethodCreate.config";
import type { MasterPaymentMethodCreateProps, PaymentMethodFormModeText } from "./MasterPaymentMethodCreate.type";

import Layout from "@/app/layout";

const FIELD_BASE_CLASS_NAME = "!mb-0 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 [&_.ant-input:not(.ant-input-status-error)]:!border-border-strong [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary";

const FIELD_CLASS_NAME = `${FIELD_BASE_CLASS_NAME} [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14`;

const TEXTAREA_CLASS_NAME = `${FIELD_BASE_CLASS_NAME} [&_.ant-input]:!min-h-36 lg:[&_.ant-input]:!min-h-28 [&_.ant-input]:!py-4`;

/**
 * Render the mobile title bar with back button.
 * @param {PaymentMethodFormModeText} modeText - Copy of the current mode
 * @param {() => void} onBack - Back callback
 * @returns {React.ReactElement} - Mobile title bar
 */
const _renderMobileHeader = (modeText: PaymentMethodFormModeText, onBack: () => void): React.ReactElement => (
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
 * @param {PaymentMethodFormModeText} modeText - Copy of the current mode
 * @param {() => void} onBack - Back callback
 * @returns {React.ReactElement} - Desktop header
 */
const _renderDesktopHeader = (modeText: PaymentMethodFormModeText, onBack: () => void): React.ReactElement => (
  <div className="hidden lg:block">
    <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary">
      <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">
        Master
      </button>
      <span aria-hidden="true">/</span>
      <span>Master Payment Method</span>
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
 * Render the active status switch with its badge (edit mode only).
 * @param {MasterPaymentMethodCreateProps} props - Form props
 * @returns {React.ReactElement | null} - Status field, or null in create mode
 */
const _renderStatusField = (props: MasterPaymentMethodCreateProps): React.ReactElement | null => {
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
          <span className={`inline-flex rounded-full border border-current px-3 py-0.5 text-base font-semibold uppercase ${PAYMENT_METHOD_STATUS_BADGE_CLASS[status]}`}>{status}</span>
        </div>
        <span className="text-base text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="Payment method status" checked={values.isActive} onChange={onStatusChange} />
    </div>
  );
};

/**
 * Render the name and description inputs and the status switch.
 * @param {MasterPaymentMethodCreateProps} props - Form props
 * @returns {React.ReactElement} - Field grid
 */
const _renderFields = (props: MasterPaymentMethodCreateProps): React.ReactElement => {
  const { values, fieldErrors, onNameChange, onDescriptionChange } = props;

  return (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <InputComponent
          id="payment-method-name"
          label="Payment Method Name"
          placeholder="e.g. Bank Transfer"
          required={true}
          className={FIELD_CLASS_NAME}
          errorMessage={fieldErrors.name}
          value={values.name}
          onChange={onNameChange}
        />
      </div>
      <div className="lg:col-span-2">
        <InputComponent
          id="payment-method-description"
          type="textarea"
          label="Description"
          placeholder="Describe this payment method"
          required={true}
          className={TEXTAREA_CLASS_NAME}
          errorMessage={fieldErrors.description}
          value={values.description}
          onChange={onDescriptionChange}
        />
      </div>
      {_renderStatusField(props)}
    </div>
  );
};

/**
 * Render the cancel and submit buttons.
 * @param {MasterPaymentMethodCreateProps} props - Form props
 * @param {PaymentMethodFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Form actions
 */
const _renderFormActions = (props: MasterPaymentMethodCreateProps, modeText: PaymentMethodFormModeText): React.ReactElement => {
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
 * Render the form, or the loading / error message in its place.
 * @param {MasterPaymentMethodCreateProps} props - Form props
 * @param {PaymentMethodFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Form or status message
 */
const _renderFormContent = (props: MasterPaymentMethodCreateProps, modeText: PaymentMethodFormModeText): React.ReactElement => {
  const { formStatus, onSubmit } = props;

  if (formStatus !== "ready") {
    return <p className="py-12 text-center text-sm text-text-secondary">{PAYMENT_METHOD_FORM_STATUS_MESSAGE[formStatus]}</p>;
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:rounded-3xl lg:p-10"
    >
      <div className="pb-6">
        {_renderFields(props)}
      </div>
      {_renderFormActions(props, modeText)}
    </form>
  );
};

/**
 * Render the payment method create / edit page.
 * @param {MasterPaymentMethodCreateProps} props - Form props
 * @returns {React.ReactElement} - Payment method form page
 */
const MasterPaymentMethodCreateComponent = (props: MasterPaymentMethodCreateProps): React.ReactElement => {
  const { mode, errorMessage, onBack } = props;
  const modeText = PAYMENT_METHOD_FORM_MODE_TEXT[mode];

  return (
    <Layout pageTitle={modeText.title} mobileWhiteBackground={true}>
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

export default MasterPaymentMethodCreateComponent;
