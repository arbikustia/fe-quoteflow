import * as React from "react";

import { SearchFilter } from "@/components/SearchFilter";
import { Select } from "@/components/Select/Select.component";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { PermissionRow, PermissionState } from "./Permission.type";

/** Render permissions as badges. */
const _renderPermissions = (row: PermissionRow): React.ReactElement => (
  <div className="flex flex-wrap gap-2">
    {row.permission.map((permission) => (
      <span key={permission} className="rounded-full border border-action-primary px-3 py-1 text-sm font-semibold text-action-primary">
        {permission}
      </span>
    ))}
  </div>
);

/** Render menu value. */
const _renderMenu = (row: PermissionRow): React.ReactElement => <span className="text-lg font-medium">{row.menu}</span>;

/** Render page value. */
const _renderPage = (row: PermissionRow): React.ReactElement => <span className="text-lg">{row.page}</span>;

/** Render URL value. */
const _renderUrl = (row: PermissionRow): React.ReactElement => <code className="text-base text-text-secondary">{row.url}</code>;

const COLUMNS: TableColumn<PermissionRow>[] = [
  { key: "menu", header: "Menu", render: _renderMenu },
  { key: "page", header: "Page", render: _renderPage },
  { key: "url", header: "URL", render: _renderUrl },
  { key: "permission", header: "Permission", render: _renderPermissions },
];

/** Render permission table state. */
const _renderTableContent = (props: PermissionState): React.ReactElement => {
  if (!props.selectedUsername) {
    return <p className="py-10 text-center text-lg text-text-tertiary">Select a user to view permissions.</p>;
  }

  if (props.isLoadingPermission) {
    return <p role="status" className="py-10 text-center text-lg text-text-tertiary">Loading permissions…</p>;
  }

  if (props.errorMessage) {
    return <p role="alert" className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;
  }

  if (props.isEmpty) {
    return <p className="py-10 text-center text-lg text-text-tertiary">No permissions found.</p>;
  }

  return <Table data={props.rows} columns={COLUMNS} keyExtractor={(row: PermissionRow): string => row.id} />;
};

/** Render user selection and permission search form. */
const _renderAssignForm = (props: PermissionState): React.ReactElement => {
  /** Handle permission search input. */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.onSearchChange(event.target.value);

  return (
    <div className="flex flex-col gap-4 border-b border-border-default py-6 md:flex-row md:items-end">
      <Select
        id="permission-user"
        label="User"
        placeholder="Select username"
        value={props.selectedUsername}
        options={props.userOptions}
        onChange={props.onUsernameChange}
        onSearch={props.onUserSearch}
        isRemoteSearch={true}
        isLoadingOptions={props.isLoadingUsers}
        isClearable={true}
        className="w-full md:max-w-sm"
        labelClassName="!text-base"
      />
      <SearchFilter
        placeholder="Search permission"
        onChange={handleSearch}
        isRoundedFull={true}
        className="w-full md:max-w-md"
        inputClassName="text-lg placeholder:text-lg"
      />
      <button
        type="button"
        onClick={props.onOpenForm}
        className="h-12 rounded-2xl bg-action-primary px-6 font-semibold text-text-inverse disabled:cursor-not-allowed disabled:opacity-50 md:ml-auto"
      >
        Assign Permission
      </button>
    </div>
  );
};

/**
 * Render permission page.
 * @param {PermissionState} props - Permission page props
 * @returns {React.ReactElement} Permission page
 */
export const PermissionComponent = (props: PermissionState): React.ReactElement => (
    <Layout pageTitle="Permission">
      <PageLayout
        title="Permission"
        subtitle="View menu and page permissions by user"
        breadcrumbs={["Permission"]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          <div className="mt-2 rounded-3xl border border-border-default bg-background-surface px-5 pb-6 shadow-xs md:mt-6 md:px-6">
            {_renderAssignForm(props)}
            {props.formMessage && <p role="status" className="pt-4 text-sm font-medium text-text-secondary">{props.formMessage}</p>}
            <div className="overflow-x-auto pt-4">
              {_renderTableContent(props)}
            </div>
          </div>
        </div>
      </PageLayout>
    </Layout>
);
