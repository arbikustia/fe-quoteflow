import * as React from "react";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MasterRoleComponent } from "./MasterRole.component";
import type { RoleData, GetColumnsParams } from "./MasterRole.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_ROLES } from "../../fixture/master-role";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<RoleData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    render: (_: RoleData, index: number): React.ReactElement => <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>
  },
  { key: "roleName", header: "Role Name" },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row: RoleData): React.ReactElement => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        {row.status}
      </span>
    )
  },
  { key: "createAt", header: "Created At", render: (row: RoleData): string => row.createAt },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row: RoleData): React.ReactElement => (
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

const MasterRoleContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_ROLES);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-role/create"); };
  const goEdit = (c: RoleData): void => { navigate(`/master-role/edit/${c.id}`); };
  const goDetail = (c: RoleData): void => { navigate(`/master-role/detail/${c.id}`); };
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };
  const goDelete = (): void => { setIsMoreOpen(false); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterRoleComponent
      {...pagination}
      columns={columns}
      onBack={goBack}
      onCreate={goCreate}
      onEdit={goEdit}
      onRowClick={goDetail}
      onMore={toggleMore}
      isMoreOpen={isMoreOpen}
      onCloseMore={() => setIsMoreOpen(false)}
      onDelete={goDelete}
    />
  );
};

export default MasterRoleContainer;
