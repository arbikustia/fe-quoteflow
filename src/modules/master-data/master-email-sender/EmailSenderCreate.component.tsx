import type { ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { EmailSenderCreateProps } from "./EmailSenderCreate.type";

const _fieldClassName = "!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 [&_.ant-input:not(.ant-input-status-error)]:!border-border-strong [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input-number]:!h-16 lg:[&_.ant-input-number]:!h-14 [&_.ant-input-number]:!rounded-2xl [&_.ant-input-number]:!border-2 [&_.ant-input-number:not(.ant-input-number-status-error)]:!border-border-strong [&_.ant-input-number.ant-input-number-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary";

/**
 * @param {string} title - Title
 * @param {() => void} onBack - On back
 * @returns {ReactElement} Rendered element
 */
const _renderMobileBack = (title: string, onBack: () => void): ReactElement => {
  const subtitle = "Manage SMTP email sender settings";

  return (
    <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
      <BackButton onClick={onBack} />
      <div className="min-w-0">
        <h2 className="min-w-0 truncate text-4xl font-semibold tracking-tight text-text-primary">{title}</h2>
        <p className="mt-1 truncate text-sm text-text-secondary">{subtitle}</p>
      </div>
    </div>
  );
};

/**
 * @param {string} title - Title
 * @param {() => void} onBack - On back
 * @returns {ReactElement} Rendered element
 */
const _renderHeader = (title: string, onBack: () => void): ReactElement => {
  const subtitle = "Manage SMTP email sender settings";

  return (
    <div className="hidden lg:block">
      <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary">
        <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">Master</button>
        <span aria-hidden="true">/</span>
        <span>Master Email Sender</span>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="mb-6"><h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2><p className="mt-2 text-sm text-text-secondary">{subtitle}</p></div>
    </div>
  );
};


/**
 * @param {string} label - Label
 * @param {string} description - Description
 * @param {boolean} checked - Checked
 * @param {(checked: boolean) => void} onChange - On change
 * @returns {ReactElement} Rendered element
 */
const _renderSwitch = (label: string, description: string, checked: boolean, onChange: (checked: boolean) => void): ReactElement => (
  <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
    <div className="flex flex-col">
      <span className="text-lg font-normal text-text-primary">{label}</span>
      <span className="text-base text-text-secondary">{description}</span>
    </div>
    <SwitchComponent label={label} checked={checked} onChange={onChange} />
  </div>
);

/**
 * @param {EmailSenderCreateProps} props - Props
 * @returns {ReactElement | null} Rendered element
 */
const _renderStatusSwitch = (props: EmailSenderCreateProps): ReactElement | null => {
  if (!props.isEditMode) return null;

  const isActive = props.status === 1;

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-normal text-text-primary">Status</span>
          <span className={`inline-flex rounded-full border border-current px-3 py-0.5 text-base font-semibold uppercase ${isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>{isActive ? "active" : "inactive"}</span>
        </div>
        <span className="text-base text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="Email sender status" checked={isActive} onChange={props.onStatusChange} />
    </div>
  );
};


/**
 * Render the sender form fields.
 *
 * @param {EmailSenderCreateProps} props - Form props
 * @returns {ReactElement} Field grid
 */
const _renderFields = (props: EmailSenderCreateProps): ReactElement => (
  <div className="pb-6">
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      <InputComponent id="name" label="Name" placeholder="e.g. Finance Sender" required className={_fieldClassName} errorMessage={props.fieldErrors.name} value={props.name} onChange={props.onChange("name")} />
      <InputComponent id="email" type="email" label="Email" placeholder="e.g. finance@company.com" required className={_fieldClassName} errorMessage={props.fieldErrors.email} value={props.email} onChange={props.onChange("email")} />
      <InputComponent id="smtp-host" label="SMTP Host" placeholder="e.g. smtp.gmail.com" required className={_fieldClassName} errorMessage={props.fieldErrors.smtp_host} value={props.smtp_host} onChange={props.onChange("smtp_host")} />
      <InputComponent id="smtp-port" type="number" label="SMTP Port" required className={_fieldClassName} errorMessage={props.fieldErrors.smtp_port} value={props.smtp_port} onChange={props.onPortChange} />
      <InputComponent id="smtp-username" label="SMTP Username" required className={_fieldClassName} errorMessage={props.fieldErrors.smtp_username} value={props.smtp_username} onChange={props.onChange("smtp_username")} />
      <InputComponent id="smtp-password" type="password" label="SMTP Password" placeholder={props.isEditMode ? "Leave blank to keep current password" : "Enter SMTP password"} required={!props.isEditMode} className={_fieldClassName} errorMessage={props.fieldErrors.smtp_password} value={props.smtp_password} onChange={props.onChange("smtp_password")} />
      {_renderSwitch("Enable SSL", "Use an encrypted SMTP connection", props.enable_ssl, props.onSslChange)}
      {_renderSwitch("Default sender", "Use this sender as default", props.is_default, props.onDefaultChange)}
      {_renderStatusSwitch(props)}
    </div>
  </div>
);

/**
 * Render the form action buttons.
 *
 * @param {EmailSenderCreateProps} props - Form props
 * @param {string} submitText - Submit button label
 * @returns {ReactElement} Action row
 */
const _renderActions = (props: EmailSenderCreateProps, submitText: string): ReactElement => (
  <div className="mt-auto flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:border-border-default">
    <button
      type="button"
      onClick={props.onBack}
      disabled={props.isSubmitting}
      className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50 lg:text-lg"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={props.isSubmitting}
      className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60 lg:text-lg"
    >
      {props.isSubmitting ? "Saving…" : submitText}
    </button>
  </div>
);

/**
 * Render the email sender create/edit form.
 *
 * @param {EmailSenderCreateProps} props - Form props
 * @returns {ReactElement} Form element
 */
export const EmailSenderCreateComponent = (props: EmailSenderCreateProps): ReactElement => {
  const title = props.isEditMode ? "Edit Email Sender" : "New Email Sender";
  const submitText = props.isEditMode ? "Update Email Sender" : "Create Email Sender";

  return (
    <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {_renderMobileBack(title, props.onBack)}
      <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
        {_renderHeader(title, props.onBack)}
        <form
          noValidate
          onSubmit={props.onSubmit}
          className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:rounded-3xl lg:p-10"
        >
          {_renderFields(props)}
          {_renderActions(props, submitText)}
        </form>
        <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
      </div>
    </div>
  );
};

