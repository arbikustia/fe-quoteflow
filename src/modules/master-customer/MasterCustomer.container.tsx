import * as React from "react";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import type { TableColumn } from "../../components/Table";
import { MOCK_CUSTOMERS } from "../../fixture/master-customer";
import { usePagination } from "../../hooks/usePagination";

import { MasterCustomerComponent } from "./MasterCustomer.component";
import type { CustomerData, GetColumnsParams } from "./MasterCustomer.type";

/**
 *
 * @param root0
 */
const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<CustomerData>[] => [
  { 
    key: "no", 
    header: "No", 
    align: "center", 
    /**
     *
     * @param _
     * @param index
     */
    render: (_: CustomerData, index: number): React.ReactElement => <span className="text-sm text-brand-text-medium font-medium">{(currentPage - 1) * pageSize + index + 1}</span> 
  },
  { key: "name", header: "Customer Name" },
  { key: "phoneNumber", header: "Phone" },
  { 
    key: "status", 
    header: "Status", 
    align: "center",
    /**
     *
     * @param row
     */
    render: (row: CustomerData): React.ReactElement => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        {row.status}
      </span>
    )
  },
  { key: "createAt", header: "Created At", /**
   *
   * @param row
   */
  render: (row: CustomerData): string => row.createAt },
  { 
    key: "actions", 
    header: "Action", 
    align: "center", 
    /**
     *
     * @param row
     */
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

/**
 *
 */
const MasterCustomerContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_CUSTOMERS);

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goCreate = (): void => { navigate("/master-customer/create"); };
  /**
   *
   * @param c
   */
  const goEdit = (c: CustomerData): void => { navigate(`/master-customer/edit/${c.id}`); };
  /**
   *
   * @param c
   */
  const goDetail = (c: CustomerData): void => { navigate(`/master-customer/detail/${c.id}`); };
  /**
   *
   */
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };
  /**
   *
   */
  const goDelete = (): void => { setIsMoreOpen(false); console.log("Delete triggered"); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterCustomerComponent
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

export default MasterCustomerContainer;
