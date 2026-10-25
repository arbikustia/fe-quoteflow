import type { ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import type { PaymentCreateFormState } from "../Payment.type";

/** Render payment create form. */
export const PaymentCreateComponent = (props: PaymentCreateFormState): ReactElement => {
  const invoiceOptions = props.invoices.map((invoice) => ({ value: invoice.id, label: invoice.invoice_no }));
  const methodOptions = props.paymentMethods.map((method) => ({ value: method.id, label: method.name }));
  const handlePaidAt = (event: React.ChangeEvent<HTMLInputElement>): void => props.setPaidAt(event.target.value);
  const handleReferenceNo = (event: React.ChangeEvent<HTMLInputElement>): void => props.setReferenceNo(event.target.value);
  const handleNotes = (event: React.ChangeEvent<HTMLTextAreaElement>): void => props.setNotes(event.target.value);
  const submitLabel = props.isEditMode ? "Update Payment" : "Create Payment";
  const submittingLabel = props.isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-0 lg:mt-0 lg:px-0">
        <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex"><button type="button" onClick={props.goBack} className="cursor-pointer hover:text-text-primary">Payment</button><span aria-hidden="true">/</span><span className="text-text-primary">{props.isEditMode ? "Edit Payment" : "New Payment"}</span></nav>
        <div className="my-6 pl-1"><h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{props.isEditMode ? "Edit Payment" : "New Payment"}</h2><p className="mt-3 text-sm font-medium text-text-secondary opacity-70">{props.isEditMode ? "Update payment details below." : "Fill in payment details below."}</p></div>
        {props.isLoadingOptions ? <p className="py-12 text-center text-sm text-text-secondary">Loading payment options…</p> : (
          <form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
            <div className="grid w-full grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2">
              <Select id="payment-invoice" label="Invoice" placeholder="Select invoice" value={props.invoiceId} options={invoiceOptions} onChange={props.setInvoiceId} required />
              <Select id="payment-method" label="Payment Method" placeholder="Select payment method" value={props.paymentMethodId} options={methodOptions} onChange={props.setPaymentMethodId} required />
              <InputComponent id="payment-amount" type="number" label="Amount" placeholder="0" value={props.amount} min={0} onChange={props.setAmount} required />
              <InputComponent id="payment-paid-at" type="text" label="Paid At" placeholder="YYYY-MM-DDTHH:mm" value={props.paidAt} onChange={handlePaidAt} required />
              <InputComponent id="payment-reference" type="text" label="Reference No" placeholder="Payment reference" value={props.referenceNo} onChange={handleReferenceNo} required />
              <InputComponent id="payment-notes" type="textarea" label="Notes" placeholder="Optional notes" value={props.notes} onChange={handleNotes} />
              {props.isEditMode && <div className="flex items-center gap-3 pt-4"><SwitchComponent id="payment-status" label="Payment status" checked={props.isActive ?? false} onChange={props.handleStatusChange} /><span className="text-sm font-medium text-text-primary">{props.isActive ? "Active" : "Inactive"}</span></div>}
            </div>
            <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6"><button type="submit" disabled={props.isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto">{props.isSubmitting ? submittingLabel : submitLabel}</button></div>
          </form>
        )}
      </div>
    </div>
  );
};
