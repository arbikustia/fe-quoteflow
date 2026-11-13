import type { ReactElement } from "react";

import { CheckboxComponent } from "@/components/Checkbox/Checkbox.component";

import type { PermissionAction, PermissionFormPage } from "../Permission.type";

import type { PermissionAssignState } from "./PermissionAssign.type";

/**
 * Bind a page URL to the row select handler.
 * @param {PermissionAssignState["onRowSelectChange"]} handler - Row select handler
 * @param {string} url - Page URL
 * @returns {(checked: boolean) => void} - Checkbox handler
 */
export const createRowSelectHandler = (handler: PermissionAssignState["onRowSelectChange"], url: string): ((checked: boolean) => void) =>
  (checked: boolean): void => handler(url, checked);

/**
 * Bind a page URL and action to the permission handler.
 * @param {PermissionAssignState["onPermissionChange"]} handler - Permission handler
 * @param {string} url - Page URL
 * @param {PermissionAction} permission - Action
 * @returns {(checked: boolean) => void} - Checkbox handler
 */
export const createPermissionHandler = (handler: PermissionAssignState["onPermissionChange"], url: string, permission: PermissionAction): ((checked: boolean) => void) =>
  (checked: boolean): void => handler(url, permission, checked);

/**
 * Render the checkboxes of one page row.
 * @param {PermissionFormPage} page - Form page
 * @param {PermissionAssignState} props - Assign page props
 * @returns {ReactElement} - Row checkboxes
 */
export const renderPageCheckboxes = (page: PermissionFormPage, props: PermissionAssignState): ReactElement => (
  <div className="flex flex-wrap gap-4">
    <CheckboxComponent
      ariaLabel={`Select all ${page.page} permissions`}
      label="All"
      checked={page.permission.length === page.actions.length}
      indeterminate={page.permission.length > 0 && page.permission.length < page.actions.length}
      onChange={createRowSelectHandler(props.onRowSelectChange, page.url)}
    />
    {page.actions.map((permission) => (
      <CheckboxComponent
        key={permission}
        ariaLabel={`${page.page} ${permission}`}
        label={permission}
        checked={page.permission.includes(permission)}
        onChange={createPermissionHandler(props.onPermissionChange, page.url, permission)}
      />
    ))}
  </div>
);

/**
 * Render one page row of the permission matrix.
 * @param {PermissionFormPage} page - Form page
 * @param {PermissionAssignState} props - Assign page props
 * @returns {ReactElement} - Table row
 */
export const renderPageRow = (page: PermissionFormPage, props: PermissionAssignState): ReactElement => (
  <tr key={page.url} className="border-b border-border-default last:border-0">
    <td className="p-3 font-medium">{page.menu}</td>
    <td className="p-3">{page.page}</td>
    <td className="p-3"><code className="text-text-secondary">{page.url}</code></td>
    <td className="p-3">{renderPageCheckboxes(page, props)}</td>
  </tr>
);
