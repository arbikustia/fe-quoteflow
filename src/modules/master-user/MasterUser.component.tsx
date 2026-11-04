import * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";
import { formatIndonesianDateTime } from "../../utils/date.helpers";

import type { MasterUserProps, UserData } from "./MasterUser.type";

/**
 * Render user row number.
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @param {number} index - Row index
 * @returns {React.ReactElement} Number cell
 */
const _renderNumber = (currentPage: number, pageSize: number, index: number): React.ReactElement => (
  <span className="text-lg text-text-secondary">{(currentPage - 1) * pageSize + index + 1}</span>
);

/**
 * Render username.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} Username cell
 */
const _renderUsername = (user: UserData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{user.username}</span>
);

/**
 * Render email.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} Email cell
 */
const _renderEmail = (user: UserData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{user.email ?? "-"}</span>
);

/**
 * Render role.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} Role cell
 */
const _renderRole = (user: UserData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{user.role ?? "-"}</span>
);

/**
 * Render status.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} Status cell
 */
const _renderStatus = (user: UserData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${user.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
    {user.status}
  </span>
);

/**
 * Render creation date.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} Date cell
 */
const _renderDate = (user: UserData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{user.createAt ? formatIndonesianDateTime(user.createAt) : "-"}</span>
);

/**
 * Render row actions.
 * @param {UserData} user - User row
 * @param {MasterUserProps["onEdit"]} onEdit - Edit handler
 * @returns {React.ReactElement} Action cell
 */
const _renderActions = (user: UserData, onEdit: MasterUserProps["onEdit"]): React.ReactElement => {
  /** Handle edit click. */
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEdit(user);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button type="button" onClick={handleEdit} className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Edit user" aria-label={`Edit user ${user.username}`}>
        <FiEdit2 className="h-5 w-5" />
      </button>
    </div>
  );
};

/**
 * Build user table columns.
 * @param {MasterUserProps} props - Component props
 * @returns {TableColumn<UserData>[]} User columns
 */
const _getColumns = (props: MasterUserProps): TableColumn<UserData>[] => {
  const renderNumber = (_user: UserData, index: number): React.ReactElement => _renderNumber(props.currentPage, props.pageSize, index);
  const renderActions = (user: UserData): React.ReactElement => _renderActions(user, props.onEdit);

  return [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "username", header: "Username", render: _renderUsername },
    { key: "email", header: "Email", render: _renderEmail },
    { key: "role", header: "Role", render: _renderRole },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "createAt", header: "Created At", render: _renderDate },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render user list state.
 * @param {MasterUserProps} props - Component props
 * @returns {React.ReactElement | null} List state
 */
const _renderListState = (props: MasterUserProps): React.ReactElement | null => {
  if (props.isError) return <p role="alert" className="py-10 text-center text-lg text-danger">Unable to load users.</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No users found.</p>;

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
 * @param {MasterUserProps} props - Component props
 * @returns {React.ReactElement} Table skeleton
 */
const _renderTableSkeleton = (props: MasterUserProps): React.ReactElement => {
  const columns = _getColumns(props);
  const widths = ["w-6", "w-40", "w-44", "w-32", "w-28", "w-28"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading user table">
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
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading user card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="h-7 w-32 rounded-3xl bg-background-subtle" />
      <span className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div><div className="h-7 w-20 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" /></div>
      <div className="text-right"><div className="ml-auto h-7 w-20 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" /></div>
    </div>
  </div>
);

/**
 * Render mobile user card.
 * @param {UserData} user - User data
 * @param {MasterUserProps["onEdit"]} onEdit - Edit action
 * @returns {React.ReactElement} User card
 */
const _renderUserCard = (user: UserData, onEdit: MasterUserProps["onEdit"]): React.ReactElement => {
  const handleClick = (): void => onEdit(user);

  return (
    <button type="button" onClick={handleClick} className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{user.username}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${user.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>{user.status}</span>
      </span>
      <span className="mt-4 block min-w-0 border-t border-border-default pt-4">
        <span className="block text-lg text-text-tertiary">Email</span>
        <span className="mt-1 block break-all text-lg font-medium text-text-primary">{user.email ?? "-"}</span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <span className="min-w-0"><span className="block text-lg text-text-tertiary">Role</span><span className="mt-1 block text-lg font-medium text-text-primary">{user.role || "-"}</span></span>
        <span className="min-w-0 text-right"><span className="block text-lg text-text-tertiary">Created</span><span className="mt-1 block text-lg font-medium text-text-primary">{user.createAt ? formatIndonesianDateTime(user.createAt) : "-"}</span></span>
      </span>
    </button>
  );
};

/**
 * Render mobile user list.
 * @param {MasterUserProps} props - Component props
 * @returns {React.ReactElement} Mobile element
 */
const _renderMobile = (props: MasterUserProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search user" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index)) : _renderListState(props) ?? props.paginatedData.map((user) => <React.Fragment key={user.id}>{_renderUserCard(user, props.onEdit)}</React.Fragment>)}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
    </div>
  );
};

/**
 * Render desktop user table.
 * @param {MasterUserProps} props - Component props
 * @returns {React.ReactElement} Desktop element
 */
const _renderDesktop = (props: MasterUserProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search user" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
        <button type="button" onClick={props.onCreate} className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">Create User</button>
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? _renderTableSkeleton(props) : _renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props)} isDetail={false} keyExtractor={(row: UserData): string => row.id} />}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
    </div>
  );
};

/**
 * Render master user page component.
 * @param {MasterUserProps} props - Component props
 * @returns {React.ReactElement} Page element
 */
export const MasterUserComponent = (props: MasterUserProps): React.ReactElement => {
  const createButton = (
    <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden">
      Create New
    </button>
  );

  return (
    <Layout pageTitle="User List">
      <PageLayout title="User List" subtitle="Manage system users and their roles" breadcrumbs={["Master", "Master User"]} headerRight={createButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
