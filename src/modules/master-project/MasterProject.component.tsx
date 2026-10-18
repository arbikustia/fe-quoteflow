import type { ChangeEvent, ReactElement } from "react";
import { Fragment } from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterProjectProps, ProjectData } from "./MasterProject.type";

/**
 * Render project list state.
 * @param {MasterProjectProps} props - Project list props
 * @returns {ReactElement | null} List state or null
 */
const _renderListState = (props: MasterProjectProps): ReactElement | null => {
  if (props.isLoading) {
    return <p className="py-10 text-center text-sm text-brand-text-medium">Loading projects…</p>;
  }

  if (props.isMissingData) {
    return <p className="py-10 text-center text-sm text-red-600">Project data is unavailable. Please try again.</p>;
  }

  if (props.errorMessage) {
    return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;
  }

  if (props.isEmpty) {
    return <p className="py-10 text-center text-sm text-brand-text-medium">No projects found.</p>;
  }

  return null;
};

/**
 * Render project card.
 * @param {ProjectData} project - Project data
 * @param {MasterProjectProps["onEdit"]} onEdit - Edit callback
 * @returns {ReactElement} Project card
 */
const _renderProjectCard = (project: ProjectData, onEdit: MasterProjectProps["onEdit"]): ReactElement => (
  <MasterDataCard title={project.name} status={project.status} onClick={(): void => onEdit(project)}>
    <span className="grid gap-2 text-sm text-text-secondary">
      <span>{project.items.length} item(s)</span>
      <span className="truncate">{project.remark || "No remark"}</span>
    </span>
  </MasterDataCard>
);

/**
 * Handle project search.
 * @param {MasterProjectProps["setSearchTerm"]} setSearchTerm - Search setter
 * @param {ChangeEvent<HTMLInputElement>} event - Search event
 * @returns {void} No return value
 */
const _handleSearch = (setSearchTerm: MasterProjectProps["setSearchTerm"], event: ChangeEvent<HTMLInputElement>): void => {
  setSearchTerm(event.target.value);
};

/**
 * Render mobile project list.
 * @param {MasterProjectProps} props - Project list props
 * @returns {ReactElement} Mobile list
 */
const _renderMobile = (props: MasterProjectProps): ReactElement => (
  <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
    <SearchFilter placeholder="Search project" onChange={_handleSearch.bind(null, props.setSearchTerm)} isRoundedFull={true} className="w-full sm:w-full" />
    <div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map((project) => <Fragment key={project.id}>{_renderProjectCard(project, props.onEdit)}</Fragment>)}</div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
  </div>
);

/**
 * Render desktop project list.
 * @param {MasterProjectProps} props - Project list props
 * @returns {ReactElement} Desktop list
 */
const _renderDesktop = (props: MasterProjectProps): ReactElement => (
  <div className="hidden rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs lg:flex md:mt-6 md:flex-1 md:flex-col md:overflow-hidden">
    <div className="flex items-center justify-between gap-4 py-6">
      <SearchFilter placeholder="Search project" onChange={_handleSearch.bind(null, props.setSearchTerm)} />
      <button type="button" onClick={props.onCreate} className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white">Create Project</button>
    </div>
    <div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} onRowClick={props.onRowClick} keyExtractor={(row: ProjectData): string => row.id} />}</div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
  </div>
);

/**
 * Render master project list.
 * @param {MasterProjectProps} props - Project list props
 * @returns {ReactElement} Project list
 */
export const MasterProjectComponent = (props: MasterProjectProps): ReactElement => {
  const createButton = <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;

  return <Layout pageTitle="Project List" mobileWhiteBackground={true}><PageLayout title="Project List" breadcrumbs={["Master", "Master Project"]} headerRight={createButton} mobileHeaderClassName="px-0" onBack={props.onBack}><div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
};
