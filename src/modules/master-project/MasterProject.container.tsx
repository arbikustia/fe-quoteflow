import * as React from "react";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MasterProjectComponent } from "./MasterProject.component";
import type { GetColumnsParams, ProjectData } from "./MasterProject.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_ITEMS } from "../../fixture/master-item";
import { MOCK_PROJECTS } from "../../fixture/master-project";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({
  currentPage,
  pageSize,
  onEdit,
}: GetColumnsParams): TableColumn<ProjectData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    render: (_row: ProjectData, index: number): React.ReactElement => (
      <span className="text-brand-text-medium font-medium text-sm">
        {(currentPage - 1) * pageSize + index + 1}
      </span>
    ),
  },
  { key: "name", header: "Project Name" },
  {
    key: "items",
    header: "Items",
    render: (row: ProjectData): React.ReactElement => {
      const names = row.items.map((it) => {
        const found = MOCK_ITEMS.find((m) => m.id === it.itemId);
        return found ? found.name + " x" + it.qty : it.itemId + " x" + it.qty;
      });
      return (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-brand-blue">{row.items.length} item(s)</span>
          <span className="text-xs text-brand-text-medium truncate max-w-[220px]">{names.join(", ")}</span>
        </div>
      );
    },
  },
  { key: "remark", header: "Remark" },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row: ProjectData): React.ReactElement => (
      <span className={"px-3 py-1 rounded-full text-xs font-bold uppercase " + (row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
        {row.status}
      </span>
    ),
  },
  { key: "createBy", header: "Created By" },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row: ProjectData): React.ReactElement => (
      <button
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(row); }}
        className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
        title="Edit"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
    ),
  },
];

const MasterProjectContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_PROJECTS);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-project/create"); };
  const goEdit = (p: ProjectData): void => { navigate(`/master-project/edit/${p.id}`); };
  const goDetail = (p: ProjectData): void => { navigate(`/master-project/detail/${p.id}`); };
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };
  const goDelete = (): void => { setIsMoreOpen(false); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterProjectComponent
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

export default MasterProjectContainer;
