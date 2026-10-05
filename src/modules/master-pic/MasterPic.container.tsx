import * as React from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MasterPicComponent } from "./MasterPic.component";
import type { PicData, GetColumnsParams } from "./MasterPic.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_PICS } from "../../fixture/master-pic";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<PicData>[] => [
  { 
    key: "no", 
    header: "No", 
    align: "center", 
    render: (_: PicData, index: number): React.ReactElement => <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span> 
  },
  { key: "name", header: "PIC Name" },
  { 
    key: "status", 
    header: "Status", 
    align: "center",
    render: (row: PicData): React.ReactElement => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        {row.status}
      </span>
    )
  },
  { key: "createAt", header: "Created At", render: (row: PicData): string => row.createAt },
  { 
    key: "actions", 
    header: "Action", 
    align: "center", 
    render: (row: PicData): React.ReactElement => (
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

const MasterPicContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_PICS);

  const goCreate = (): void => { navigate("/master-pic/create"); };
  const goEdit = (c: PicData): void => { navigate(`/master-pic/edit/${c.id}`); };
  const goDetail = (c: PicData): void => { navigate(`/master-pic/detail/${c.id}`); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterPicComponent
      {...pagination}
      columns={columns}
      onCreate={goCreate}
      onEdit={goEdit}
      onRowClick={goDetail}
    />
  );
};

export default MasterPicContainer;
