import * as React from "react";

import { CheckboxComponent } from "@/components/Checkbox/Checkbox.component";
import { Select } from "@/components/Select/Select.component";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { PermissionAssignState } from "./PermissionAssign.type";
import type { PermissionAction } from "../Permission.type";

const PERMISSION_ACTIONS: PermissionAction[] = ["view", "create", "edit"];

export const PermissionAssignComponent = (props: PermissionAssignState): React.ReactElement => (
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
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead><tr className="border-b border-border-default"><th className="p-3">Menu</th><th className="p-3">Page</th><th className="p-3">URL</th><th className="p-3">Permission</th></tr></thead>
              <tbody>
                {props.formPages.map((page) => (
                  <tr key={page.url} className="border-b border-border-default last:border-0">
                    <td className="p-3 font-medium">{page.menu}</td>
                    <td className="p-3">{page.page}</td>
                    <td className="p-3"><code className="text-text-secondary">{page.url}</code></td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-4">
                        {PERMISSION_ACTIONS.map((permission) => (
                          <CheckboxComponent
                            key={permission}
                            ariaLabel={`${page.page} ${permission}`}
                            label={permission}
                            checked={page.permission.includes(permission)}
                            onChange={(checked): void => props.onPermissionChange(page.url, permission, checked)}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-between">
            <button type="button" onClick={props.onCancel} className="h-12 rounded-2xl border border-border-default px-6 font-semibold text-text-secondary hover:bg-background-subtle">
              Cancel
            </button>
            <button type="button" disabled={props.isSubmitting} onClick={props.onSubmit} className="h-12 rounded-2xl bg-action-primary px-6 font-semibold text-text-inverse disabled:opacity-50">
              {props.isSubmitting ? "Saving…" : "Save Permission"}
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  </Layout>
);
