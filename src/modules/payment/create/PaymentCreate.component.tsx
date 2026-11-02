import type { ChangeEvent, ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { DatePicker } from "@/components/DatePicker";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import type { PaymentCreateFormState } from "../Payment.type";

import { formatRupiahInput, parseRupiahInput } from "./PaymentCreate.helpers";

/**
 * Render mobile top back bar.
 * @param {boolean | undefined} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Mobile header
 */
const _renderMobileBack = (isEditMode: boolean | undefined, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Payment" : "New Payment";
  const subtitle = isEditMode ? "Update the payment details below." : "Fill in the payment details below.";

  return (
    <div className="sticky top-0 z-20 mb-6 flex items-center gap-3 bg-background-surface px-0 lg:hidden">
      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="min-w-0">
        <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">{title}</h2>
        <p className="mt-1 truncate text-sm text-text-secondary">{subtitle}</p>
      </div>
    </div>
  );
};

/**
 * Render page header with breadcrumb.
 * @param {boolean | undefined} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Header section
 */
const _renderHeaderSection = (isEditMode: boolean | undefined, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Payment" : "New Payment";
  const subtitle = isEditMode ? "Update the payment details below." : "Fill in the payment details below.";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-2 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Payment</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="mb-6 hidden lg:block">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">{subtitle}</p>
      </div>
    </>
  );
};

/**
 * Render status switch field (edit mode only).
 * @param {PaymentCreateFormState} props - Form state
 * @returns {ReactElement | null} Status switch element
 */
const _renderStatusField = (props: PaymentCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-text-primary lg:text-sm">Status</span>
        <span className="text-base text-text-secondary lg:text-xs">Toggle active or inactive status</span>
      </div>
      <SwitchComponent id="payment-status" label="Payment status" checked={props.isActive ?? false} onChange={props.handleStatusChange} />
    </div>
  );
};

/**
 * Render submit button section.
 * @param {boolean} isSubmitting - Submitting state
 * @param {boolean | undefined} isEditMode - Edit mode flag
 * @returns {ReactElement} Submit section
 */
const _renderSubmitSection = (isSubmitting: boolean, isEditMode: boolean | undefined): ReactElement => {
  const buttonText = isEditMode ? "Update Payment" : "Create Payment";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto lg:text-sm"
      >
        {isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Render payment create form.
 * @param {PaymentCreateFormState} props - payment properties
 * @returns {ReactElement} payment form
 */
// eslint-disable-next-line max-lines-per-function
export const PaymentCreateComponent = (props: PaymentCreateFormState): ReactElement => {
  const invoiceOptions = props.invoices.map((invoice) => ({ value: invoice.id, label: invoice.invoice_no }));
  const methodOptions = props.paymentMethods.map((method) => ({ value: method.id, label: method.name }));
  const invoiceError = props.isSubmitted && !props.invoiceId ? "Invoice is required." : null;
  const paymentMethodError = props.isSubmitted && !props.paymentMethodId ? "Payment method is required." : null;
  const amountError = props.isSubmitted && (!props.amount || props.amount <= 0) ? "Amount must be greater than Rp 0." : null;
  const paidAtError = props.isSubmitted && !props.paidAt ? "Paid at is required." : null;
  const amountValue = props.amount === null ? "" : formatRupiahInput(String(props.amount));

  /**
   * Update amount from formatted input.
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - input event
   * @returns {void} no return value
   */
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const digits = parseRupiahInput(event.target.value);

    props.setAmount(digits ? Number(digits) : null);
  };

  /**
   * Update paid date.
   * @param {string} value - selected date
   * @returns {void} no return value
   */
  const handlePaidAt = (value: string): void => props.setPaidAt(value);

  /**
   * Update payment notes.
   * @param {ChangeEvent<HTMLTextAreaElement>} event - input event
   * @returns {void} no return value
   */
  const handleNotes = (event: ChangeEvent<HTMLTextAreaElement>): void => props.setNotes(event.target.value);

  return (
    <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {_renderMobileBack(props.isEditMode, props.goBack)}
      <div className="flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:px-0 lg:text-base">
        {_renderHeaderSection(props.isEditMode, props.goBack)}
        {props.isLoadingOptions ? (
          <p className="py-12 text-center text-sm text-text-secondary">Loading payment options…</p>
        ) : (
          <form
            noValidate
            onSubmit={props.handleSubmit}
            className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs"
          >
            <div className="grid w-full grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2">
              <div>
                <Select
                  id="payment-invoice"
                  label="Invoice"
                  placeholder="Select invoice"
                  value={props.invoiceId}
                  options={invoiceOptions}
                  onChange={props.setInvoiceId}
                  required
                  labelClassName="!text-base"
                  className="mb-4 [&_.ant-select-selection-item]:text-xl [&_.ant-select-selection-placeholder]:text-xl"
                  errorMessage={invoiceError}
                />
              </div>
              <div>
                <Select
                  id="payment-method"
                  label="Payment Method"
                  placeholder="Select payment method"
                  value={props.paymentMethodId}
                  options={methodOptions}
                  onChange={props.setPaymentMethodId}
                  required
                  labelClassName="!text-base"
                  className="mb-4 [&_.ant-select-selection-item]:text-xl [&_.ant-select-selection-placeholder]:text-xl"
                  errorMessage={paymentMethodError}
                />
              </div>
              <div>
                <InputComponent
                  id="payment-amount"
                  type="text"
                  label="Amount"
                  placeholder="Rp 0"
                  value={amountValue}
                  onChange={handleAmountChange}
                  required
                  className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
                  errorMessage={amountError}
                />
              </div>
              <div>
                <DatePicker
                  id="payment-paid-at"
                  label="Paid At"
                  value={props.paidAt.slice(0, 10)}
                  onChange={handlePaidAt}
                  required
                  className="mb-4 [&_.ant-picker-input_input]:text-xl [&_.ant-picker-input_input]:placeholder:text-xl [&_label]:text-base"
                  errorMessage={paidAtError}
                  popupClassName="text-[11px] [&_.ant-picker-content]:text-[11px] [&_.ant-picker-cell-inner]:text-[11px]"
                />
              </div>
              <div className="lg:col-span-2">
                <InputComponent
                  id="payment-notes"
                  type="textarea"
                  label="Notes"
                  placeholder="Optional notes"
                  value={props.notes}
                  onChange={handleNotes}
                  className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
                />
              </div>
              {_renderStatusField(props)}
            </div>
            {_renderSubmitSection(props.isSubmitting, props.isEditMode)}
          </form>
        )}
      </div>
    </div>
  );
};
