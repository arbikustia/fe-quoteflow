import * as React from "react";
import { MasterUserComponent, UserActionButtons } from "./MasterUser.component";
import { useMasterUserState } from "./MasterUser.hook";
import type { UserData, GetColumnsParams } from "./MasterUser.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_USERS } from "../../fixture/master-user";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit, onConfirm }: GetColumnsParams): TableColumn<UserData>[] => [
  { 
    key: "no", 
    header: "No", 
    align: "center", 
    render: (_, index) => <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span> 
  },
  { key: "username", header: "Username" },
  { 
    key: "role", 
    header: "Role",
    render: (row) => (
      <span className={`font-bold ${row.role === "Admin" ? "text-brand-blue" : "text-brand-text-medium"}`}>
        {row.role}
      </span>
    )
  },
  { 
    key: "status", 
    header: "Status", 
    align: "center",
    render: (row) => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        {row.status}
      </span>
    )
  },
  { key: "createAt", header: "Created At" },
  { key: "createBy", header: "Created By" },
  { 
    key: "actions", 
    header: "Action", 
    align: "center", 
    render: (row) => <UserActionButtons row={row} onEdit={onEdit} onConfirm={onConfirm} /> 
  },
];

const MasterUserContainer = (): React.ReactElement => {
  const state = useMasterUserState();
  const pagination = usePagination(MOCK_USERS);
  
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

  return <MasterUserComponent {...state} {...pagination} columns={columns} onSubmit={handleFormSubmit} />;
};

export default MasterUserContainer;
