import type { ReactElement } from "react";

import type { MasterServiceTypeCreateFormState } from "./MasterServiceTypeCreate.type";

/**
 * Render service type create/edit form.
 * @param {MasterServiceTypeCreateFormState} props - Form state
 * @returns {ReactElement} Service type form
 */
export const MasterServiceTypeCreateComponent = (props: MasterServiceTypeCreateFormState): ReactElement => {
  const { serviceName, price, isActive, isSubmitting, isEdit, errorMessage, handleServiceNameChange, handlePriceChange, handleIsActiveChange, handleSubmit, goBack } = props;

  return (
    <div className="min-h-full w-full overflow-y-auto bg-background-page pb-10">
      <div className="sticky top-0 z-20 flex items-center bg-background-page px-6 pb-4 pt-10"><button type="button" onClick={goBack} className="flex items-center gap-3 text-text-secondary hover:text-text-primary"><span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-background-surface">←</span><span className="font-medium">Back</span></button></div>
      <div className="px-6"><h1 className="mb-2 text-2xl font-semibold text-text-primary">{isEdit ? "Edit service type" : "New service type"}</h1><p className="mb-8 text-sm text-text-secondary">Fill in service type details.</p>
        <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
          <div><label htmlFor="service-name" className="mb-2 block text-sm font-medium text-text-secondary">Service name</label><input id="service-name" value={serviceName} onChange={handleServiceNameChange} required className="h-11 w-full rounded-lg border border-border-strong bg-background-surface px-4 text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-focus-ring/30" /></div>
          <div><label htmlFor="service-price" className="mb-2 block text-sm font-medium text-text-secondary">Price</label><input id="service-price" type="number" min="0" value={price} onChange={handlePriceChange} required className="h-11 w-full rounded-lg border border-border-strong bg-background-surface px-4 text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-focus-ring/30" /></div>
          <label className="flex h-11 items-center gap-3 rounded-lg border border-border-default bg-background-surface px-4 text-sm font-medium text-text-primary"><input type="checkbox" checked={isActive} onChange={handleIsActiveChange} />Active</label>
          {errorMessage !== null && <p role="alert" className="text-sm text-red-600">{errorMessage}</p>}
          {/* eslint-disable-next-line sonarjs/no-nested-conditional */}
          <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="h-11 rounded-lg bg-action-primary px-5 font-medium text-text-inverse hover:bg-action-primary-hover disabled:opacity-60">{isSubmitting ? "Saving…" : isEdit ? "Update service type" : "Create service type"}</button>
        </form>
      </div>
    </div>
  );
};
