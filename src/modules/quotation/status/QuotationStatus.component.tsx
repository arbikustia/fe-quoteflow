import type { ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { SwitchComponent } from "@/components/Switch";

import type { QuotationStatusFormProps } from "./QuotationStatus.type";

/**
 * Render status switch field.
 * @param {QuotationStatusFormProps} props - Form props
 * @returns {ReactElement} Status switch field
 */
const _renderStatusField = (props: QuotationStatusFormProps): ReactElement => (
  <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
    <div className="flex flex-col">
      <span className="text-lg font-semibold text-text-primary lg:text-sm">Status</span>
      <span className="text-base text-text-secondary lg:text-xs">Toggle active or inactive status</span>
    </div>
    <SwitchComponent
      label="Quotation status"
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
      <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Quotation</button>
      <span aria-hidden="true">/</span>
      <span className="text-text-primary">Update Status</span>
    </nav>
    <div className="my-6 hidden pl-1 lg:block">
      <h2 className="text-4xl font-semibold tracking-tight text-text-primary">Update Quotation Status</h2>
      <p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">Update quotation status below.</p>
    </div>
  </>
);

/**
 * Render mobile back bar.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Mobile header
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center gap-3 bg-background-surface lg:hidden">
    <button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    </button>
    <h2 className="truncate text-4xl font-semibold leading-tight text-text-primary">Update Status</h2>
  </div>
);

/**
 * Render quotation status form.
 * @param {QuotationStatusFormProps} props - Form props
 * @returns {ReactElement} Status form
 */
export const QuotationStatusForm = (props: QuotationStatusFormProps): ReactElement => {
  const submitText = props.isSubmitting ? "Updating…" : "Update Status";

  return (
    <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {_renderMobileBack(props.goBack)}
      <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:text-base">
        {_renderHeader(props.goBack)}
        {props.isLoading ? <p className="py-12 text-center text-sm text-text-secondary">Loading quotation data…</p> : (
          <form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-brand-gray-light lg:bg-brand-white lg:p-8 lg:shadow-xs">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-text-secondary">Quotation Number</p>
                <p className="mt-1 text-lg font-semibold text-text-primary">{props.quotationNumber}</p>
              </div>
              {_renderStatusField(props)}
            </div>
            <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
              <button type="submit" disabled={props.isSubmitting || props.isLoading} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto lg:text-sm">{submitText}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
