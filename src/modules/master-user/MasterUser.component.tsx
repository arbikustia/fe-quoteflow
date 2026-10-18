import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterUserProps, UserData } from "./MasterUser.type";

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
  <MasterDataCard title={user.username} status={user.status} onClick={(): void => onEdit(user)}>
    <span className="grid gap-2 text-sm text-text-secondary">
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
      <SearchFilter placeholder="Search user" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" />
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

  return <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6"><div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search user" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white">Create User</button></div><div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={keyExtractor} />}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} /></div>;
};

/**
 * Render master user page.
 * @param {MasterUserProps} props - Master user props
 * @returns {React.ReactElement} Master user page element
 */
export const MasterUserComponent = (props: MasterUserProps): React.ReactElement => {
  const createButton = <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;

  return <Layout pageTitle="User List" mobileWhiteBackground={true}><PageLayout title="User List" breadcrumbs={["Master", "Master User"]} headerRight={createButton} mobileHeaderClassName="px-0" onBack={props.onBack}><div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
};
