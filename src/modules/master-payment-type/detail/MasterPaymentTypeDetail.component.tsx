/* eslint-disable jsdoc/require-jsdoc */
import type { ReactElement } from "react";

import type { PaymentTypeData } from "../MasterPaymentType.type";

import type { MasterPaymentTypeDetailState } from "./MasterPaymentTypeDetail.type";

import Layout from "@/app/layout";

const _renderDetails = (item: PaymentTypeData): ReactElement => (
  <div className="space-y-4">
    <div className="rounded-xl border border-border-default bg-background-surface p-5 text-center shadow-small">
      <h2 className="mb-2 text-xl font-semibold text-text-primary">{item.name}</h2>
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
        {item.status}
      </span>
    </div>
    <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
      <div className="px-5 pb-3 pt-5"><h3 className="text-sm font-semibold text-text-primary">Payment Type details</h3></div>
      <dl className="divide-y divide-border-default">
        <div className="flex justify-between px-5 py-4"><dt className="text-sm text-text-secondary">Name</dt><dd className="text-sm font-medium text-text-primary">{item.name}</dd></div>
        <div className="flex justify-between px-5 py-4"><dt className="text-sm text-text-secondary">ID</dt><dd className="text-sm font-medium text-text-primary">{item.id}</dd></div>
      </dl>
    </div>
  </div>
);

export const MasterPaymentTypeDetailComponent = (props: MasterPaymentTypeDetailState): ReactElement => {
  const { paymentType, isMoreOpen, isDeleteModalOpen, goBack, toggleMore, goEdit, openDeleteModal, closeDeleteModal, handleDelete } = props;

  if (!paymentType) {
    return <Layout pageTitle="Detail Payment Type"><div className="flex h-full items-center justify-center py-20"><p className="text-text-secondary">Payment Type not found</p></div></Layout>;
  }

  return (
    <Layout pageTitle="Detail Payment Type">
      <div className="relative space-y-4 px-3 lg:px-0">
        <div className="flex items-center justify-between py-2">
          <button type="button" onClick={goBack} className="h-11 rounded-lg border border-border-default px-4 text-sm font-medium">Back</button>
          <h1 className="text-lg font-semibold">Detail Payment Type</h1>
          <div className="relative"><button type="button" onClick={toggleMore} className="h-11 rounded-lg border border-border-default px-4 text-sm font-medium">More</button>{isMoreOpen && <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-border-default bg-background-surface py-2 shadow-medium"><button onClick={goEdit} className="w-full px-4 py-2 text-left text-sm">Edit</button><button onClick={openDeleteModal} className="w-full px-4 py-2 text-left text-sm text-red-600">Delete</button></div>}</div>
        </div>
        {_renderDetails(paymentType)}
      </div>
      {isDeleteModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"><div className="w-full max-w-sm rounded-xl bg-background-surface p-6"><h3 className="mb-4 text-lg font-semibold">Delete payment type?</h3><div className="flex gap-3"><button onClick={closeDeleteModal} className="flex-1 rounded-lg bg-background-subtle p-3">Cancel</button><button onClick={handleDelete} className="flex-1 rounded-lg bg-red-600 p-3 text-white">Delete</button></div></div></div>}
    </Layout>
  );
};
