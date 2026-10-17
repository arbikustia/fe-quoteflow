import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterProjectProps, ProjectData } from "./MasterProject.type";

const _renderListState = (props: MasterProjectProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading projects…</p>;
  if (props.isMissingData) return <p className="py-10 text-center text-sm text-red-600">Project data is unavailable. Please try again.</p>;
  if (props.errorMessage) return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No projects found.</p>;
  return null;
};

const _renderProjectCard = (project: ProjectData, onEdit: MasterProjectProps["onEdit"]): React.ReactElement => (
  <div role="button" tabIndex={0} onClick={() => onEdit(project)} className="flex cursor-pointer flex-col gap-4 rounded-3xl border border-border-default bg-background-surface p-5 transition-all hover:border-border-strong active:bg-background-subtle/50">
    <div className="flex items-start justify-between gap-3">
      <h4 className="min-w-0 truncate text-base font-semibold text-text-primary">{project.name}</h4>
      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${project.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{project.status}</span>
    </div>
    <div className="grid gap-2 rounded-xl bg-background-subtle/60 p-3 text-sm">
      <div><p className="text-xs text-text-tertiary">Items</p><p className="font-medium text-text-primary">{project.items.length} item(s)</p></div>
      <div><p className="text-xs text-text-tertiary">Remark</p><p className="truncate font-medium text-text-primary">{project.remark || "No remark"}</p></div>
    </div>
  </div>
);

const _renderMobile = (props: MasterProjectProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  return <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden"><SearchFilter placeholder="Search project" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" /><div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map((project) => <React.Fragment key={project.id}>{_renderProjectCard(project, props.onEdit)}</React.Fragment>)}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" /></div>;
};

const _renderDesktop = (props: MasterProjectProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  return <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6"><div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search project" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white">Create Project</button></div><div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} onRowClick={props.onRowClick} keyExtractor={(row: ProjectData) => row.id} />}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} /></div>;
};

export const MasterProjectComponent = (props: MasterProjectProps): React.ReactElement => {
  const createButton = <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;
  return <Layout pageTitle="Project List" mobileWhiteBackground={true}><PageLayout title="Project List" breadcrumbs={["Master", "Master Project"]} headerRight={createButton} mobileHeaderClassName="px-6" onBack={props.onBack}><div className="relative flex h-full flex-col bg-background-surface px-6 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
};
