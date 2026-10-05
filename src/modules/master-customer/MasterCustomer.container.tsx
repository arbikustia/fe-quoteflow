import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { MasterCustomerComponent } from "./MasterCustomer.component";
import type { CustomerData, GetColumnsParams } from "./MasterCustomer.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_CUSTOMERS } from "../../fixture/master-customer";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<CustomerData>[] => [
  { 
    key: "no", 
    header: "No", 
    align: "center", 
    render: (_: CustomerData, index: number): React.ReactElement => <span className="text-sm text-brand-text-medium font-medium">{(currentPage - 1) * pageSize + index + 1}</span> 
  },
  { key: "name", header: "Customer Name" },
  { key: "phoneNumber", header: "Phone" },
  { 
    key: "status", 
    header: "Status", 
    align: "center",
    render: (row: CustomerData): React.ReactElement => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        {row.status}
      </span>
    )
  },
  { key: "createAt", header: "Created At", render: (row: CustomerData): string => row.createAt },
  { 
    key: "actions", 
    header: "Action", 
    align: "center", 
    render: (row: CustomerData): React.ReactElement => (
      <div className="flex items-center justify-center">
        <button
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(row); }}
          className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
          title="Edit Customer"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>
      </div>
    )
  },
];

const MasterCustomerContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_CUSTOMERS);

  const goCreate = (): void => { navigate("/master-customer/create"); };
  const goEdit = (c: CustomerData): void => { navigate(`/master-customer/edit/${c.id}`); };
  const goDetail = (c: CustomerData): void => { navigate(`/master-customer/detail/${c.id}`); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterCustomerComponent
      {...pagination}
      columns={columns}
      onCreate={goCreate}
      onEdit={goEdit}
      onRowClick={goDetail}
    />
  );
};

export default MasterCustomerContainer;
