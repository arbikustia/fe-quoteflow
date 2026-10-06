import * as React from "react";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MasterPaymentMethodComponent } from "./MasterPaymentMethod.component";
import type { GetColumnsParams, PaymentMethodData } from "./MasterPaymentMethod.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_PAYMENT_METHODS } from "../../fixture/master-payment-method";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<PaymentMethodData>[] => [
  { 
    key: "no", 
    header: "No", 
    align: "center", 
    render: (_row: PaymentMethodData, index: number) => <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span> 
  },
  { key: "name", header: "Payment Method" },
  { key: "description", header: "Description" },
  { 
    key: "status", 
    header: "Status", 
    align: "center",
    render: (row: PaymentMethodData) => (
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
    render: (row: PaymentMethodData): React.ReactElement => (
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

const MasterPaymentMethodContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_PAYMENT_METHODS);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-payment-method/create"); };
  const goEdit = (p: PaymentMethodData): void => { navigate(`/master-payment-method/edit/${p.id}`); };
  const goDetail = (p: PaymentMethodData): void => { navigate(`/master-payment-method/detail/${p.id}`); };
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };
  const goDelete = (): void => { setIsMoreOpen(false); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterPaymentMethodComponent
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

export default MasterPaymentMethodContainer;
