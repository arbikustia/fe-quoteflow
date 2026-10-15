/* eslint-disable jsdoc/require-returns, jsdoc/require-param-type, jsdoc/require-param-description */
import type { ReactElement } from "react";

import type { MasterVoucherDetailState } from "./MasterVoucherDetail.type";

import Layout from "@/app/layout";

/**
 * Render voucher detail.
 * @param props
 */
export const MasterVoucherDetailComponent = (props: MasterVoucherDetailState): ReactElement => {
  const { voucher, isMoreOpen, isDeleteModalOpen, goBack, toggleMore, goEdit, openDeleteModal, closeDeleteModal, handleDelete } = props;

  if (!voucher) {
    return <Layout pageTitle="Detail Voucher"><div className="flex justify-center py-20 text-text-secondary">Voucher not found</div></Layout>;
  }

  return (
    <Layout pageTitle="Detail Voucher">
      <div className="space-y-4 px-3 lg:px-0">
        <div className="flex items-center justify-between py-2"><button type="button" onClick={goBack} aria-label="Back" className="h-11 rounded-lg border border-border-default px-4">Back</button><h1 className="text-lg font-semibold">Detail Voucher</h1><div className="relative"><button type="button" onClick={toggleMore} aria-label="More options" aria-expanded={isMoreOpen} className="h-11 rounded-lg border border-border-default px-4">More</button>{isMoreOpen && <div role="menu" className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-border-default bg-background-surface py-2 shadow-medium"><button type="button" role="menuitem" onClick={goEdit} className="w-full px-4 py-2 text-left">Edit</button><button type="button" role="menuitem" onClick={openDeleteModal} className="w-full px-4 py-2 text-left text-red-600">Delete</button></div>}</div></div>
        <section className="rounded-xl border border-border-default bg-background-surface p-5 text-center"><h2 className="text-xl font-semibold">{voucher.code}</h2><div className="mt-2"><span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">{voucher.status}</span></div></section>
        <dl className="divide-y divide-border-default rounded-xl border border-border-default bg-background-surface"><div className="flex justify-between p-5"><dt className="text-text-secondary">Voucher Name</dt><dd className="font-medium">{voucher.name}</dd></div><div className="flex justify-between p-5"><dt className="text-text-secondary">Discount (%)</dt><dd className="font-medium">{voucher.discountPercent}</dd></div><div className="flex justify-between p-5"><dt className="text-text-secondary">Created at</dt><dd className="font-medium">{voucher.createAt}</dd></div></dl>
      </div>
      {isDeleteModalOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"><div className="w-full max-w-sm rounded-xl bg-background-surface p-6"><h3 className="mb-4 text-lg font-semibold">Delete Voucher?</h3><p className="mb-6 text-text-secondary">Delete {voucher.code}?</p><div className="flex gap-3"><button type="button" onClick={closeDeleteModal} className="flex-1 rounded-lg bg-background-subtle p-3">Cancel</button><button type="button" onClick={handleDelete} className="flex-1 rounded-lg bg-red-600 p-3 text-white">Delete</button></div></div></div>}
    </Layout>
  );
};
