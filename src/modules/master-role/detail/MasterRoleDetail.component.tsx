/* eslint-disable jsdoc/require-jsdoc */
import type { ReactElement } from "react";

import type { RoleData } from "../MasterRole.type";

import type { MasterRoleDetailState } from "./MasterRoleDetail.type";

import Layout from "@/app/layout";

const _renderDetails = (role: RoleData): ReactElement => (
  <div className="space-y-4">
    <div className="rounded-xl border border-border-default bg-background-surface p-5 text-center shadow-small">
      <h2 className="mb-2 text-xl font-semibold text-text-primary">{role.roleName}</h2>
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${role.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{role.status}</span>
    </div>
    <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
      <div className="px-5 pb-3 pt-5"><h3 className="text-sm font-semibold text-text-primary">Role details</h3></div>
      <dl className="divide-y divide-border-default">
        <div className="flex justify-between px-5 py-4"><dt className="text-sm text-text-secondary">Role Name</dt><dd className="text-sm font-medium text-text-primary">{role.roleName}</dd></div>
        <div className="flex justify-between px-5 py-4"><dt className="text-sm text-text-secondary">Role ID</dt><dd className="text-sm font-medium text-text-primary">{role.id}</dd></div>
      </dl>
    </div>
    <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
      <div className="px-5 pb-3 pt-5"><h3 className="text-sm font-semibold text-text-primary">Record info</h3></div>
      <dl className="grid grid-cols-1 divide-y divide-border-default sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="px-5 py-4"><dt className="mb-1 text-sm text-text-secondary">Created by</dt><dd className="truncate text-sm font-medium text-text-primary">{role.createBy}</dd></div>
        <div className="px-5 py-4"><dt className="mb-1 text-sm text-text-secondary">Created at</dt><dd className="truncate text-sm font-medium text-text-primary">{role.createAt}</dd></div>
      </dl>
    </div>
  </div>
);

export const MasterRoleDetailComponent = (props: MasterRoleDetailState): ReactElement => {
  const { role, isMoreOpen, isDeleteModalOpen, goBack, toggleMore, goEdit, openDeleteModal, closeDeleteModal, handleDelete } = props;

  if (!role) {
    return <Layout pageTitle="Detail Role"><div className="flex h-full items-center justify-center py-20"><p className="text-text-secondary">Role not found</p></div></Layout>;
  }

  return (
    <Layout pageTitle="Detail Role">
      <div className="relative space-y-4 px-3 lg:px-0">
        <div className="flex items-center justify-between py-2">
          <button type="button" onClick={goBack} className="h-11 rounded-lg border border-border-default px-4 text-sm font-medium">Back</button>
          <h1 className="text-lg font-semibold">Detail Role</h1>
          <div className="relative"><button type="button" onClick={toggleMore} aria-label="More options" aria-expanded={isMoreOpen} className="h-11 rounded-lg border border-border-default px-4 text-sm font-medium">More</button>{isMoreOpen && <div role="menu" className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-border-default bg-background-surface py-2 shadow-medium"><button type="button" role="menuitem" onClick={goEdit} className="w-full px-4 py-2 text-left text-sm">Edit</button><button type="button" role="menuitem" onClick={openDeleteModal} className="w-full px-4 py-2 text-left text-sm text-red-600">Delete</button></div>}</div>
        </div>
        {_renderDetails(role)}
      </div>
      {isDeleteModalOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"><div className="w-full max-w-sm rounded-xl bg-background-surface p-6"><h3 className="mb-4 text-lg font-semibold">Delete role?</h3><div className="flex gap-3"><button type="button" onClick={closeDeleteModal} className="flex-1 rounded-lg bg-background-subtle p-3">Cancel</button><button type="button" onClick={handleDelete} className="flex-1 rounded-lg bg-red-600 p-3 text-white">Delete</button></div></div></div>}
    </Layout>
  );
};
