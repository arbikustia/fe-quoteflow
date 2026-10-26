import type { ChangeEvent, ReactElement } from "react";
import { Fragment } from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

import { getProjectRowNumber } from "./MasterProject.helpers";
import type { MasterProjectProps, ProjectData } from "./MasterProject.type";

/**
 * Render No
 * @param {_row} _row - data
 * @param {number} index - index
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {React.ReactElement} span
 */
const _renderNo = (_row: ProjectData, index: number, currentPage: number, pageSize: number): React.ReactElement => (
  <span className="text-brand-text-medium font-medium text-sm">
    {getProjectRowNumber(currentPage, pageSize, index)}
  </span>
);

/**
 * Render Status
 * @param {ProjectData} row - data
 * @returns {React.ReactElement} span
 */
const _renderStatus = (row: ProjectData): React.ReactElement => (
  <span className={"px-3 py-1 rounded-full text-xs font-bold uppercase " + (row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
    {row.status}
  </span>
);

/**
 * Get Basic Columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<ProjectData>[]} columns
 */
const _getBasicColumns = (currentPage: number, pageSize: number): TableColumn<ProjectData>[] => {
  /**
   * Render No wrapper
   * @param {ProjectData} _row - data
   * @param {number} index - index
   * @returns {React.ReactElement} cell
   */
  const renderNoWrapper = (_row: ProjectData, index: number): React.ReactElement => _renderNo(_row, index, currentPage, pageSize);

  return [
    {
      key: "no",
      header: "No",
      align: "center",
      render: renderNoWrapper,
    },
    { key: "name", header: "Project Name", mobile: { primary: true } },
    { key: "remark", header: "Remark" },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: _renderStatus,
    },
    { key: "createBy", header: "Created By" },
  ];
};

/**
 * Build project table columns.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {MasterProjectProps["onEdit"]} onEdit - Edit handler
 * @returns {TableColumn<ProjectData>[]} Project columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: MasterProjectProps["onEdit"]): TableColumn<ProjectData>[] => {
  /**
   * Render actions
   * @param {ProjectData} row - row
   * @returns {React.ReactElement} action
   */
  const renderActions = (row: ProjectData): React.ReactElement => {
    /**
     * Handle click
     * @param {React.MouseEvent} e - event
     * @returns {void} void
     */
    const handleClick = (e: React.MouseEvent): void => {
      e.stopPropagation();
      onEdit(row);
    };

    return (
      <button
        onClick={handleClick}
        className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
        title="Edit"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
    );
  };

  return [
    ..._getBasicColumns(currentPage, pageSize),
    {
      key: "actions",
      header: "Action",
      align: "center",
      render: renderActions,
    },
  ];
};

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
  <MasterDataCard title={project.name} status={project.status} isLargeText={true} onClick={(): void => onEdit(project)}>
    <span className="grid gap-2 text-xl text-text-secondary">
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
    <SearchFilter placeholder="Search project" onChange={_handleSearch.bind(null, props.setSearchTerm)} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />
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
    <div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props.currentPage, props.pageSize, props.onEdit)} isDetail={false} keyExtractor={(row: ProjectData): string => row.id} />}</div>
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

  return <Layout pageTitle="Project List" mobileWhiteBackground={true}><PageLayout title="Project List" breadcrumbs={["Master", "Master Project"]} headerRight={createButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}><div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
};
