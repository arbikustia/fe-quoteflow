import type { ChangeEvent, ReactElement } from "react";
import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterRoleProps, RoleData } from "./MasterRole.type";

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
  <MasterDataCard title={role.roleName} status={role.status} onClick={_createRoleEditHandler(role, onEdit)}>
    <span className="text-sm text-text-secondary">Created {role.createAt || "-"}</span>
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
    <SearchFilter placeholder="Search role" onChange={_handleSearch.bind(null, props.setSearchTerm)} isRoundedFull={true} className="w-full sm:w-full" />
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
const _renderDesktop = (props: MasterRoleProps): ReactElement => (
  <div className="hidden rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs lg:flex md:mt-6 md:flex-1 md:flex-col md:overflow-hidden">
    <div className="flex items-center justify-between gap-4 py-6">
      <SearchFilter placeholder="Search role" onChange={_handleSearch.bind(null, props.setSearchTerm)} />
      <button type="button" onClick={props.onCreate} className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white">Create Role</button>
    </div>
    <div className="flex-1 overflow-auto">
      {_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: RoleData): string => row.id} />}
    </div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
  </div>
);

/**
 * Render master role list page.
 * @param {MasterRoleProps} props - Role list props
 * @returns {ReactElement} Role list page
 */
export const MasterRoleComponent = (props: MasterRoleProps): ReactElement => {
  const createButton = <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;

  return (
    <Layout pageTitle="Role List" mobileWhiteBackground={true}>
      <PageLayout title="Role List" breadcrumbs={["Master", "Master Role"]} headerRight={createButton} mobileHeaderClassName="px-0" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
