 
import type { ReactElement } from "react";

import type { MasterServiceTypeDetailState } from "./MasterServiceTypeDetail.type";

import Layout from "@/app/layout";

/**
 * Render service type detail.
 * @param {MasterServiceTypeDetailState} props - Detail state
 * @returns {ReactElement} Detail component
 */
export const MasterServiceTypeDetailComponent = (props: MasterServiceTypeDetailState): ReactElement => {
  const { serviceType, isMoreOpen, isDeleteModalOpen, goBack, toggleMore, goEdit, openDeleteModal, closeDeleteModal, handleDelete } = props;

  if (!serviceType) {
    return <Layout pageTitle="Detail Service Type"><div className="flex justify-center py-20 text-text-secondary">Service type not found</div></Layout>;
  }

  return (
    <Layout pageTitle="Detail Service Type">
      <div className="space-y-4 px-3 lg:px-0">
        <div className="flex items-center justify-between py-2"><button type="button" onClick={goBack} className="h-11 rounded-lg border border-border-default px-4">Back</button><h1 className="text-lg font-semibold">Detail service type</h1><div className="relative"><button type="button" onClick={toggleMore} aria-expanded={isMoreOpen} aria-label="More options" className="h-11 rounded-lg border border-border-default px-4">More</button>{isMoreOpen && <div role="menu" className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-border-default bg-background-surface py-2 shadow-medium"><button type="button" role="menuitem" onClick={goEdit} className="w-full px-4 py-2 text-left">Edit</button><button type="button" role="menuitem" onClick={openDeleteModal} className="w-full px-4 py-2 text-left text-red-600">Delete</button></div>}</div></div>
        <div className="rounded-xl border border-border-default bg-background-surface p-5 text-center"><h2 className="mb-2 text-xl font-semibold">{serviceType.name}</h2><span className="text-sm font-medium">{serviceType.status}</span></div>
        <dl className="divide-y divide-border-default rounded-xl border border-border-default bg-background-surface"><div className="flex justify-between p-5"><dt className="text-text-secondary">Price</dt><dd className="font-medium">{serviceType.price}</dd></div><div className="flex justify-between p-5"><dt className="text-text-secondary">Created by</dt><dd className="font-medium">{serviceType.createBy}</dd></div><div className="flex justify-between p-5"><dt className="text-text-secondary">Created at</dt><dd className="font-medium">{serviceType.createAt}</dd></div></dl>
      </div>
      {isDeleteModalOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"><div className="w-full max-w-sm rounded-xl bg-background-surface p-6"><h3 className="mb-4 text-lg font-semibold">Delete service type?</h3><div className="flex gap-3"><button type="button" onClick={closeDeleteModal} className="flex-1 rounded-lg bg-background-subtle p-3">Cancel</button><button type="button" onClick={handleDelete} className="flex-1 rounded-lg bg-red-600 p-3 text-white">Delete</button></div></div></div>}
    </Layout>
  );
};
