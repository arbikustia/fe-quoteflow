import type * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { ROLE_STATUS_BADGE_CLASS } from "./MasterRole.config";
import type { RoleData, RoleMobileCardProps } from "./MasterRole.type";
import { getRoleRowNumber } from "./MasterRole.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {RoleData} role - Role of the row
 * @param {(role: RoleData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  role: RoleData,
  onEdit: (role: RoleData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(role);
  };
};

/**
 * Render the role name cell.
 * @param {RoleData} role - Role row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (role: RoleData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{role.name}</span>
);

/**
 * Render the role status cell.
 * @param {RoleData} role - Role row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (role: RoleData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${ROLE_STATUS_BADGE_CLASS[role.status]}`}>
    {role.status}
  </span>
);

/**
 * Render the created-at cell.
 * @param {RoleData} role - Role row
 * @returns {React.ReactElement} - Created-at cell
 */
const _renderCreatedAtCell = (role: RoleData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{role.createdAt}</span>
);

/**
 * Render the row action cell.
 * @param {RoleData} role - Role row
 * @param {(role: RoleData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} - Action cell
 */
const _renderActionCell = (role: RoleData, onEdit: (role: RoleData) => void): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={_createEditClickHandler(role, onEdit)}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="Edit role"
      aria-label={`Edit role ${role.name}`}
    >
      <FiEdit2 className="h-5 w-5" />
    </button>
  </div>
);

/**
 * Build the role table columns; the action column is shown only with edit permission.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {boolean} canEdit - Whether the user may edit roles
 * @param {(role: RoleData) => void} onEdit - Edit callback
 * @returns {TableColumn<RoleData>[]} - Role table columns
 */
export const getRoleColumns = (
  currentPage: number,
  pageSize: number,
  canEdit: boolean,
  onEdit: (role: RoleData) => void,
): TableColumn<RoleData>[] => {
  /**
   * Render the row number cell.
   * @param {RoleData} _role - Role row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_role: RoleData, rowIndex: number): React.ReactElement => (
    <span className="text-lg text-text-secondary">{getRoleRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {RoleData} role - Role row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (role: RoleData): React.ReactElement => _renderActionCell(role, onEdit);

  const columns: TableColumn<RoleData>[] = [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "name", header: "Role Name", render: _renderNameCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "createdAt", header: "Created At", render: _renderCreatedAtCell },
  ];

  if (!canEdit) {
    return columns;
  }

  return [...columns, { key: "actions", header: "Action", align: "center", render: renderActionCell }];
};

/**
 * Get the table row key of a role.
 * @param {RoleData} role - Role row
 * @returns {string} - Row key
 */
export const getRoleRowKey = (role: RoleData): string => role.id;

/**
 * Render a role card for the mobile list; disabled without edit permission.
 * @param {RoleMobileCardProps} props - Role, edit permission and edit callback
 * @returns {React.ReactElement} - Role card
 */
export const renderRoleMobileCard = (props: RoleMobileCardProps): React.ReactElement => {
  const { role, canEdit, onEdit } = props;

  return (
    <button
      key={role.id}
      type="button"
      disabled={!canEdit}
      onClick={_createEditClickHandler(role, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-default disabled:hover:bg-background-surface"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{role.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${ROLE_STATUS_BADGE_CLASS[role.status]}`}>
          {role.status}
        </span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Created</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{role.createdAt}</span>
        </span>
      </span>
    </button>
  );
};
