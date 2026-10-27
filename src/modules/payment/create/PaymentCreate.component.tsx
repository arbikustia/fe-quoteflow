import type { ChangeEvent, ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { DatePicker } from "@/components/DatePicker";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import type { PaymentCreateFormState } from "../Payment.type";

import { formatRupiahInput, parseRupiahInput } from "./PaymentCreate.helpers";

/**
 * Render payment create form.
 * @param {PaymentCreateFormState} props - payment properties
 * @returns {ReactElement} payment form
 */
// eslint-disable-next-line max-lines-per-function, sonarjs/cognitive-complexity
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
   * Update reference number.
   * @param {ChangeEvent<HTMLInputElement>} event - input event
   * @returns {void} no return value
   */
  const handleReferenceNo = (event: ChangeEvent<HTMLInputElement>): void => props.setReferenceNo(event.target.value);

  /**
   * Update payment notes.
   * @param {ChangeEvent<HTMLTextAreaElement>} event - input event
   * @returns {void} no return value
   */
  const handleNotes = (event: ChangeEvent<HTMLTextAreaElement>): void => props.setNotes(event.target.value);
  const submitLabel = props.isEditMode ? "Update Payment" : "Create Payment";
  const submittingLabel = props.isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 lg:mt-0 lg:px-0">
        <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex"><button type="button" onClick={props.goBack} className="cursor-pointer hover:text-text-primary">Payment</button><span aria-hidden="true">/</span><span className="text-text-primary">{props.isEditMode ? "Edit Payment" : "New Payment"}</span></nav>
        <div className="my-6 hidden pl-1 lg:block"><h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{props.isEditMode ? "Edit Payment" : "New Payment"}</h2><p className="mt-3 text-sm font-medium text-text-secondary opacity-70">{props.isEditMode ? "Update the payment details below." : "Fill in the payment details below."}</p></div>
        {props.isLoadingOptions ? <p className="py-12 text-center text-sm text-text-secondary">Loading payment options…</p> : (
          <form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
            <div className="grid w-full grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2">
              <Select id="payment-invoice" label="Invoice" placeholder="Select invoice" value={props.invoiceId} options={invoiceOptions} onChange={props.setInvoiceId} required errorMessage={invoiceError} />
              <Select id="payment-method" label="Payment Method" placeholder="Select payment method" value={props.paymentMethodId} options={methodOptions} onChange={props.setPaymentMethodId} required errorMessage={paymentMethodError} />
              <InputComponent id="payment-amount" type="text" label="Amount" placeholder="Rp 0" value={amountValue} onChange={handleAmountChange} required errorMessage={amountError} className="w-full" />
              <DatePicker id="payment-paid-at" label="Paid At" value={props.paidAt.slice(0, 10)} onChange={handlePaidAt} required errorMessage={paidAtError} popupClassName="text-[11px] [&_.ant-picker-content]:text-[11px] [&_.ant-picker-cell-inner]:text-[11px]" />
              <InputComponent id="payment-reference" type="text" label="Reference No" placeholder="Payment reference" value={props.referenceNo} onChange={handleReferenceNo} />
              <InputComponent id="payment-notes" type="textarea" label="Notes" placeholder="Optional notes" value={props.notes} onChange={handleNotes} />
              {props.isEditMode && (
                <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-text-primary lg:text-sm">Status</span>
                    <span className="text-base text-text-secondary lg:text-xs">Toggle active or inactive status</span>
                  </div>
                  <SwitchComponent id="payment-status" label="Payment status" checked={props.isActive ?? false} onChange={props.handleStatusChange} />
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6"><button type="submit" disabled={props.isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto">{props.isSubmitting ? submittingLabel : submitLabel}</button></div>
          </form>
        )}
      </div>
    </div>
  );
};
