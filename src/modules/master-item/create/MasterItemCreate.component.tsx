import type { ReactElement } from "react";

import type { MasterItemCreateFormState } from "./MasterItemCreate.type";

/**
 * Render status switch field (edit mode only).
 * @param {MasterItemCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (props: MasterItemCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text-primary">Status</span>
        <span className="text-xs text-text-secondary">Toggle active or inactive status</span>
      </div>
      <button type="button" role="switch" aria-checked={props.isActive} onClick={props.handleStatusChange} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/30 ${props.isActive ? "bg-brand-blue" : "bg-brand-gray-light"}`}>
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${props.isActive ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
};

/**
 * Render mobile top back bar.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Bar element
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-page/90 px-6 pt-6 lg:px-0 lg:pt-0">
    <button type="button" onClick={goBack} className="group flex items-center gap-3 text-text-secondary transition-colors hover:text-text-primary lg:hidden">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-surface text-text-primary shadow-sm transition-colors group-hover:bg-background-subtle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
      </div>
      <span className="text-[15px] font-bold">Back</span>
    </button>
  </div>
);

/**
 * Render page header with breadcrumb.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Header element
 */
const _renderHeaderSection = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Item" : "New Item";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master Item</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 pl-1">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
          {isEditMode ? "Update the item details below." : "Fill in the item details below."}
        </p>
      </div>
    </>
  );
};

/**
 * Render create item form.
 * @param {MasterItemCreateFormState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterItemCreateForm = (props: MasterItemCreateFormState): ReactElement => {
  const { name, categoryId, price, stock, image, duration, remark, categories, isCategoryLoading, categoryError, errorMessage, isSubmitting, isEditMode, handleSubmit, handleNameChange, handleCategoryChange, handlePriceChange, handleStockChange, handleImageChange, handleDurationChange, handleRemarkChange, goBack } = props;
  const buttonText = isEditMode ? "Update Item" : "Create Item";
  const submittingText = isEditMode ? "Updating…" : "Creating…";
  const fieldClass = "w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-[15px] font-normal text-text-primary shadow-xs outline-none transition-all placeholder:font-normal placeholder:text-text-tertiary/60 focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30";

  return (
    <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
      {_renderMobileBack(goBack)}
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-6 lg:mt-0 lg:px-0">
        {_renderHeaderSection(isEditMode, goBack)}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between rounded-4xl border border-border-default bg-background-surface p-6 shadow-xs sm:p-8">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Item Name</label>
              <input type="text" aria-label="Item name" placeholder="e.g. Wireless Microphone" required value={name} onChange={handleNameChange} className={fieldClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Category</label>
              <select aria-label="Category" required value={categoryId} disabled={isCategoryLoading} onChange={handleCategoryChange} className={fieldClass}>
                <option value="" disabled>{isCategoryLoading ? "Loading categories..." : "Select category"}</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}
              </select>
            </div>
            {categoryError && <p role="alert" className="text-[13px] font-medium text-red-600">{categoryError}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Price</label>
                <input type="number" aria-label="Price" placeholder="0" min="0" required value={price} onChange={handlePriceChange} className={fieldClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Stock</label>
                <input type="number" aria-label="Stock" placeholder="0" min="0" required value={stock} onChange={handleStockChange} className={fieldClass} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Duration (Days)</label>
              <input type="number" aria-label="Duration" placeholder="1" min="0" required value={duration} onChange={handleDurationChange} className={fieldClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Image URL</label>
              <input type="text" aria-label="Image URL" placeholder="https://..." value={image} onChange={handleImageChange} className={fieldClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Remarks</label>
              <input type="text" aria-label="Remarks" placeholder="Optional notes" value={remark} onChange={handleRemarkChange} className={fieldClass} />
            </div>
            {_renderStatusField(props)}
            {errorMessage && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">{errorMessage}</p>}
          </div>
          <div className="mt-6 flex justify-end border-t border-border-default pt-5">
            <button type="submit" disabled={isSubmitting} className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60">
              {isSubmitting ? submittingText : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
