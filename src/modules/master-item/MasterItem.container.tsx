import * as React from "react";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MasterItemComponent, ItemActionButtons } from "./MasterItem.component";
import type { GetColumnsParams, ItemData } from "./MasterItem.type";
import type { TableColumn } from "../../components/Table";
import { MOCK_ITEMS } from "../../fixture/master-item";
import { usePagination } from "../../hooks/usePagination";

const getColumns = ({
  currentPage,
  pageSize,
  onEdit,
}: GetColumnsParams): TableColumn<ItemData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    render: (_row: ItemData, index: number): React.ReactElement => (
      <span className="text-brand-text-medium font-medium text-sm">
        {(currentPage - 1) * pageSize + index + 1}
      </span>
    ),
  },
  {
    key: "image",
    header: "Image",
    align: "center",
    render: (row: ItemData): React.ReactElement => (
      <img src={row.image} alt={row.name} className="w-10 h-10 rounded-lg object-cover mx-auto border border-brand-gray-light" onError={(e): void => { (e.target as HTMLImageElement).style.display = "none"; }} />
    ),
  },
  { key: "name", header: "Item Name" },
  { key: "category", header: "Category" },
  {
    key: "price",
    header: "Price",
    render: (row: ItemData): string => "Rp " + row.price.toLocaleString("id-ID"),
  },
  { key: "stock", header: "Stock", align: "center" },
  { key: "duration", header: "Duration", align: "center" },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row: ItemData): React.ReactElement => (
      <span className={"px-3 py-1 rounded-full text-xs font-bold uppercase " + (row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
        {row.status}
      </span>
    ),
  },
  { key: "remark", header: "Remark" },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row: ItemData): React.ReactElement => (
      <ItemActionButtons row={row} onEdit={onEdit} onConfirm={() => {}} />
    ),
  },
];

const MasterItemContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const pagination = usePagination(MOCK_ITEMS);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-item/create"); };
  const goEdit = (item: ItemData): void => { navigate(`/master-item/edit/${item.id}`); };
  const goDetail = (item: ItemData): void => { navigate(`/master-item/detail/${item.id}`); };
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };
  const goDelete = (): void => { setIsMoreOpen(false); console.log("Delete triggered"); };

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
    onConfirm: () => {},
  });

  return (
    <MasterItemComponent
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

export default MasterItemContainer;
