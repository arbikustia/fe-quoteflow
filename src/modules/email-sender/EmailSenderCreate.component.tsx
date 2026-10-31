import type { ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { EmailSenderCreateProps } from "./EmailSenderCreate.type";

const _fieldClassName = "[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base";

const _renderMobileBack = (title: string, onBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center gap-3 bg-background-surface px-0 lg:hidden">
    <button type="button" onClick={onBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    </button>
    <h2 className="min-w-0 truncate text-4xl font-semibold leading-tight text-text-primary">{title}</h2>
  </div>
);

const _renderHeader = (title: string, onBack: () => void): ReactElement => (
  <>
    <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
      <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">Email Sender</button>
      <span aria-hidden="true">/</span><span className="text-text-primary">{title}</span>
    </nav>
    <div className="my-6 hidden pl-1 lg:block"><h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2><p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">Configure SMTP sender details below.</p></div>
  </>
);

const _renderSwitch = (label: string, description: string, checked: boolean, onChange: (checked: boolean) => void): ReactElement => (
  <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
    <div><span className="block text-lg font-semibold text-text-primary lg:text-sm">{label}</span><span className="text-base text-text-secondary lg:text-xs">{description}</span></div>
    <SwitchComponent label={label} checked={checked} onChange={onChange} />
  </div>
);

export const EmailSenderCreateComponent = (props: EmailSenderCreateProps): ReactElement => {
  const title = props.isEditMode ? "Edit Email Sender" : "New Email Sender";
  const submitText = props.isEditMode ? "Update Email Sender" : "Create Email Sender";

  return (
    <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {_renderMobileBack(title, props.onBack)}
      <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:text-base">
        {_renderHeader(title, props.onBack)}
        <form noValidate onSubmit={props.onSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-brand-gray-light lg:bg-brand-white lg:p-8 lg:shadow-xs">
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2">
            <InputComponent id="name" label="Name" placeholder="e.g. Finance Sender" required className={_fieldClassName} value={props.name} onChange={props.onChange("name")} />
            <InputComponent id="email" type="email" label="Email" placeholder="e.g. finance@company.com" required className={_fieldClassName} value={props.email} onChange={props.onChange("email")} />
            <InputComponent id="smtp-host" label="SMTP Host" placeholder="e.g. smtp.gmail.com" required className={_fieldClassName} value={props.smtp_host} onChange={props.onChange("smtp_host")} />
            <InputComponent id="smtp-port" type="number" label="SMTP Port" required className={_fieldClassName} value={props.smtp_port} onChange={props.onPortChange} />
            <InputComponent id="smtp-username" label="SMTP Username" required className={_fieldClassName} value={props.smtp_username} onChange={props.onChange("smtp_username")} />
            <InputComponent id="smtp-password" type="password" label="SMTP Password" placeholder={props.isEditMode ? "Leave blank to keep current password" : "Enter SMTP password"} required={!props.isEditMode} className={_fieldClassName} value={props.smtp_password} onChange={props.onChange("smtp_password")} />
            {_renderSwitch("Enable SSL", "Use an encrypted SMTP connection", props.enable_ssl, props.onSslChange)}
            {_renderSwitch("Default sender", "Use this sender as default", props.is_default, props.onDefaultChange)}
          </div>
          <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
            <button type="submit" disabled={props.isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto lg:text-sm">{props.isSubmitting ? "Saving…" : submitText}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
