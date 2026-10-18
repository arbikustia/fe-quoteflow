/* eslint-disable jsdoc/require-jsdoc */
import type { ReactElement } from "react";

import type { ProjectData } from "../MasterProject.type";

import type { MasterProjectDetailState } from "./MasterProjectDetail.type";

import Layout from "@/app/layout";

const _renderDetails = (project: ProjectData): ReactElement => (
  <div className="space-y-4">
    <div className="rounded-xl border border-border-default bg-background-surface p-5 text-center shadow-small">
      <h2 className="mb-2 text-xl font-semibold text-text-primary">{project.name}</h2>
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${project.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{project.status}</span>
    </div>
    <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
      <div className="px-5 pb-3 pt-5"><h3 className="text-sm font-semibold text-text-primary">Project details</h3></div>
      <dl className="divide-y divide-border-default">
        <div className="flex justify-between px-5 py-4"><dt className="text-sm text-text-secondary">Name</dt><dd className="text-sm font-medium text-text-primary">{project.name}</dd></div>
        <div className="flex justify-between px-5 py-4"><dt className="text-sm text-text-secondary">ID</dt><dd className="text-sm font-medium text-text-primary">{project.id}</dd></div>
        <div className="flex justify-between px-5 py-4"><dt className="text-sm text-text-secondary">Remark</dt><dd className="text-sm font-medium text-text-primary">{project.remark || "-"}</dd></div>
      </dl>
    </div>
    <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
      <div className="px-5 pb-3 pt-5"><h3 className="text-sm font-semibold text-text-primary">Items</h3></div>
      <div className="divide-y divide-border-default">
        {project.items.length === 0 && <p className="px-5 py-4 text-sm text-text-secondary">No items selected.</p>}
        {project.items.map((item) => <div key={item.item_id} className="flex items-center justify-between px-5 py-4 text-sm"><span className="font-medium text-text-primary">{item.item_name ?? item.item_id}</span><span className="text-text-secondary">Qty: {item.qty}</span></div>)}
      </div>
    </div>
    <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-small">
      <div className="px-5 pb-3 pt-5"><h3 className="text-sm font-semibold text-text-primary">Record info</h3></div>
      <dl className="grid grid-cols-1 divide-y divide-border-default sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="px-5 py-4"><dt className="mb-1 text-sm text-text-secondary">Created by</dt><dd className="truncate text-sm font-medium text-text-primary">{project.createBy}</dd></div>
        <div className="px-5 py-4"><dt className="mb-1 text-sm text-text-secondary">Created at</dt><dd className="truncate text-sm font-medium text-text-primary">{project.createAt}</dd></div>
      </dl>
    </div>
  </div>
);

export const MasterProjectDetailComponent = (props: MasterProjectDetailState): ReactElement => {
  const { project, goBack, goEdit } = props;

  if (props.isLoading) {
    return <Layout pageTitle="Detail Project"><div className="flex h-full items-center justify-center py-20"><p className="text-text-secondary">Loading project…</p></div></Layout>;
  }

  if (props.errorMessage || !project) {
    return <Layout pageTitle="Detail Project"><div className="flex h-full items-center justify-center py-20"><p className="text-red-600">{props.errorMessage ?? "Project not found"}</p></div></Layout>;
  }

  return (
    <Layout pageTitle="Detail Project">
      <div className="relative space-y-4 px-3 lg:px-0">
        <div className="flex items-center justify-between py-2">
          <button type="button" onClick={goBack} className="h-11 rounded-lg border border-border-default px-4 text-sm font-medium">Back</button>
          <h1 className="text-lg font-semibold">Detail Project</h1>
          <button type="button" onClick={goEdit} className="h-11 rounded-lg border border-border-default px-4 text-sm font-medium">Edit</button>
        </div>
        {_renderDetails(project)}
      </div>
    </Layout>
  );
};
