import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterUserProps, UserData } from "./MasterUser.type";

/** Render user list state. */
const _renderListState = (props: MasterUserProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-text-secondary">Loading users…</p>;
  if (props.isError) return <p role="alert" className="py-10 text-center text-sm text-red-700">Unable to load users.</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No users found.</p>;

  return null;
};

/** Render mobile user card. */
const _renderUserCard = (user: UserData, onEdit: MasterUserProps["onEdit"]): React.ReactElement => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onEdit(user)}
    className="flex cursor-pointer flex-col gap-4 rounded-3xl border border-border-default bg-background-surface p-5 transition-all hover:border-border-strong active:bg-background-subtle/50"
  >
    <div className="flex items-start justify-between gap-3">
      <h4 className="min-w-0 truncate text-base font-semibold text-text-primary">{user.username}</h4>
      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.status}</span>
    </div>
    <div className="rounded-xl bg-background-subtle/60 p-3 text-sm">
      <p className="text-xs text-text-tertiary">Role</p>
      <p className="font-medium text-text-primary">{user.role}</p>
      {user.email && <><p className="mt-2 text-xs text-text-tertiary">Email</p><p className="truncate font-medium text-text-primary">{user.email}</p></>}
    </div>
  </div>
);

/** Render mobile user list. */
const _renderMobile = (props: MasterUserProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => { props.setSearchTerm(event.target.value); };

  return (
    <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden">
      <SearchFilter placeholder="Search user" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" />
      <div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map((user) => <React.Fragment key={user.id}>{_renderUserCard(user, props.onEdit)}</React.Fragment>)}</div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
    </div>
  );
};

/** Render desktop user table. */
const _renderDesktop = (props: MasterUserProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => { props.setSearchTerm(event.target.value); };
  const keyExtractor = (row: UserData): string => row.id;

  return <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6"><div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search user" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white">Create User</button></div><div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={keyExtractor} />}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} /></div>;
};

/** Render master user page. */
export const MasterUserComponent = (props: MasterUserProps): React.ReactElement => {
  const createButton = <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;

  return <Layout pageTitle="User List" mobileWhiteBackground={true}><PageLayout title="User List" breadcrumbs={["Master", "Master User"]} headerRight={createButton} mobileHeaderClassName="px-6" onBack={props.onBack}><div className="relative flex h-full flex-col bg-background-surface px-6 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
};
