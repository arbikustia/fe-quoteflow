import * as React from "react";
import { MasterServiceTypeComponent, ServiceTypeActionButtons } from "./MasterServiceType.component";
import { useMasterServiceTypeState } from "./MasterServiceType.hook";
import type { ServiceTypeData, GetColumnsParams } from "./MasterServiceType.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_SERVICE_TYPES } from "../../fixture/master-service-type";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit, onConfirm }: GetColumnsParams): TableColumn<ServiceTypeData>[] => [
  { 
    key: "no", 
    header: "No", 
    align: "center", 
    render: (_, index) => <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span> 
  },
  { key: "name", header: "Service Name" },
  { 
    key: "price", 
    header: "Price",
    render: (row) => <span>Rp {row.price.toLocaleString("id-ID")}</span>
  },
  {
    key: "isActive",
    header: "Active",
    align: "center",
    render: (row) => (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.isActive ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
        {row.isActive ? "Yes" : "No"}
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
  { 
    key: "actions", 
    header: "Action", 
    align: "center", 
    render: (row) => <ServiceTypeActionButtons row={row} onEdit={onEdit} onConfirm={onConfirm} /> 
  },
];

const MasterServiceTypeContainer = (): React.ReactElement => {
  const state = useMasterServiceTypeState();
  const pagination = usePagination(MOCK_SERVICE_TYPES);
  
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

  return <MasterServiceTypeComponent {...state} {...pagination} columns={columns} onSubmit={handleFormSubmit} />;
};

export default MasterServiceTypeContainer;
