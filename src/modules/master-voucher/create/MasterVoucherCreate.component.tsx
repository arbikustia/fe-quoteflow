/* eslint-disable jsdoc/require-returns, jsdoc/require-param-type, jsdoc/require-param-description */
import type { ReactElement } from "react";

import type { MasterVoucherCreateFormState } from "./MasterVoucherCreate.type";

/**
 * Render voucher create form.
 * @param props
 */
export const MasterVoucherCreateComponent = (props: MasterVoucherCreateFormState): ReactElement => {
  const { name, code, discountPercent, status, isSubmitting, errorMessage, handleNameChange, handleCodeChange, handleDiscountChange, handleStatusChange, handleSubmit, goBack } = props;
  const inputClass = "h-11 w-full rounded-lg border border-border-strong bg-background-surface px-4 text-text-primary";

  return <div className="min-h-full w-full overflow-y-auto bg-background-page px-6 pb-10 pt-10"><button type="button" onClick={goBack} className="mb-8 text-text-secondary">← Back</button><h1 className="mb-2 text-2xl font-semibold text-text-primary">New Voucher</h1><p className="mb-8 text-sm text-text-secondary">Fill in voucher details.</p><form onSubmit={handleSubmit} className="max-w-xl space-y-5"><div><label htmlFor="voucher-name" className="mb-2 block text-sm font-medium text-text-secondary">Voucher name</label><input id="voucher-name" value={name} onChange={handleNameChange} required className={inputClass} /></div><div><label htmlFor="voucher-code" className="mb-2 block text-sm font-medium text-text-secondary">Voucher code</label><input id="voucher-code" value={code} onChange={handleCodeChange} required className={inputClass} /></div><div><label htmlFor="discount-percent" className="mb-2 block text-sm font-medium text-text-secondary">Discount (%)</label><input id="discount-percent" type="number" min="0" value={discountPercent} onChange={handleDiscountChange} required className={inputClass} /></div><div><label htmlFor="voucher-status" className="mb-2 block text-sm font-medium text-text-secondary">Status</label><select id="voucher-status" value={status} onChange={handleStatusChange} className={inputClass}><option value="1">Active</option><option value="0">Inactive</option></select></div>{errorMessage !== null && <p role="alert" className="text-sm text-red-600">{errorMessage}</p>}<button type="submit" disabled={isSubmitting} className="h-11 rounded-lg bg-action-primary px-5 font-medium text-text-inverse disabled:opacity-60">{isSubmitting ? "Creating…" : "Create Voucher"}</button></form></div>;
};
