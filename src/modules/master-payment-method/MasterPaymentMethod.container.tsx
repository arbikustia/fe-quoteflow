import * as React from "react";
import { MasterPaymentMethodComponent, PaymentMethodActionButtons } from "./MasterPaymentMethod.component";
import { useMasterPaymentMethodState } from "./MasterPaymentMethod.hook";
import type { PaymentMethodData, GetColumnsParams } from "./MasterPaymentMethod.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_PAYMENT_METHODS } from "../../fixture/master-payment-method";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit, onConfirm }: GetColumnsParams): TableColumn<PaymentMethodData>[] => [
  { 
    key: "no", 
    header: "No", 
    align: "center", 
    render: (_, index) => <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span> 
  },
  { key: "name", header: "Payment Method" },
  { key: "description", header: "Description" },
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
    render: (row) => <PaymentMethodActionButtons row={row} onEdit={onEdit} onConfirm={onConfirm} /> 
  },
];

const MasterPaymentMethodContainer = (): React.ReactElement => {
  const state = useMasterPaymentMethodState();
  const pagination = usePagination(MOCK_PAYMENT_METHODS);
  
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

  return <MasterPaymentMethodComponent {...state} {...pagination} columns={columns} onSubmit={handleFormSubmit} />;
};

export default MasterPaymentMethodContainer;
