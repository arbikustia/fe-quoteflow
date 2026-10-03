import * as React from "react";
import { MasterCustomerComponent, CustomerActionButtons } from "./MasterCustomer.component";
import { useMasterCustomerState } from "./MasterCustomer.hook";
import type { CustomerData, GetColumnsParams } from "./MasterCustomer.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_CUSTOMERS } from "../../fixture/master-customer";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit, onConfirm }: GetColumnsParams): TableColumn<CustomerData>[] => [
  { 
    key: "no", 
    header: "No", 
    align: "center", 
    render: (_, index) => <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span> 
  },
  { key: "name", header: "Customer Name" },
  { key: "phoneNumber", header: "Phone" },
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
    render: (row) => <CustomerActionButtons row={row} onEdit={onEdit} onConfirm={onConfirm} /> 
  },
];

const MasterCustomerContainer = (): React.ReactElement => {
  const state = useMasterCustomerState();
  const pagination = usePagination(MOCK_CUSTOMERS);
  
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

  return <MasterCustomerComponent {...state} {...pagination} columns={columns} onSubmit={handleFormSubmit} />;
};

export default MasterCustomerContainer;
