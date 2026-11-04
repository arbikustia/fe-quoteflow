import type { ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { SwitchComponent } from "@/components/Switch";

import type { InvoiceStatusFormProps } from "./InvoiceStatus.type";

/**
 * Render status switch field.
 * @param {InvoiceStatusFormProps} props - Form props
 * @returns {ReactElement} Status switch field
 */
const _renderStatusField = (props: InvoiceStatusFormProps): ReactElement => (
  <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4">
    <div className="flex flex-col">
      <div className="flex items-center gap-2.5">
        <span className="text-lg font-normal text-text-primary">Status</span>
        <span className={`inline-flex rounded-full border border-current px-3 py-0.5 text-base font-semibold uppercase ${props.isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
          {props.isActive ? "active" : "inactive"}
        </span>
      </div>
      <span className="text-base text-text-secondary">Toggle active or inactive status</span>
    </div>
    <SwitchComponent
      label="Invoice status"
      checked={props.isActive}
      disabled={props.isLoading || props.isSubmitting}
      onChange={props.handleStatusChange}
    />
  </div>
);

/**
 * Render form page header.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Header
 */
const _renderHeader = (goBack: () => void): ReactElement => (
  <>
    <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
      <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Invoice</button>
      <span aria-hidden="true">/</span>
      <span className="text-text-primary">Update Status</span>
    </nav>
    <div className="my-6 hidden pl-1 lg:block">
      <h2 className="text-4xl font-semibold tracking-tight text-text-primary">Update Invoice Status</h2>
      <p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">Update invoice status below.</p>
    </div>
  </>
);

/**
 * Render mobile back bar.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Mobile header
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
    <BackButton onClick={goBack} />
    <div className="min-w-0">
      <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">Update Invoice Status</h2>
      <p className="mt-1 truncate text-sm text-text-secondary">Update invoice status below.</p>
    </div>
  </div>
);

/**
 * Render invoice status form.
 * @param {InvoiceStatusFormProps} props - Form props
 * @returns {ReactElement} Status form
 */
export const InvoiceStatusForm = (props: InvoiceStatusFormProps): ReactElement => {
  const submitText = props.isSubmitting ? "Updating…" : "Update Status";

  return (
    <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {_renderMobileBack(props.goBack)}
      <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
        {_renderHeader(props.goBack)}
        {props.isLoading ? <p className="py-12 text-center text-lg text-text-secondary">Loading invoice data…</p> : (
          <form noValidate onSubmit={props.handleSubmit} className="mb-6 flex min-h-0 flex-1 flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:p-10">
            <div className="space-y-5 pb-6">
              <div>
                <p className="text-lg font-normal text-text-secondary">Invoice Number</p>
                <p className="mt-1 text-xl font-semibold text-text-primary">{props.invoiceNumber}</p>
              </div>
              {_renderStatusField(props)}
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-default/60 pt-5 lg:border-border-default">
              <button type="button" onClick={props.goBack} disabled={props.isSubmitting} className="h-14 cursor-pointer rounded-xl border border-border-default bg-background-surface px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={props.isSubmitting || props.isLoading} className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60">{submitText}</button>
            </div>
          </form>
        )}
        <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
      </div>
    </div>
  );
};
