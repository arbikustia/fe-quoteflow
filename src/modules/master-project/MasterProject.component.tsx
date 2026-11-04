import type { ChangeEvent, ReactElement } from "react";
import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";
import { formatIndonesianDateTime } from "../../utils/date.helpers";

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
  <span className="text-lg text-text-secondary">
    {getProjectRowNumber(currentPage, pageSize, index)}
  </span>
);

/**
 * Render Status
 * @param {ProjectData} row - data
 * @returns {React.ReactElement} span
 */
const _renderStatus = (row: ProjectData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${row.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
    {row.status}
  </span>
);

/**
 * Render project name.
 * @param {ProjectData} row - Project row
 * @returns {ReactElement} Name cell
 */
const _renderName = (row: ProjectData): ReactElement => <span className="text-lg font-medium text-text-primary">{row.name}</span>;

/**
 * Render project remark.
 * @param {ProjectData} row - Project row
 * @returns {ReactElement} Remark cell
 */
const _renderRemark = (row: ProjectData): ReactElement => <span className="text-lg text-text-secondary">{row.remark}</span>;

/**
 * Render project creation date.
 * @param {ProjectData} row - Project row
 * @returns {ReactElement} Date cell
 */
const _renderCreatedAt = (row: ProjectData): ReactElement => (
  <span className="text-lg text-text-secondary">
    {row.createAt ? formatIndonesianDateTime(row.createAt) : "-"}
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
    { key: "name", header: "Project Name", render: _renderName },
    { key: "remark", header: "Remark", render: _renderRemark },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: _renderStatus,
    },
    { key: "createAt", header: "Created At", render: _renderCreatedAt },
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
        type="button"
        onClick={handleClick}
        className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
        title="Edit project"
        aria-label="Edit project"
      >
        <FiEdit2 className="h-5 w-5" />
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
  if (props.isMissingData) {
    return <p className="py-10 text-center text-lg lg:text-sm text-red-600">Project data is unavailable. Please try again.</p>;
  }

  if (props.errorMessage) {
    return <p className="py-10 text-center text-lg lg:text-sm text-red-600">{props.errorMessage}</p>;
  }

  if (props.isEmpty) {
    return <p className="py-10 text-center text-lg lg:text-sm text-brand-text-medium">No projects found.</p>;
  }

  return null;
};

/**
 * Render project card.
 * @param {ProjectData} project - Project data
 * @param {MasterProjectProps["onEdit"]} onEdit - Edit callback
 * @returns {ReactElement} Project card
 */
const _renderProjectCard = (project: ProjectData, onEdit: MasterProjectProps["onEdit"]): ReactElement => {
  /**
   * Handle project card click.
   * @returns {void} No return value
   */
  const handleClick = (): void => onEdit(project);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{project.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${project.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
          {project.status}
        </span>
      </span>
      <span className="mt-4 grid grid-cols-2 gap-4 border-t border-border-default pt-4">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Items</span>
          <span className="mt-1 block text-lg font-medium text-text-primary">{project.items.length} item(s)</span>
        </span>
        <span className="min-w-0 text-right">
          <span className="block text-lg text-text-tertiary">Created At</span>
          <span className="mt-1 block text-lg font-medium text-text-primary">
            {project.createAt ? formatIndonesianDateTime(project.createAt) : "-"}
          </span>
        </span>
        <span className="col-span-2 min-w-0 border-t border-border-default pt-4">
          <span className="block text-lg text-text-tertiary">Remark</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{project.remark || "-"}</span>
        </span>
      </span>
    </button>
  );
};

/**
 * Render project table loading geometry.
 * @param {MasterProjectProps} props - Project list props
 * @returns {ReactElement} Loading table
 */
const _renderTableSkeleton = (props: MasterProjectProps): ReactElement => {
  const columns = _getColumns(props.currentPage, props.pageSize, props.onEdit);
  const widths = ["w-6", "w-44", "w-32", "w-28", "w-32"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading project table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead><tr>{columns.map((column, index) => (
          <th key={column.key} className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${column.align === "center" ? "text-center" : "text-left"} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}>{column.header}</th>
        ))}</tr></thead>
        <tbody>{Array.from({ length: 5 }, (_value, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">{columns.map((column, columnIndex) => (
            <td key={column.key} className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}>
              {column.key === "actions" ? <span className="inline-block h-10 w-10 rounded-3xl bg-background-subtle" /> : <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${column.key === "status" ? "w-28 rounded-full" : widths[columnIndex]}`} />}
            </td>
          ))}</tr>
        ))}</tbody>
      </table>
    </div>
  );
};

/**
 * Render project mobile card loading geometry.
 * @param {number} key - Skeleton key
 * @returns {ReactElement} Loading card
 */
const _renderMobileCardSkeleton = (key: number): ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading project card">
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="h-7 w-40 rounded-3xl bg-background-subtle" /><span className="h-8 w-24 rounded-full bg-background-subtle" /></div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div><div className="h-7 w-20 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-32 rounded-3xl bg-background-subtle" /></div>
      <div><div className="h-7 w-20 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-32 rounded-3xl bg-background-subtle" /></div>
    </div>
  </div>
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
    <SearchFilter placeholder="Search project" onChange={_handleSearch.bind(null, props.setSearchTerm)} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
    <div className="flex min-w-0 flex-col gap-4">
      {props.isLoading ? Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index)) : _renderListState(props) ?? props.paginatedData.map((project) => <React.Fragment key={project.id}>{_renderProjectCard(project, props.onEdit)}</React.Fragment>)}
    </div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
  </div>
);

/**
 * Render desktop project list.
 * @param {MasterProjectProps} props - Project list props
 * @returns {ReactElement} Desktop list
 */
const _renderDesktop = (props: MasterProjectProps): ReactElement => (
  <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
    <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
      <SearchFilter placeholder="Search project" onChange={_handleSearch.bind(null, props.setSearchTerm)} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
      <button type="button" onClick={props.onCreate} className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">Create Project</button>
    </div>
    <div className="flex-1 overflow-auto">{props.isLoading ? _renderTableSkeleton(props) : _renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props.currentPage, props.pageSize, props.onEdit)} isDetail={false} keyExtractor={(row: ProjectData): string => row.id} />}</div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
  </div>
);

/**
 * Render master project list.
 * @param {MasterProjectProps} props - Project list props
 * @returns {ReactElement} Project list
 */
export const MasterProjectComponent = (props: MasterProjectProps): ReactElement => {
  const createButton = (
    <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden">
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Project List">
      <PageLayout title="Project List" subtitle="Manage project items and details" breadcrumbs={["Master", "Master Project"]} headerRight={createButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
