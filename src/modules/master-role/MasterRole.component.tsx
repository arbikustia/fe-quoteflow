import type { ChangeEvent, ReactElement } from "react";
import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

import type { MasterRoleProps, RoleData } from "./MasterRole.type";

/**
 * Build role table columns.
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @param {(role: RoleData) => void} onEdit - Edit callback
 * @returns {TableColumn<RoleData>[]} Role columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (role: RoleData) => void): TableColumn<RoleData>[] => {
  /**
   * Render row number.
   * @param {RoleData} _row - Role row
   * @param {number} index - Row index
   * @returns {ReactElement} Number cell
   */
  const renderNo = (_row: RoleData, index: number): ReactElement => <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>;
  /**
   * Render status.
   * @param {RoleData} row - Role row
   * @returns {ReactElement} Status cell
   */
  const renderStatus = (row: RoleData): ReactElement => <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{row.status}</span>;
  /**
   * Render creation date.
   * @param {RoleData} row - Role row
   * @returns {string} Creation date
   */
  const renderDate = (row: RoleData): string => row.createAt ?? "-";
  /**
   * Render action cell.
   * @param {RoleData} row - Role row
   * @returns {ReactElement} Action cell
   */
  const renderActions = (row: RoleData): ReactElement => {
    /**
     * Handle edit click.
     * @param {React.MouseEvent} event - Mouse event
     * @returns {void} No return value
     */
    const handleClick = (event: React.MouseEvent): void => {
      event.stopPropagation();
      onEdit(row);
    };

    return <button type="button" onClick={handleClick} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium hover:bg-brand-blue-light hover:text-brand-blue" title="Edit"><FiEdit2 className="h-4 w-4" /></button>;
  };

  return [
    { key: "no", header: "No", align: "center", render: renderNo },
    { key: "roleName", header: "Role Name", mobile: { primary: true } },
    { key: "status", header: "Status", align: "center", mobile: { primary: true, render: renderStatus }, render: renderStatus },
    { key: "createAt", header: "Created At", render: renderDate },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render list loading, error, or empty state.
 * @param {MasterRoleProps} props - Role list props
 * @returns {ReactElement | null} List state or null
 */
const _renderListState = (props: MasterRoleProps): ReactElement | null => {
  if (props.isLoading) {
    return <p className="py-10 text-center text-sm text-brand-text-medium">Loading roles…</p>;
  }

  if (props.isMissingData) {
    return <p className="py-10 text-center text-sm text-red-600">Role data is unavailable. Please try again.</p>;
  }

  if (props.errorMessage) {
    return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;
  }

  if (props.isEmpty) {
    return <p className="py-10 text-center text-sm text-brand-text-medium">No roles found.</p>;
  }

  return null;
};

/**
 * Create role card click handler.
 * @param {RoleData} role - Role data
 * @param {MasterRoleProps["onEdit"]} onEdit - Edit callback
 * @returns {() => void} Click handler
 */
const _createRoleEditHandler = (role: RoleData, onEdit: MasterRoleProps["onEdit"]): (() => void) => () => {
  onEdit(role);
};

/**
 * Render one mobile role card.
 * @param {RoleData} role - Role data
 * @param {MasterRoleProps["onEdit"]} onEdit - Edit callback
 * @returns {ReactElement} Role card
 */
const _renderRoleCard = (role: RoleData, onEdit: MasterRoleProps["onEdit"]): ReactElement => (
  <MasterDataCard title={role.roleName} status={role.status} isLargeText={true} onClick={_createRoleEditHandler(role, onEdit)}>
    <span className="text-xl text-text-secondary">Created {role.createAt || "-"}</span>
  </MasterDataCard>
);

/**
 * Handle role search input.
 * @param {MasterRoleProps["setSearchTerm"]} setSearchTerm - Search setter
 * @param {ChangeEvent<HTMLInputElement>} event - Input event
 * @returns {void} No return value
 */
const _handleSearch = (setSearchTerm: MasterRoleProps["setSearchTerm"], event: ChangeEvent<HTMLInputElement>): void => {
  setSearchTerm(event.target.value);
};

/**
 * Render mobile role list.
 * @param {MasterRoleProps} props - Role list props
 * @returns {ReactElement} Mobile list
 */
const _renderMobile = (props: MasterRoleProps): ReactElement => (
  <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
    <SearchFilter placeholder="Search role" onChange={_handleSearch.bind(null, props.setSearchTerm)} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />
    <div className="min-w-0 space-y-3">
      {_renderListState(props) ?? props.paginatedData.map((role) => <React.Fragment key={role.id}>{_renderRoleCard(role, props.onEdit)}</React.Fragment>)}
    </div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
  </div>
);

/**
 * Render desktop role list.
 * @param {MasterRoleProps} props - Role list props
 * @returns {ReactElement} Desktop list
 */
const _renderDesktop = (props: MasterRoleProps): ReactElement => {
  const columns = _getColumns(props.currentPage, props.pageSize, props.onEdit);

  return (
  <div className="hidden rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs lg:flex md:mt-6 md:flex-1 md:flex-col md:overflow-hidden">
    <div className="flex items-center justify-between gap-4 py-6">
      <SearchFilter placeholder="Search role" onChange={_handleSearch.bind(null, props.setSearchTerm)} />
      <button type="button" onClick={props.onCreate} className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white">Create Role</button>
    </div>
    <div className="flex-1 overflow-auto">
      {_renderListState(props) ?? <Table data={props.paginatedData} columns={columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: RoleData): string => row.id} />}
    </div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
  </div>
  );
};

/**
 * Render master role list page.
 * @param {MasterRoleProps} props - Role list props
 * @returns {ReactElement} Role list page
 */
export const MasterRoleComponent = (props: MasterRoleProps): ReactElement => {
  return (
    <Layout pageTitle="Role List" mobileWhiteBackground={true}>
      <PageLayout title="Role List" breadcrumbs={["Master", "Master Role"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
