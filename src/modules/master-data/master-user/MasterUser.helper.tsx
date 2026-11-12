import type * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { USER_STATUS_BADGE_CLASS } from "./MasterUser.config";
import type { UserData, UserMobileCardProps } from "./MasterUser.type";
import { getUserRowNumber } from "./MasterUser.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {UserData} user - User of the row
 * @param {(user: UserData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  user: UserData,
  onEdit: (user: UserData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(user);
  };
};

/**
 * Render the username cell.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} - Username cell
 */
const _renderUsernameCell = (user: UserData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{user.username}</span>
);

/**
 * Render the email cell.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} - Email cell
 */
const _renderEmailCell = (user: UserData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{user.email}</span>
);

/**
 * Render the role cell.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} - Role cell
 */
const _renderRoleCell = (user: UserData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{user.role}</span>
);

/**
 * Render the user status cell.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (user: UserData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${USER_STATUS_BADGE_CLASS[user.status]}`}>
    {user.status}
  </span>
);

/**
 * Render the created-at cell.
 * @param {UserData} user - User row
 * @returns {React.ReactElement} - Created-at cell
 */
const _renderCreatedAtCell = (user: UserData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{user.createdAt}</span>
);

/**
 * Render the row action cell.
 * @param {UserData} user - User row
 * @param {(user: UserData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} - Action cell
 */
const _renderActionCell = (user: UserData, onEdit: (user: UserData) => void): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={_createEditClickHandler(user, onEdit)}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="Edit user"
      aria-label={`Edit user ${user.username}`}
    >
      <FiEdit2 className="h-5 w-5" />
    </button>
  </div>
);

/**
 * Build the user table columns; the action column is shown only with edit permission.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {boolean} canEdit - Whether the user may edit users
 * @param {(user: UserData) => void} onEdit - Edit callback
 * @returns {TableColumn<UserData>[]} - User table columns
 */
export const getUserColumns = (
  currentPage: number,
  pageSize: number,
  canEdit: boolean,
  onEdit: (user: UserData) => void,
): TableColumn<UserData>[] => {
  /**
   * Render the row number cell.
   * @param {UserData} _user - User row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_user: UserData, rowIndex: number): React.ReactElement => (
    <span className="text-lg text-text-secondary">{getUserRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {UserData} user - User row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (user: UserData): React.ReactElement => _renderActionCell(user, onEdit);

  const columns: TableColumn<UserData>[] = [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "username", header: "Username", render: _renderUsernameCell },
    { key: "email", header: "Email", render: _renderEmailCell },
    { key: "role", header: "Role", render: _renderRoleCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "createdAt", header: "Created At", render: _renderCreatedAtCell },
  ];

  if (!canEdit) {
    return columns;
  }

  return [...columns, { key: "actions", header: "Action", align: "center", render: renderActionCell }];
};

/**
 * Get the table row key of a user.
 * @param {UserData} user - User row
 * @returns {string} - Row key
 */
export const getUserRowKey = (user: UserData): string => user.id;

/**
 * Render a user card for the mobile list; disabled without edit permission.
 * @param {UserMobileCardProps} props - User, edit permission and edit callback
 * @returns {React.ReactElement} - User card
 */
export const renderUserMobileCard = (props: UserMobileCardProps): React.ReactElement => {
  const { user, canEdit, onEdit } = props;

  return (
    <button
      key={user.id}
      type="button"
      disabled={!canEdit}
      onClick={_createEditClickHandler(user, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-default disabled:hover:bg-background-surface"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{user.username}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${USER_STATUS_BADGE_CLASS[user.status]}`}>
          {user.status}
        </span>
      </span>
      <span className="mt-4 block min-w-0 border-t border-border-default pt-4">
        <span className="block text-lg text-text-tertiary">Email</span>
        <span className="mt-1 block break-all text-lg font-medium text-text-primary">{user.email}</span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Role</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{user.role}</span>
        </span>
        <span className="min-w-0 text-right">
          <span className="block text-lg text-text-tertiary">Created</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{user.createdAt}</span>
        </span>
      </span>
    </button>
  );
};
