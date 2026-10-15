import type { ReactElement } from "react";

import type { MasterPaymentTypeCreateState } from "./MasterPaymentTypeCreate.type";

/**
 * Render payment type form.
 * @param {MasterPaymentTypeCreateState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterPaymentTypeCreateForm = (props: MasterPaymentTypeCreateState): ReactElement => {
  const { name, isEdit, handleNameChange, handleSubmit, goBack } = props;

  return (
    <div className="w-full min-h-full bg-background-surface px-6 pb-10 pt-10">
      <button type="button" onClick={goBack} className="mb-8 flex items-center gap-3 text-text-secondary hover:text-text-primary">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background-subtle">←</span>
        <span className="font-bold text-sm">Back</span>
      </button>
      <h2 className="text-2xl font-extrabold tracking-tight">{isEdit ? "Edit Payment Type" : "New Payment Type"}</h2>
      <p className="mb-8 mt-2 text-sm font-medium text-text-secondary">Fill in payment type details below.</p>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-2 pl-3 text-xs font-bold uppercase tracking-widest text-text-secondary" htmlFor="payment-type-name">Payment Type Name</label>
        <input id="payment-type-name" type="text" required value={name} onChange={handleNameChange} className="mb-5 w-full rounded-3xl border border-border-default bg-background-subtle px-5 py-4 text-sm font-semibold text-text-primary outline-none focus:ring-2 focus:ring-action-primary" />
        <button type="submit" className="mt-2 w-full rounded-full bg-action-primary py-4 text-base font-bold tracking-wide text-text-inverse shadow-medium hover:bg-action-primary-hover">{isEdit ? "Update Payment Type" : "Create Payment Type"}</button>
      </form>
    </div>
  );
};
