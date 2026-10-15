import type { ReactElement } from "react";

import type { MasterPaymentMethodCreateState } from "./MasterPaymentMethodCreate.type";

/**
 * Render create payment method form
 * @param {MasterPaymentMethodCreateState} props - form state
 * @returns {ReactElement} form
 */
export const MasterPaymentMethodCreateForm = (props: MasterPaymentMethodCreateState): ReactElement => {
  const { name, description, isEdit, handleNameChange, handleDescriptionChange, handleSubmit, goBack } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-background-surface font-sans pb-10 relative overflow-y-auto">
      <div className="px-6 pt-10 pb-4 flex items-center sticky top-0 z-20 bg-background-surface">
        <button type="button" onClick={goBack} className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors">
          <div className="w-10 h-10 rounded-full bg-background-subtle shadow-sm flex items-center justify-center text-text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <span className="font-bold text-sm">Back</span>
        </button>
      </div>
      <div className="px-6 mt-2">
        <div className="mb-8 pl-1">
          <h2 className="text-2xl font-extrabold tracking-tight">{isEdit ? "Edit Payment Method" : "New Payment Method"}</h2>
          <p className="text-sm text-text-secondary mt-2 font-medium">Fill in the details below.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-5">
            <label className="block text-xs font-bold text-text-secondary mb-2 pl-3 tracking-widest uppercase">Payment Method Name</label>
            <input type="text" required value={name} onChange={handleNameChange} className="w-full bg-background-subtle border border-border-default rounded-3xl py-4 px-5 text-sm font-semibold text-text-primary outline-none focus:ring-2 focus:ring-action-primary transition-all" />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-bold text-text-secondary mb-2 pl-3 tracking-widest uppercase">Description</label>
            <textarea required value={description} onChange={handleDescriptionChange} rows={3} className="w-full bg-background-subtle border border-border-default rounded-3xl py-4 px-5 text-sm font-semibold text-text-primary outline-none focus:ring-2 focus:ring-action-primary transition-all resize-none" />
          </div>
          <button type="submit" className="w-full bg-action-primary text-text-inverse rounded-full py-4 text-base font-bold tracking-wide shadow-medium hover:bg-action-primary-hover transition-all mt-2">{isEdit ? "Update Payment Method" : "Create Payment Method"}</button>
        </form>
      </div>
    </div>
  );
};
