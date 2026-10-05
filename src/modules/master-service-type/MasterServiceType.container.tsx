import * as React from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MasterServiceTypeComponent } from "./MasterServiceType.component";
import type { GetColumnsParams, ServiceTypeData } from "./MasterServiceType.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_SERVICE_TYPES } from "../../fixture/master-service-type";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<ServiceTypeData>[] => [
  { 
    key: "no", 
    header: "No", 
    align: "center", 
    render: (_row: ServiceTypeData, index: number) => <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span> 
  },
  { key: "name", header: "Service Name" },
  { 
    key: "price", 
    header: "Price",
    render: (row: ServiceTypeData) => <span>Rp {row.price.toLocaleString("id-ID")}</span>
  },
  {
    key: "isActive",
    header: "Active",
    align: "center",
    render: (row: ServiceTypeData) => (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.isActive ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
        {row.isActive ? "Yes" : "No"}
      </span>
    )
  },
  { 
    key: "status", 
    header: "Status", 
    align: "center",
    render: (row: ServiceTypeData) => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        {row.status}
      </span>
    )
  },
  { key: "createAt", header: "Created At" },
  { 
    key: "actions", 
    header: "Action", 
    align: "center", 
    render: (row: ServiceTypeData): React.ReactElement => (
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

const MasterServiceTypeContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_SERVICE_TYPES);

  const goCreate = (): void => { navigate("/master-service-type/create"); };
  const goEdit = (s: ServiceTypeData): void => { navigate(`/master-service-type/edit/${s.id}`); };
  const goDetail = (s: ServiceTypeData): void => { navigate(`/master-service-type/detail/${s.id}`); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterServiceTypeComponent
      {...pagination}
      columns={columns}
      onCreate={goCreate}
      onEdit={goEdit}
      onRowClick={goDetail}
    />
  );
};

export default MasterServiceTypeContainer;
