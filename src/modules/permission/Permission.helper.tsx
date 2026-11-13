import type { ChangeEvent, ReactElement } from "react";

import type { PermissionRow } from "./Permission.type";
import { getPermissionBadgeClass } from "./Permission.util";

/**
 * Render permissions as badges.
 * @param {PermissionRow} row - Permission row
 * @returns {ReactElement} - Badge list
 */
export const renderPermissions = (row: PermissionRow): ReactElement => (
  <div className="flex flex-wrap gap-2">
    {row.permission.map((permission) => (
      <span key={permission} className={`rounded-full border px-3 py-1 text-sm font-semibold ${getPermissionBadgeClass(permission)}`}>
        {permission}
      </span>
    ))}
  </div>
);

/**
 * Render the menu cell.
 * @param {PermissionRow} row - Permission row
 * @returns {ReactElement} - Menu cell
 */
export const renderMenu = (row: PermissionRow): ReactElement => <span className="text-lg font-medium">{row.menu}</span>;

/**
 * Render the page cell.
 * @param {PermissionRow} row - Permission row
 * @returns {ReactElement} - Page cell
 */
export const renderPage = (row: PermissionRow): ReactElement => <span className="text-lg">{row.page}</span>;

/**
 * Render the URL cell.
 * @param {PermissionRow} row - Permission row
 * @returns {ReactElement} - URL cell
 */
export const renderUrl = (row: PermissionRow): ReactElement => <code className="text-base text-text-secondary">{row.url}</code>;

/**
 * Get the row key of a permission row.
 * @param {PermissionRow} row - Permission row
 * @returns {string} - Row id
 */
export const getPermissionRowKey = (row: PermissionRow): string => row.id;

/**
 * Bind a text handler to an input change event.
 * @param {(value: string) => void} handler - Handler receiving the input value
 * @returns {(event: ChangeEvent<HTMLInputElement>) => void} - Change handler
 */
export const createSearchChangeHandler = (handler: (value: string) => void): ((event: ChangeEvent<HTMLInputElement>) => void) =>
  (event: ChangeEvent<HTMLInputElement>): void => handler(event.target.value);
