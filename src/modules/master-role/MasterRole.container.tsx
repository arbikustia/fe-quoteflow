import * as React from "react";
import { MasterRoleComponent, RoleActionButtons } from "./MasterRole.component";
import { useMasterRoleState } from "./MasterRole.hook";
import type { RoleData, GetColumnsParams } from "./MasterRole.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_ROLES } from "../../fixture/master-role";
import { usePagination } from "../../hooks/usePagination";

/**
 * Status badge helper
 * @param { status: string } props - props
 * @returns {React.ReactElement} badge
 */
const StatusBadge = ({ status }: { status: string }): React.ReactElement => (
  <span className={status === "active" ? "px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700" : "px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500"}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

/**
 * Get table columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<RoleData>[]} columns
 */
const getColumns = ({ currentPage, pageSize, onEdit, onConfirm }: GetColumnsParams): TableColumn<RoleData>[] => [
  { key: "no", header: "No", align: "center", render: (_row, index): React.ReactElement => <span className="text-brand-text-medium font-medium text-sm">{(currentPage - 1) * pageSize + index + 1}</span> },
  { key: "roleName", header: "Role Name" },
  { key: "status", header: "Status", align: "center", render: (row): React.ReactElement => <StatusBadge status={row.status} /> },
  { key: "createAt", header: "Created At", render: (row): React.ReactElement => <span className="text-sm text-brand-text-dark">{new Date(row.createAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span> },
  { key: "createBy", header: "Created By" },
  { key: "actions", header: "Action", align: "center", render: (row): React.ReactElement => <RoleActionButtons row={row} onEdit={onEdit} onConfirm={onConfirm} /> },
];

/**
 * Master Role Container
 * @returns {React.ReactElement} container
 */
const MasterRoleContainer = (): React.ReactElement => {
  const state = useMasterRoleState();
  const pagination = usePagination(MOCK_ROLES);
  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => { e.preventDefault(); state.closeModal(); };
  const columns = getColumns({ currentPage: pagination.currentPage, pageSize: pagination.pageSize, onEdit: state.openEditModal, onConfirm: state.openConfirmModal });
  return <MasterRoleComponent {...state} {...pagination} columns={columns} onSubmit={handleFormSubmit} />;
};

export default MasterRoleContainer;
