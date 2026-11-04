import type { ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { EmailSenderCreateProps } from "./EmailSenderCreate.type";

const _fieldClassName = "!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 [&_.ant-input]:!border-border-strong [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary";

const _renderMobileBack = (title: string, onBack: () => void): ReactElement => (
  <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
    <button type="button" onClick={onBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-page text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    </button>
    <div className="min-w-0">
      <h2 className="min-w-0 truncate text-4xl font-semibold tracking-tight text-text-primary">{title}</h2>
      <p className="mt-1 truncate text-lg text-text-secondary">Configure SMTP sender details below.</p>
    </div>
  </div>
);

const _renderHeader = (title: string, onBack: () => void): ReactElement => (
  <>
    <nav aria-label="Breadcrumb" className="mb-2 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
      <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">Email Sender</button>
      <span aria-hidden="true">/</span><span className="text-text-primary">{title}</span>
    </nav>
    <div className="mb-6 hidden lg:block"><h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2><p className="mt-3 text-lg font-medium text-text-secondary opacity-70">Configure SMTP sender details below.</p></div>
  </>
);


const _renderSwitch = (label: string, description: string, checked: boolean, onChange: (checked: boolean) => void): ReactElement => (
  <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
    <div className="flex flex-col">
      <span className="text-lg font-semibold text-text-primary lg:text-sm">{label}</span>
      <span className="text-base text-text-secondary lg:text-xs">{description}</span>
    </div>
    <SwitchComponent label={label} checked={checked} onChange={onChange} />
  </div>
);


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
          className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:mb-5 lg:rounded-3xl lg:p-10"
        >
          <div className="pb-6">
            <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <InputComponent id="name" label="Name" placeholder="e.g. Finance Sender" required className={_fieldClassName} value={props.name} onChange={props.onChange("name")} />
              <InputComponent id="email" type="email" label="Email" placeholder="e.g. finance@company.com" required className={_fieldClassName} value={props.email} onChange={props.onChange("email")} />
              <InputComponent id="smtp-host" label="SMTP Host" placeholder="e.g. smtp.gmail.com" required className={_fieldClassName} value={props.smtp_host} onChange={props.onChange("smtp_host")} />
              <InputComponent id="smtp-port" type="number" label="SMTP Port" required className={_fieldClassName} value={props.smtp_port} onChange={props.onPortChange} />
              <InputComponent id="smtp-username" label="SMTP Username" required className={_fieldClassName} value={props.smtp_username} onChange={props.onChange("smtp_username")} />
              <InputComponent id="smtp-password" type="password" label="SMTP Password" placeholder={props.isEditMode ? "Leave blank to keep current password" : "Enter SMTP password"} required={!props.isEditMode} className={_fieldClassName} value={props.smtp_password} onChange={props.onChange("smtp_password")} />
              {_renderSwitch("Enable SSL", "Use an encrypted SMTP connection", props.enable_ssl, props.onSslChange)}
              {_renderSwitch("Default sender", "Use this sender as default", props.is_default, props.onDefaultChange)}
            </div>
          </div>
          <div className="mt-8 flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
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
        </form>
        <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
      </div>
    </div>
  );
};

