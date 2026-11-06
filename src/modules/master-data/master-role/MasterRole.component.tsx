import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import { formatRoleDate } from "./MasterRole.helpers";
import type { MasterRoleProps, RoleData } from "./MasterRole.type";
import Layout from "../../../app/layout";
import { PageLayout } from "../../../app/shared/PageLayout";
import { Pagination } from "../../../components/Pagination";
import { SearchFilter } from "../../../components/SearchFilter";
import type { TableColumn } from "../../../components/Table";
import Table from "../../../components/Table";

/**
 * Render role row number.
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @param {number} index - Row index
 * @returns {React.ReactElement} Number cell
 */
const _renderNumber = (currentPage: number, pageSize: number, index: number): React.ReactElement => (
  <span className="text-lg text-text-secondary">{(currentPage - 1) * pageSize + index + 1}</span>
);

/**
 * Render role name.
 * @param {RoleData} role - Role row
 * @returns {React.ReactElement} Name cell
 */
const _renderRoleName = (role: RoleData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{role.roleName}</span>
);

/**
 * Render role status.
 * @param {RoleData} role - Role row
 * @returns {React.ReactElement} Status cell
 */
const _renderStatus = (role: RoleData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${role.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
    {role.status}
  </span>
);

/**
 * Render role creation date.
 * @param {RoleData} role - Role row
 * @returns {React.ReactElement} Date cell
 */
const _renderDate = (role: RoleData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{role.createAt ? formatRoleDate(role.createAt) : "-"}</span>
);

/**
 * Render role row actions.
 * @param {RoleData} role - Role row
 * @param {MasterRoleProps["onEdit"]} onEdit - Edit handler
 * @returns {React.ReactElement} Action cell
 */
const _renderActions = (role: RoleData, onEdit: MasterRoleProps["onEdit"]): React.ReactElement => {
  /** Handle edit click. */
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEdit(role);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button type="button" onClick={handleEdit} className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Edit role" aria-label={`Edit role ${role.roleName}`}>
        <FiEdit2 className="h-5 w-5" />
      </button>
    </div>
  );
};

/**
 * Build role table columns.
 * @param {MasterRoleProps} props - Component props
 * @returns {TableColumn<RoleData>[]} Role columns
 */
const _getColumns = (props: MasterRoleProps): TableColumn<RoleData>[] => {
  const renderNumber = (_role: RoleData, index: number): React.ReactElement => _renderNumber(props.currentPage, props.pageSize, index);
  const renderActions = (role: RoleData): React.ReactElement => _renderActions(role, props.onEdit);

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "roleName", header: "Role Name", render: _renderRoleName },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "createAt", header: "Created At", render: _renderDate },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render role list state.
 * @param {MasterRoleProps} props - Component props
 * @returns {React.ReactElement | null} List state
 */
const _renderListState = (props: MasterRoleProps): React.ReactElement | null => {
  if (props.isMissingData) return <p className="py-10 text-center text-lg text-danger">Role data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No roles found.</p>;

  return null;
};

/** Render action skeleton. */
const _renderActionSkeleton = (): React.ReactElement => (
  <div className="flex justify-center gap-1">
    <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
  </div>
);

/**
 * Render table skeleton.
 * @param {MasterRoleProps} props - Component props
 * @returns {React.ReactElement} Table skeleton
 */
const _renderTableSkeleton = (props: MasterRoleProps): React.ReactElement => {
  const columns = _getColumns(props);
  const widths = ["w-6", "w-52", "w-28", "w-28", "w-28"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading role table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column.key} className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${column.align === "center" ? "text-center" : "text-left"} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_value, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {columns.map((column, columnIndex) => (
                <td key={column.key} className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}>
                  {column.key === "actions" ? _renderActionSkeleton() : <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${column.key === "status" ? "w-28 rounded-full" : widths[columnIndex]}`} />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Render mobile card skeleton.
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Card skeleton
 */
const _renderMobileCardSkeleton = (key: number): React.ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading role card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="h-7 w-32 rounded-3xl bg-background-subtle" />
      <span className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div><div className="h-7 w-20 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" /></div>
      <div className="text-right"><div className="ml-auto h-7 w-12 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" /></div>
    </div>
  </div>
);

/**
 * Render mobile role card.
 * @param {RoleData} role - Role data
 * @param {MasterRoleProps["onEdit"]} onEdit - Edit action
 * @returns {React.ReactElement} Role card
 */
const _renderRoleCard = (role: RoleData, onEdit: MasterRoleProps["onEdit"]): React.ReactElement => {
  const handleClick = (): void => onEdit(role);

  return (
    <button type="button" onClick={handleClick} className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{role.roleName}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${role.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>{role.status}</span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0"><span className="block text-lg text-text-tertiary">Created</span><span className="mt-1 block text-lg font-medium text-text-primary">{role.createAt ? formatRoleDate(role.createAt) : "-"}</span></span>
      </span>
    </button>
  );
};

/**
 * Render mobile role list.
 * @param {MasterRoleProps} props - Component props
 * @returns {React.ReactElement} Mobile element
 */
const _renderMobile = (props: MasterRoleProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search role" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index)) : _renderListState(props) ?? props.paginatedData.map((role) => <React.Fragment key={role.id}>{_renderRoleCard(role, props.onEdit)}</React.Fragment>)}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
    </div>
  );
};

/**
 * Render desktop role table.
 * @param {MasterRoleProps} props - Component props
 * @returns {React.ReactElement} Desktop element
 */
const _renderDesktop = (props: MasterRoleProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search role" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
        <button type="button" onClick={props.onCreate} className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">Create Role</button>
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? _renderTableSkeleton(props) : _renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props)} isDetail={false} keyExtractor={(row: RoleData): string => row.id} />}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
    </div>
  );
};

/**
 * Render master role page component.
 * @param {MasterRoleProps} props - Component props
 * @returns {React.ReactElement} Page element
 */
export const MasterRoleComponent = (props: MasterRoleProps): React.ReactElement => {
  const createButton = (
    <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden">
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Role List">
      <PageLayout title="Role List" subtitle="Manage user roles and access rights" breadcrumbs={["Master", "Master Role"]} headerRight={createButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
