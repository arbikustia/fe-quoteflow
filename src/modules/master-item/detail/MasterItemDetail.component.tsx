/* eslint-disable jsdoc/require-param-type, jsdoc/require-param-description, jsdoc/require-returns */
import type { ReactElement } from "react";

import type { ItemData } from "../MasterItem.type";

import type { MasterItemDetailState } from "./MasterItemDetail.type";

import Layout from "@/app/layout";

/**
 * Format item price. @param {number} price - Price @returns {string} Currency
 * @param price
 */
const _formatPrice = (price: number): string => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

/**
 * Render item details. @param {ItemData} item - Item @returns {ReactElement} Details
 * @param item
 */
const _renderDetails = (item: ItemData): ReactElement => (
  <div className="space-y-4">
    <div className="rounded-xl border border-border-default bg-background-surface p-5 text-center shadow-small"><h2 className="text-xl font-semibold">{item.name}</h2><p className="mt-1 text-sm text-text-secondary">{item.categoryName || "No category"}</p></div>
    <dl className="divide-y divide-border-default overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
      <div className="flex justify-between px-5 py-4"><dt className="text-text-secondary">Item ID</dt><dd className="font-medium">{item.id}</dd></div>
      <div className="flex justify-between px-5 py-4"><dt className="text-text-secondary">Price</dt><dd className="font-medium">{_formatPrice(item.price)}</dd></div>
      <div className="flex justify-between px-5 py-4"><dt className="text-text-secondary">Stock</dt><dd className="font-medium">{item.stock}</dd></div>
      <div className="flex justify-between px-5 py-4"><dt className="text-text-secondary">Duration</dt><dd className="font-medium">{item.duration} days</dd></div>
      <div className="flex justify-between px-5 py-4"><dt className="text-text-secondary">Status</dt><dd className="font-medium">{item.status}</dd></div>
    </dl>
  </div>
);

/**
 * Render item detail UI. @param {MasterItemDetailState} props - State @returns {ReactElement} Page
 * @param props
 */
export const MasterItemDetailComponent = (props: MasterItemDetailState): ReactElement => {
  const { item, isMoreOpen, isDeleteModalOpen, goBack, toggleMore, closeMore, goEdit, openDeleteModal, closeDeleteModal, handleDelete } = props;

  if (!item) {
    return <Layout pageTitle="Detail Item"><div className="flex h-full items-center justify-center py-20"><p className="font-medium text-text-secondary">Item not found</p></div></Layout>;
  }

  return (
    <Layout pageTitle="Detail Item">
      <div className="relative space-y-4 px-3 lg:px-0">
        <div className="flex items-center justify-between py-2">
          <button type="button" onClick={goBack} aria-label="Back" className="h-11 rounded-lg border border-border-default px-4">Back</button>
          <h1 className="text-lg font-semibold">Detail Item</h1>
          <div className="relative"><button type="button" onClick={toggleMore} aria-label="More options" aria-expanded={isMoreOpen} className="h-11 rounded-lg border border-border-default px-4">More</button>{isMoreOpen && <div role="menu" className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-border-default bg-background-surface py-2 shadow-medium"><button type="button" role="menuitem" onClick={goEdit} className="w-full px-4 py-2 text-left">Edit</button><button type="button" role="menuitem" onClick={openDeleteModal} className="w-full px-4 py-2 text-left text-red-600">Delete</button><button type="button" onClick={closeMore} className="sr-only">Close menu</button></div>}</div>
        </div>
        {_renderDetails(item)}
      </div>
      {isDeleteModalOpen && <div role="dialog" aria-modal="true" aria-labelledby="delete-item-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"><div className="w-full max-w-sm rounded-xl bg-background-surface p-6"><h2 id="delete-item-title" className="text-xl font-semibold">Delete item?</h2><p className="my-4 text-text-secondary">Delete {item.name}? This action cannot be undone.</p><div className="flex gap-3"><button type="button" onClick={closeDeleteModal} className="flex-1 rounded-lg bg-background-subtle p-3">Cancel</button><button type="button" onClick={handleDelete} className="flex-1 rounded-lg bg-red-600 p-3 text-white">Delete</button></div></div></div>}
    </Layout>
  );
};
