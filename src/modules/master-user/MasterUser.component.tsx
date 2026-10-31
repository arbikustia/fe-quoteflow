import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

import type { MasterUserProps, UserData } from "./MasterUser.type";

/**
 * Build user table columns.
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @param {(user: UserData) => void} onEdit - Edit callback
 * @returns {TableColumn<UserData>[]} User columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (user: UserData) => void): TableColumn<UserData>[] => {
  /**
   * Render row number.
   * @param {UserData} _row - User row
   * @param {number} index - Row index
   * @returns {React.ReactElement} Number cell
   */
  const renderNo = (_row: UserData, index: number): React.ReactElement => <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>;
  /**
   * Render role.
   * @param {UserData} row - User row
   * @returns {React.ReactElement} Role cell
   */
  const renderRole = (row: UserData): React.ReactElement => <span className={`font-bold ${row.role === "Admin" ? "text-brand-blue" : "text-brand-text-medium"}`}>{row.role ?? "-"}</span>;
  /**
   * Render status.
   * @param {UserData} row - User row
   * @returns {React.ReactElement} Status cell
   */
  const renderStatus = (row: UserData): React.ReactElement => <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{row.status}</span>;
  /**
   * Render date.
   * @param {UserData} row - User row
   * @returns {string} Creation date
   */
  const renderDate = (row: UserData): string => row.createAt ?? "-";
  /**
   * Render actions.
   * @param {UserData} row - User row
   * @returns {React.ReactElement} Action cell
   */
  const renderActions = (row: UserData): React.ReactElement => {
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
    { key: "username", header: "Username", mobile: { primary: true } },
    { key: "role", header: "Role", render: renderRole },
    { key: "status", header: "Status", align: "center", render: renderStatus },
    { key: "createAt", header: "Created At", render: renderDate },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render user list state.
 * @param {MasterUserProps} props - Master user props
 * @returns {React.ReactElement | null} List state
 */
const _renderListState = (props: MasterUserProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-text-secondary">Loading users…</p>;

  if (props.isError) return <p role="alert" className="py-10 text-center text-sm text-red-700">Unable to load users.</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No users found.</p>;

  return null;
};

/**
 * Render mobile user card.
 * @param {UserData} user - User data
 * @param {MasterUserProps["onEdit"]} onEdit - Edit handler
 * @returns {React.ReactElement} User card
 */
const _renderUserCard = (user: UserData, onEdit: MasterUserProps["onEdit"]): React.ReactElement => (
  <MasterDataCard title={user.username} status={user.status} isLargeText={true} onClick={(): void => onEdit(user)}>
    <span className="grid gap-2 text-xl text-text-secondary">
      <span>{user.role || "No role"}</span>
      {user.email && <span className="truncate">{user.email}</span>}
    </span>
  </MasterDataCard>
);

/**
 * Render mobile user list.
 * @param {MasterUserProps} props - Master user props
 * @returns {React.ReactElement} Mobile list element
 */
const _renderMobile = (props: MasterUserProps): React.ReactElement => {
  /**
   * Handle mobile search input.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search change event
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => { props.setSearchTerm(event.target.value); };

  return (
    <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden">
      <SearchFilter placeholder="Search user" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />
      <div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map((user) => <React.Fragment key={user.id}>{_renderUserCard(user, props.onEdit)}</React.Fragment>)}</div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
    </div>
  );
};

/**
 * Render desktop user table.
 * @param {MasterUserProps} props - Master user props
 * @returns {React.ReactElement} Desktop table element
 */
const _renderDesktop = (props: MasterUserProps): React.ReactElement => {
  const columns = _getColumns(props.currentPage, props.pageSize, props.onEdit);

  /**
   * Handle desktop search.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Search input event
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => { props.setSearchTerm(event.target.value); };
  /**
   * Extract row key.
   * @param {UserData} row - User data row
   * @returns {string} Row key
   */
  const keyExtractor = (row: UserData): string => row.id;

  return <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6"><div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search user" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white">Create User</button></div><div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={keyExtractor} />}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} /></div>;
};

/**
 * Render master user page.
 * @param {MasterUserProps} props - Master user props
 * @returns {React.ReactElement} Master user page element
 */
export const MasterUserComponent = (props: MasterUserProps): React.ReactElement => {
  return <Layout pageTitle="User List" mobileWhiteBackground={true}><PageLayout title="User List" breadcrumbs={["Master", "Master User"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}><div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
};
