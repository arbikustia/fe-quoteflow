import * as React from "react";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import { EMAIL_SENDER_STATUS_BADGE_CLASS } from "../MasterEmailSender.config";

import { EMAIL_SENDER_FORM_MODE_TEXT, EMAIL_SENDER_FORM_STATUS_MESSAGE } from "./MasterEmailSenderCreate.config";
import type { EmailSenderFormModeText, MasterEmailSenderCreateProps } from "./MasterEmailSenderCreate.type";

import Layout from "@/app/layout";

const FIELD_CLASS_NAME = "!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 [&_.ant-input:not(.ant-input-status-error)]:!border-border-strong [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input-number]:!h-16 lg:[&_.ant-input-number]:!h-14 [&_.ant-input-number]:!rounded-2xl [&_.ant-input-number]:!border-2 [&_.ant-input-number:not(.ant-input-number-status-error)]:!border-border-strong [&_.ant-input-number.ant-input-number-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary";

/**
 * Render the mobile title bar with back button.
 * @param {EmailSenderFormModeText} modeText - Copy of the current mode
 * @param {() => void} onBack - Back callback
 * @returns {React.ReactElement} - Mobile title bar
 */
const _renderMobileHeader = (modeText: EmailSenderFormModeText, onBack: () => void): React.ReactElement => (
  <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
    <BackButton onClick={onBack} />
    <div className="min-w-0">
      <h2 className="min-w-0 truncate text-4xl font-semibold tracking-tight text-text-primary">{modeText.title}</h2>
      <p className="mt-1 truncate text-sm text-text-secondary">{modeText.subtitle}</p>
    </div>
  </div>
);

/**
 * Render the desktop breadcrumb and title.
 * @param {EmailSenderFormModeText} modeText - Copy of the current mode
 * @param {() => void} onBack - Back callback
 * @returns {React.ReactElement} - Desktop header
 */
const _renderDesktopHeader = (modeText: EmailSenderFormModeText, onBack: () => void): React.ReactElement => (
  <div className="hidden lg:block">
    <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary">
      <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">
        Master
      </button>
      <span aria-hidden="true">/</span>
      <span>Master Email Sender</span>
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
 * Render a labelled switch row.
 * @param {string} label - Switch label
 * @param {string} description - Helper text
 * @param {boolean} checked - Whether the switch is on
 * @param {(checked: boolean) => void} onChange - Switch change callback
 * @returns {React.ReactElement} - Switch row
 */
const _renderSwitch = (label: string, description: string, checked: boolean, onChange: (checked: boolean) => void): React.ReactElement => (
  <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
    <div className="flex flex-col">
      <span className="text-lg font-normal text-text-primary">{label}</span>
      <span className="text-base text-text-secondary">{description}</span>
    </div>
    <SwitchComponent label={label} checked={checked} onChange={onChange} />
  </div>
);

/**
 * Render the active status switch with its badge (edit mode only).
 * @param {MasterEmailSenderCreateProps} props - Form props
 * @returns {React.ReactElement | null} - Status field, or null in create mode
 */
const _renderStatusField = (props: MasterEmailSenderCreateProps): React.ReactElement | null => {
  const { mode, values, onToggleChange } = props;

  if (mode !== "edit") {
    return null;
  }

  const status = values.isActive ? "active" : "inactive";

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-normal text-text-primary">Status</span>
          <span className={`inline-flex rounded-full border border-current px-3 py-0.5 text-base font-semibold uppercase ${EMAIL_SENDER_STATUS_BADGE_CLASS[status]}`}>{status}</span>
        </div>
        <span className="text-base text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="Email sender status" checked={values.isActive} onChange={onToggleChange.isActive} />
    </div>
  );
};

/**
 * Render the sender input fields and switches.
 * @param {MasterEmailSenderCreateProps} props - Form props
 * @param {EmailSenderFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Field grid
 */
const _renderFields = (props: MasterEmailSenderCreateProps, modeText: EmailSenderFormModeText): React.ReactElement => {
  const { mode, values, fieldErrors, onTextChange, onPortChange, onToggleChange } = props;

  return (
    <div className="pb-6">
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <InputComponent id="name" label="Name" placeholder="e.g. Finance Sender" required={true} className={FIELD_CLASS_NAME} errorMessage={fieldErrors.name} value={values.name} onChange={onTextChange.name} />
        <InputComponent id="email" type="email" label="Email" placeholder="e.g. finance@company.com" required={true} className={FIELD_CLASS_NAME} errorMessage={fieldErrors.email} value={values.email} onChange={onTextChange.email} />
        <InputComponent id="smtp-host" label="SMTP Host" placeholder="e.g. smtp.gmail.com" required={true} className={FIELD_CLASS_NAME} errorMessage={fieldErrors.smtpHost} value={values.smtpHost} onChange={onTextChange.smtpHost} />
        <InputComponent id="smtp-port" type="number" label="SMTP Port" required={true} className={FIELD_CLASS_NAME} errorMessage={fieldErrors.smtpPort} value={values.smtpPort} onChange={onPortChange} />
        <InputComponent id="smtp-username" label="SMTP Username" required={true} className={FIELD_CLASS_NAME} errorMessage={fieldErrors.smtpUsername} value={values.smtpUsername} onChange={onTextChange.smtpUsername} />
        <InputComponent id="smtp-password" type="password" label="SMTP Password" placeholder={modeText.passwordPlaceholder} required={mode === "create"} className={FIELD_CLASS_NAME} errorMessage={fieldErrors.smtpPassword} value={values.smtpPassword} onChange={onTextChange.smtpPassword} />
        {_renderSwitch("Enable SSL", "Use an encrypted SMTP connection", values.enableSsl, onToggleChange.enableSsl)}
        {_renderSwitch("Default sender", "Use this sender as default", values.isDefault, onToggleChange.isDefault)}
        {_renderStatusField(props)}
      </div>
    </div>
  );
};

/**
 * Render the cancel and submit buttons.
 * @param {MasterEmailSenderCreateProps} props - Form props
 * @param {EmailSenderFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Form actions
 */
const _renderFormActions = (props: MasterEmailSenderCreateProps, modeText: EmailSenderFormModeText): React.ReactElement => {
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
 * @param {MasterEmailSenderCreateProps} props - Form props
 * @param {EmailSenderFormModeText} modeText - Copy of the current mode
 * @returns {React.ReactElement} - Form or status message
 */
const _renderFormContent = (props: MasterEmailSenderCreateProps, modeText: EmailSenderFormModeText): React.ReactElement => {
  const { formStatus, onSubmit } = props;

  if (formStatus !== "ready") {
    return <p className="py-12 text-center text-sm text-text-secondary">{EMAIL_SENDER_FORM_STATUS_MESSAGE[formStatus]}</p>;
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:rounded-3xl lg:p-10"
    >
      {_renderFields(props, modeText)}
      {_renderFormActions(props, modeText)}
    </form>
  );
};

/**
 * Render the email sender create / edit page.
 * @param {MasterEmailSenderCreateProps} props - Form props
 * @returns {React.ReactElement} - Email sender form page
 */
const MasterEmailSenderCreateComponent = (props: MasterEmailSenderCreateProps): React.ReactElement => {
  const { mode, errorMessage, onBack } = props;
  const modeText = EMAIL_SENDER_FORM_MODE_TEXT[mode];

  return (
    <Layout pageTitle="Email Sender">
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

export default MasterEmailSenderCreateComponent;
