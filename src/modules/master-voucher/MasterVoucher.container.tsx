import * as React from "react";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MasterVoucherComponent } from "./MasterVoucher.component";
import type { VoucherData, GetColumnsParams } from "./MasterVoucher.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_VOUCHERS } from "../../fixture/master-voucher";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({ currentPage, pageSize, onEdit }: GetColumnsParams): TableColumn<VoucherData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    render: (_: VoucherData, index: number): React.ReactElement => <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>
  },
  { key: "code", header: "Voucher Code" },
  { key: "discountPercent", header: "Discount (%)", align: "center", render: (row: VoucherData): string => `${row.discountPercent}%` },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row: VoucherData): React.ReactElement => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        {row.status}
      </span>
    )
  },
  { key: "createAt", header: "Created At", render: (row: VoucherData): string => row.createAt },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row: VoucherData): React.ReactElement => (
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

const MasterVoucherContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_VOUCHERS);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-voucher/create"); };
  const goEdit = (c: VoucherData): void => { navigate(`/master-voucher/edit/${c.id}`); };
  const goDetail = (c: VoucherData): void => { navigate(`/master-voucher/detail/${c.id}`); };
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };
  const goDelete = (): void => { setIsMoreOpen(false); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterVoucherComponent
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

export default MasterVoucherContainer;
