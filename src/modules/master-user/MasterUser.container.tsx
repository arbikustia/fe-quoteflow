import * as React from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MasterUserComponent } from "./MasterUser.component";
import type { UserData, GetColumnsParams } from "./MasterUser.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_USERS } from "../../fixture/master-user";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<UserData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    render: (_: UserData, index: number): React.ReactElement => <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>
  },
  { key: "username", header: "Username" },
  {
    key: "role",
    header: "Role",
    render: (row: UserData): React.ReactElement => (
      <span className={`font-bold ${row.role === "Admin" ? "text-brand-blue" : "text-brand-text-medium"}`}>
        {row.role}
      </span>
    )
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row: UserData): React.ReactElement => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        {row.status}
      </span>
    )
  },
  { key: "createAt", header: "Created At", render: (row: UserData): string => row.createAt },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row: UserData): React.ReactElement => (
      <button
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(row); }}
        className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
        title="Edit"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
    )
  },
];

const MasterUserContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_USERS);

  const goCreate = (): void => { navigate("/master-user/create"); };
  const goEdit = (c: UserData): void => { navigate(`/master-user/edit/${c.id}`); };
  const goDetail = (c: UserData): void => { navigate(`/master-user/detail/${c.id}`); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterUserComponent
      {...pagination}
      columns={columns}
      onCreate={goCreate}
      onEdit={goEdit}
      onRowClick={goDetail}
    />
  );
};

export default MasterUserContainer;
