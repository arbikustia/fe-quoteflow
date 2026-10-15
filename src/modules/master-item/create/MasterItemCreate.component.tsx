import type { ReactElement } from "react";

import type { MasterItemCreateFormState } from "./MasterItemCreate.type";

/**
 * Render create item form.
 * @param {MasterItemCreateFormState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterItemCreateForm = (props: MasterItemCreateFormState): ReactElement => {
  const { name, categoryId, price, stock, image, duration, remark, categories, isCategoryLoading, categoryError, errorMessage, isSubmitting, handleSubmit, handleNameChange, handleCategoryChange, handlePriceChange, handleStockChange, handleImageChange, handleDurationChange, handleRemarkChange, goBack } = props;

  return (
    <div className="bg-background-page px-4 py-6 text-text-primary lg:max-w-3xl lg:px-0">
      <button type="button" onClick={goBack} className="mb-6 text-sm font-medium text-text-secondary hover:text-text-primary">Back</button>
      <h1 className="text-2xl font-semibold">New item</h1>
      <p className="mb-6 mt-1 text-sm text-text-secondary">Fill in item details below.</p>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border-default bg-background-surface p-6">
        <label className="block text-sm font-medium">Item name<input aria-label="Item name" required value={name} onChange={handleNameChange} className="mt-2 h-10 w-full rounded-lg border border-border-strong bg-background-surface px-3" /></label>
        <label className="block text-sm font-medium">Category<select aria-label="Category" required value={categoryId} disabled={isCategoryLoading} onChange={handleCategoryChange} className="mt-2 h-10 w-full rounded-lg border border-border-strong bg-background-surface px-3"><option value="" disabled>{isCategoryLoading ? "Loading categories..." : "Select category"}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}</select></label>
        {categoryError && <p role="alert" className="text-sm text-red-600">{categoryError}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">Price<input aria-label="Price" type="number" min="0" required value={price} onChange={handlePriceChange} className="mt-2 h-10 w-full rounded-lg border border-border-strong bg-background-surface px-3" /></label>
          <label className="block text-sm font-medium">Stock<input aria-label="Stock" type="number" min="0" required value={stock} onChange={handleStockChange} className="mt-2 h-10 w-full rounded-lg border border-border-strong bg-background-surface px-3" /></label>
        </div>
        <label className="block text-sm font-medium">Duration (days)<input aria-label="Duration" type="number" min="0" required value={duration} onChange={handleDurationChange} className="mt-2 h-10 w-full rounded-lg border border-border-strong bg-background-surface px-3" /></label>
        <label className="block text-sm font-medium">Image URL<input aria-label="Image URL" value={image} onChange={handleImageChange} className="mt-2 h-10 w-full rounded-lg border border-border-strong bg-background-surface px-3" /></label>
        <label className="block text-sm font-medium">Remarks<input aria-label="Remarks" value={remark} onChange={handleRemarkChange} className="mt-2 h-10 w-full rounded-lg border border-border-strong bg-background-surface px-3" /></label>
        {errorMessage && <p role="alert" className="text-sm text-red-600">{errorMessage}</p>}
        <button type="submit" disabled={isSubmitting} className="h-10 w-full rounded-lg bg-action-primary text-sm font-medium text-text-inverse hover:bg-action-primary-hover disabled:opacity-60">{isSubmitting ? "Creating..." : "Create item"}</button>
      </form>
    </div>
  );
};
