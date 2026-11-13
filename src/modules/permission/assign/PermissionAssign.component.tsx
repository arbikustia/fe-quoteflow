import type { ReactElement } from "react";

import { CheckboxComponent } from "@/components/Checkbox/Checkbox.component";
import { Select } from "@/components/Select/Select.component";

import { renderPageRow } from "./PermissionAssign.helper";
import type { PermissionAssignState } from "./PermissionAssign.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render the user select and the select-all checkbox.
 * @param {PermissionAssignState} props - Assign page props
 * @returns {ReactElement} - Form header
 */
export const _renderFormHeader = (props: PermissionAssignState): ReactElement => (
  <div className="mb-5 flex items-center justify-between gap-4">
    <div>
      <h2 className="text-2xl font-semibold text-text-primary">Assign Permission</h2>
      <Select
        id="permission-user-select"
        label="User"
        placeholder="Select user"
        value={props.username}
        options={props.userOptions}
        onChange={props.onUserChange}
        onSearch={props.onUserSearch}
        isRemoteSearch={true}
        isLoadingOptions={props.isLoadingUsers}
        className="mt-2 w-full md:w-64"
        labelClassName="sr-only"
      />
    </div>
    <CheckboxComponent
      id="permission-select-all"
      label="Select all"
      ariaLabel="Select all permissions"
      checked={props.isAllSelected}
      indeterminate={props.isPartiallySelected}
      onChange={props.onSelectAllChange}
    />
  </div>
);

/**
 * Render the permission matrix table.
 * @param {PermissionAssignState} props - Assign page props
 * @returns {ReactElement} - Matrix table
 */
export const _renderMatrix = (props: PermissionAssignState): ReactElement => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-left">
      <thead><tr className="border-b border-border-default"><th className="p-3">Menu</th><th className="p-3">Page</th><th className="p-3">URL</th><th className="p-3">Permission</th></tr></thead>
      <tbody>
        {props.formPages.map((page) => renderPageRow(page, props))}
      </tbody>
    </table>
  </div>
);

/**
 * Render the save error and the cancel/save actions.
 * @param {PermissionAssignState} props - Assign page props
 * @returns {ReactElement} - Action bar
 */
export const _renderActions = (props: PermissionAssignState): ReactElement => (
  <>
    {props.formMessage && <p role="alert" className="mt-4 text-sm font-medium text-danger">{props.formMessage}</p>}
    <div className="mt-6 flex justify-between">
      <button type="button" onClick={props.onCancel} className="h-12 rounded-2xl border border-border-default px-6 font-semibold text-text-secondary hover:bg-background-subtle">
        Cancel
      </button>
      <button type="button" disabled={props.isSubmitting} onClick={props.onSubmit} className="h-12 rounded-2xl bg-action-primary px-6 font-semibold text-text-inverse disabled:opacity-50">
        {props.isSubmitting ? "Saving…" : "Save Permission"}
      </button>
    </div>
  </>
);

/**
 * Render the assign permission page.
 * @param {PermissionAssignState} props - Assign page props
 * @returns {ReactElement} - Assign permission page
 */
export const PermissionAssignComponent = (props: PermissionAssignState): ReactElement => (
  <Layout pageTitle="Assign Permission">
    <PageLayout
      title="Assign Permission"
      subtitle={`User: ${props.username}`}
      breadcrumbs={["Permission", "Assign Permission"]}
      mobileHeaderClassName="px-0"
      mobileTitleClassName="text-4xl"
      onBack={props.onCancel}
    >
      <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
        <section aria-label="Permission form" className="mt-2 rounded-3xl border border-border-default bg-background-surface p-5 shadow-xs md:mt-6 md:p-6">
          {_renderFormHeader(props)}
          {_renderMatrix(props)}
          {_renderActions(props)}
        </section>
      </div>
    </PageLayout>
  </Layout>
);
