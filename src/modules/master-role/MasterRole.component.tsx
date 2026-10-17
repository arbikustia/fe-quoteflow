import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterRoleProps, RoleData } from "./MasterRole.type";

const _renderListState = (props: MasterRoleProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading roles…</p>;
  if (props.isMissingData) return <p className="py-10 text-center text-sm text-red-600">Role data is unavailable. Please try again.</p>;
  if (props.errorMessage) return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No roles found.</p>;
  return null;
};

const _renderRoleCard = (role: RoleData, onEdit: MasterRoleProps["onEdit"]): React.ReactElement => (
  <div role="button" tabIndex={0} onClick={() => onEdit(role)} className="flex cursor-pointer flex-col gap-4 rounded-3xl border border-border-default bg-background-surface p-5 transition-all hover:border-border-strong active:bg-background-subtle/50">
    <div className="flex items-start justify-between gap-3">
      <h4 className="min-w-0 truncate text-base font-semibold text-text-primary">{role.roleName}</h4>
      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${role.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{role.status}</span>
    </div>
    <div className="rounded-xl bg-background-subtle/60 p-3 text-sm">
      <p className="text-xs text-text-tertiary">Created</p>
      <p className="font-medium text-text-primary">{role.createAt || "-"}</p>
    </div>
  </div>
);

const _renderMobile = (props: MasterRoleProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  return <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden"><SearchFilter placeholder="Search role" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" /><div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map((role) => <React.Fragment key={role.id}>{_renderRoleCard(role, props.onEdit)}</React.Fragment>)}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" /></div>;
};

const _renderDesktop = (props: MasterRoleProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  return <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6"><div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search role" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white">Create Role</button></div><div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: RoleData) => row.id} />}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} /></div>;
};

export const MasterRoleComponent = (props: MasterRoleProps): React.ReactElement => {
  const createButton = <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;
  return <Layout pageTitle="Role List" mobileWhiteBackground={true}><PageLayout title="Role List" breadcrumbs={["Master", "Master Role"]} headerRight={createButton} mobileHeaderClassName="px-6" onBack={props.onBack}><div className="relative flex h-full flex-col bg-background-surface px-6 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
};
