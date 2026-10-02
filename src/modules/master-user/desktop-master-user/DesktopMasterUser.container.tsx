import * as React from "react";

import type { TableColumn } from "../../../components/Table";
import { MOCK_USERS } from "../../../fixture/master-user";
import { usePagination } from "../../../hooks/usePagination";

import { DesktopMasterUserComponent, UserActionButtons } from "./DesktopMasterUser.component";
import { useDesktopMasterUserState } from "./DesktopMasterUser.hook";
import type { GetColumnsParams, UserData } from "./DesktopMasterUser.type";

/**
 * Get table columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<UserData>[]} table columns
 */
const getColumns = ({
  currentPage,
  pageSize,
  onEdit,
  onConfirm,
}: GetColumnsParams): TableColumn<UserData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    /**
     * Render no column
     * @param {unknown} _ - unused
     * @param {number} index - index
     * @returns {React.ReactElement} column node
     */
    render: (_, index) => (
      <span className="text-brand-text-medium font-medium text-sm">
        {(currentPage - 1) * pageSize + index + 1}
      </span>
    ),
  },
  { key: "username", header: "Username" },
  { key: "role", header: "Role" },
  {
    key: "actions",
    header: "Action",
    align: "center",
    /**
     * Render actions column
     * @param {UserData} row - current row
     * @returns {React.ReactElement} actions node
     */
    render: (row): React.ReactElement => (
      <UserActionButtons row={row} onEdit={onEdit} onConfirm={onConfirm} />
    ),
  },
];

/**
 * Render Desktop Master User Container
 * @returns {React.ReactElement} - Desktop Master User Container
 */
const DesktopMasterUserContainer = (): React.ReactElement => {
  const state = useDesktopMasterUserState();
  const pagination = usePagination(MOCK_USERS);

  /**
   * Handle form submit
   * @param {React.SyntheticEvent<HTMLFormElement>} e - event
   * @returns {void} void
   */
  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    state.closeModal();
  };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: state.openEditModal,
    onConfirm: state.openConfirmModal,
  });

  return (
    <DesktopMasterUserComponent
      {...state}
      {...pagination}
      columns={columns}
      onSubmit={handleFormSubmit}
    />
  );
};

export default DesktopMasterUserContainer;
