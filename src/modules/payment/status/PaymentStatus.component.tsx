import type { ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { SwitchComponent } from "@/components/Switch";

import type { PaymentStatusFormProps } from "./PaymentStatus.type";

/**
 * Render mobile top back bar.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Mobile header
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 mb-6 flex items-center gap-3 bg-background-page px-0 lg:hidden">
    <button
      type="button"
      onClick={goBack}
      aria-label="Back"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-page text-text-primary transition-colors hover:bg-background-subtle"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <div className="min-w-0">
      <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">Update Payment Status</h2>
      <p className="mt-1 truncate text-sm text-text-secondary">Update payment status below.</p>
    </div>
  </div>
);

/**
 * Render payment status form.
 * @param {PaymentStatusFormProps} props - Form props
 * @returns {ReactElement} Status form
 */
export const PaymentStatusForm = (props: PaymentStatusFormProps): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {_renderMobileBack(props.goBack)}
    <div className="flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:px-0 lg:text-base">
      <nav aria-label="Breadcrumb" className="mb-2 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={props.goBack} className="cursor-pointer hover:text-text-primary">Payment</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">Update Status</span>
      </nav>
      <div className="mb-6 hidden lg:block">
        <h2 className="text-4xl font-semibold tracking-tight text-text-primary">Update Payment Status</h2>
        <p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">Update payment status below.</p>
      </div>
      <form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
        <div className="space-y-4">
          <div><p className="text-sm font-medium text-text-secondary">Reference No</p><p className="mt-1 text-lg font-semibold text-text-primary">{props.referenceNo || "-"}</p></div>
          <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5"><div className="flex flex-col"><span className="text-lg font-semibold text-text-primary lg:text-sm">Status</span><span className="text-base text-text-secondary lg:text-xs">Toggle active or inactive status</span></div><SwitchComponent label="Payment status" checked={props.isActive} disabled={props.isLoading || props.isSubmitting} onChange={props.handleStatusChange} /></div>
        </div>
        <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
          <button
            type="submit"
            disabled={props.isSubmitting || props.isLoading}
            className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto lg:text-sm"
          >
            {props.isSubmitting ? "Updating…" : "Update Status"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
