import * as React from "react";
import { FiCalendar, FiDownload, FiEdit2, FiMapPin, FiTrash2 } from "react-icons/fi";

import type { TableColumn } from "../../components/Table";
import { MOCK_QUOTES } from "../../fixture/quotes";
import { usePagination } from "../../hooks/usePagination";
import { generateQuotePDF } from "../../utils/pdfGenerator";

import { OrderPageComponent } from "./OrderPage.component";
import { useOrderPageState } from "./OrderPage.hook";
import type { GetColumnsParams, QuoteData, TabType } from "./OrderPage.type";

/**
 * Render category column
 * @param {object} props - props
 * @param {QuoteData} props.row - row
 * @param {(q: QuoteData) => void} [props.openViewCategoriesModal] - modal handler
 * @returns {React.ReactElement} node
 */
const CategoryColumn = ({ row, openViewCategoriesModal }: { row: QuoteData, openViewCategoriesModal?: (q: QuoteData) => void }): React.ReactElement => {
  const categories = React.useMemo(() => row.category.split(',').map((c) => c.trim()).filter(Boolean), [row.category]);
  const onClick = React.useCallback(() => openViewCategoriesModal?.(row), [openViewCategoriesModal, row]);

  return (
    <div className="flex items-center">
      {openViewCategoriesModal ? (
        <button
          onClick={onClick}
          className="group flex items-center gap-2 px-3 py-1.5 bg-brand-blue-light hover:bg-brand-blue-light text-brand-blue rounded-lg transition-colors text-xs font-semibold cursor-pointer border border-brand-blue-light"
        >
          <span>{categories.length} Categories</span>
          <span className="text-[10px] text-brand-blue group-hover:text-brand-blue">(View Detail)</span>
        </button>
      ) : (
        <span className="text-xs font-medium text-brand-text-medium">{categories.length} categories</span>
      )}
    </div>
  );
};

/**
 * Render items column
 * @param {object} props - props
 * @param {QuoteData} props.row - row
 * @param {(q: QuoteData) => void} [props.openViewItemsModal] - modal handler
 * @returns {React.ReactElement} node
 */
const ItemsColumn = ({ row, openViewItemsModal }: { row: QuoteData, openViewItemsModal?: (q: QuoteData) => void }): React.ReactElement => {
  const onClick = React.useCallback(() => openViewItemsModal?.(row), [openViewItemsModal, row]);

  return (
    <div className="flex items-center">
      {openViewItemsModal ? (
        <button
          onClick={onClick}
          className="group flex items-center gap-2 px-3 py-1.5 bg-brand-blue-light hover:bg-brand-blue-light text-brand-blue rounded-lg transition-colors text-xs font-semibold cursor-pointer border border-brand-blue-light"
        >
          <span>{row.selectedItems.length} Items</span>
          <span className="text-[10px] text-brand-blue group-hover:text-brand-blue">(View Detail)</span>
        </button>
      ) : (
        <span className="text-xs font-medium text-brand-text-medium">{row.selectedItems.length} items</span>
      )}
    </div>
  );
};

/**
 * Render action column
 * @param {object} props - props
 * @param {QuoteData} props.row - row
 * @param {(q: QuoteData) => void} props.openEditModal - modal handler
 * @param {(q: QuoteData) => void} props.openConfirmModal - modal handler
 * @returns {React.ReactElement} node
 */
const ActionColumn = ({ row, openEditModal, openConfirmModal }: { row: QuoteData, openEditModal: (q: QuoteData) => void, openConfirmModal: (q: QuoteData) => void }): React.ReactElement => {
  const onEdit = React.useCallback(() => openEditModal(row), [openEditModal, row]);
  const onConfirm = React.useCallback(() => openConfirmModal(row), [openConfirmModal, row]);
  const onDownload = React.useCallback(() => generateQuotePDF(row), [row]);

  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={onEdit} className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer" title="Edit Order">
        <FiEdit2 className="w-4 h-4" />
      </button>
      <button onClick={onConfirm} className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer" title="Delete Order">
        <FiTrash2 className="w-4 h-4" />
      </button>
      <button onClick={onDownload} className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer" title="Download PDF">
        <FiDownload className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Render date range column
 * @param {object} props - props
 * @param {QuoteData} props.row - row
 * @returns {React.ReactElement} node
 */
const DateRangeColumn = ({ row }: { row: QuoteData }): React.ReactElement => (
  <div className="flex items-center gap-2 text-xs font-medium text-brand-text-dark bg-brand-gray-light px-2.5 py-1.5 rounded-lg border border-brand-gray-light w-fit">
    <FiCalendar className="w-3.5 h-3.5 text-brand-blue" />
    <span>{new Date(row.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} - {new Date(row.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
  </div>
);

/**
 * Get basic table columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<QuoteData>[]} basic columns
 */
const getBasicColumns = (currentPage: number, pageSize: number): TableColumn<QuoteData>[] => [
  {
    key: "checkbox",
    header: <input type="checkbox" className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer" />,
    /**
     * Render checkbox
     * @returns {React.ReactElement} node
     */
    render: (): React.ReactElement => <input type="checkbox" className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer" />,
  },
  {
    key: "no",
    header: "No",
    align: "center",
    /**
     * Render index
     * @param {QuoteData} _ - row
     * @param {number} index - index
     * @returns {React.ReactElement} node
     */
    render: (_, index): React.ReactElement => (
      <span className="text-brand-text-medium font-medium text-sm">{(currentPage - 1) * pageSize + index + 1}</span>
    ),
  },
  {
    key: "name",
    header: "Event Info",
    /**
     * Render event info
     * @param {QuoteData} row - row
     * @returns {React.ReactElement} node
     */
    render: (row): React.ReactElement => (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-brand-text-dark text-sm">{row.name}</span>
        <div className="flex items-center gap-1 text-[11px] text-brand-text-medium">
          <FiMapPin className="w-3 h-3 text-brand-blue" />
          <span>{row.location}</span>
        </div>
      </div>
    ),
  },
  {
    key: "dateRange",
    header: "Date Range",
    /**
     * Render date range
     * @param {QuoteData} row - row
     * @returns {React.ReactElement} node
     */
    render: (row): React.ReactElement => <DateRangeColumn row={row} />,
  },
];

/**
 * Get action table columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<QuoteData>[]} action columns
 */
const getActionColumns = (params: GetColumnsParams): TableColumn<QuoteData>[] => [
  {
    key: "category",
    header: "Category",
    /**
     * Render category
     * @param {QuoteData} row - row
     * @returns {React.ReactElement} node
     */
    render: (row): React.ReactElement => <CategoryColumn row={row} openViewCategoriesModal={params.openViewCategoriesModal} />,
  },
  {
    key: "selectedItems",
    header: "Items",
    /**
     * Render items
     * @param {QuoteData} row - row
     * @returns {React.ReactElement} node
     */
    render: (row): React.ReactElement => <ItemsColumn row={row} openViewItemsModal={params.openViewItemsModal} />,
  },
  {
    key: "qty",
    header: "Qty",
    align: "center",
    /**
     * Render qty
     * @param {QuoteData} row - row
     * @returns {React.ReactElement} node
     */
    render: (row): React.ReactElement => <span className="font-bold text-brand-text-dark bg-brand-gray-light w-7 h-7 flex items-center justify-center rounded-full border border-brand-gray-light mx-auto text-xs">{row.qty}</span>,
  },
  {
    key: "action",
    header: "Action",
    align: "center",
    /**
     * Render action
     * @param {QuoteData} row - row
     * @returns {React.ReactElement} node
     */
    render: (row): React.ReactElement => <ActionColumn row={row} openEditModal={params.openEditModal} openConfirmModal={params.openConfirmModal} />,
  },
];

/**
 * Get table columns
 * @param {GetColumnsParams} params - params
 * @returns {TableColumn<QuoteData>[]} table columns
 */
const getColumns = (params: GetColumnsParams): TableColumn<QuoteData>[] => [
  ...getBasicColumns(params.currentPage, params.pageSize),
  ...getActionColumns(params),
];

const TABS: readonly TabType[] = ["All Orders", "Pending Payment", "Confirmed", "On Rental", "Returned", "Completed", "Cancel"] as const;

/**
 * useOrderTabs hook
 * @returns {object} tabs logic
 */
const useOrderTabs = (): { activeTab: TabType, setActiveTab: (t: TabType) => void, statusCounts: Record<string, number>, filteredQuotes: QuoteData[] } => {
  const [activeTab, setActiveTab] = React.useState<TabType>("All Orders");

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { "All Orders": MOCK_QUOTES.length, "Pending Payment": 0, "Confirmed": 0, "On Rental": 0, "Returned": 0, "Completed": 0, "Cancel": 0 };

    MOCK_QUOTES.forEach((quote) => {
      if (quote.status && counts[quote.status] !== undefined) counts[quote.status]++;
    });

    return counts;
  }, []);

  const filteredQuotes = React.useMemo(() => {
    if (activeTab === "All Orders") return MOCK_QUOTES;

    return MOCK_QUOTES.filter((quote) => quote.status === activeTab);
  }, [activeTab]);

  return { activeTab, setActiveTab, statusCounts, filteredQuotes };
};

/**
 * Render Order Page Container
 * @returns {React.ReactElement} - Order Page Container
 */
const OrderPageContainer = (): React.ReactElement => {
  const state = useOrderPageState();
  const { activeTab, setActiveTab, statusCounts, filteredQuotes } = useOrderTabs();
  const pagination = usePagination(filteredQuotes);

  const columns = React.useMemo(() => getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    openViewCategoriesModal: state.openViewCategoriesModal,
    openViewItemsModal: state.openViewItemsModal,
    openEditModal: state.openEditModal,
    openConfirmModal: state.openConfirmModal,
  }), [pagination.currentPage, pagination.pageSize, state.openViewCategoriesModal, state.openViewItemsModal, state.openEditModal, state.openConfirmModal]);

  return (
    <OrderPageComponent
      {...state}
      {...pagination}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      statusCounts={statusCounts}
      TABS={TABS}
      columns={columns}
    />
  );
};

export default OrderPageContainer;
