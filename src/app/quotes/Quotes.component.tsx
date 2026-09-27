import * as React from "react";
import Layout from "../layout";
import Table from "../../components/Table";
import type { TableColumn } from "../../components/Table";
import ConfirmModal from "../../components/ConfirmModal";
import type { QuotesProps, QuoteData } from "./Quotes.type";
import { Icons } from "../../components/Icons";
import {
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiDownload,
} from "react-icons/fi";
import { MOCK_QUOTES } from "../../fixture/quotes";
import { generateQuotePDF } from "../../utils/pdfGenerator";
import { ItemDetailModal } from "./ItemDetailModal.component";
import { CategoryDetailModal } from "./CategoryDetailModal.component";
import { usePagination } from "../../hooks/usePagination";
import { PaginationHeader, PaginationFooter } from "../../components/Pagination";

export const QuotesComponent = (props: QuotesProps): React.ReactElement => {
  const {
    isConfirmModalOpen,
    deletingQuote,
    openCreateModal,
    openEditModal,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
    viewingItemsQuote,
    openViewItemsModal,
    closeViewItemsModal,
    viewingCategoriesQuote,
    openViewCategoriesModal,
    closeViewCategoriesModal,
  } = props;

  const TABS = ["All Orders", "Pending Payment", "Confirmed", "On Rental", "Returned", "Completed", "Cancel"] as const;

  const [activeTab, setActiveTab] = React.useState<typeof TABS[number]>("All Orders");

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      "All Orders": MOCK_QUOTES.length,
      "Pending Payment": 0,
      "Confirmed": 0,
      "On Rental": 0,
      "Returned": 0,
      "Completed": 0,
      "Cancel": 0,
    };
    MOCK_QUOTES.forEach(quote => {
      if (quote.status && counts[quote.status] !== undefined) {
        counts[quote.status]++;
      }
    });
    return counts;
  }, []);

  const filteredQuotes = React.useMemo(() => {
    if (activeTab === "All Orders") return MOCK_QUOTES;
    return MOCK_QUOTES.filter(quote => quote.status === activeTab);
  }, [activeTab]);

  const { 
    currentPage, totalPages, pageSize, paginatedData, 
    goToPage, nextPage, prevPage, changePageSize, totalCount 
  } = usePagination(filteredQuotes);

  const columns: TableColumn<QuoteData>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer"
        />
      ),
      render: () => (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer"
        />
      ),
    },
    {
      key: "no",
      header: "No",
      align: "center",
      render: (_, index) => (
        <span className="text-brand-text-medium font-medium text-sm">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      key: "name",
      header: "Event Info",
      render: (row) => (
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
      render: (row) => (
        <div className="flex items-center gap-2 text-xs font-medium text-brand-text-dark bg-brand-gray-light px-2.5 py-1.5 rounded-lg border border-brand-gray-light w-fit">
          <FiCalendar className="w-3.5 h-3.5 text-brand-blue" />
          <span>
            {new Date(row.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}{" "}
            -{" "}
            {new Date(row.endDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => {
        const categories = row.category.split(',').map(c => c.trim()).filter(Boolean);
        return (
          <div className="flex items-center">
            {openViewCategoriesModal ? (
              <button
                onClick={() => openViewCategoriesModal(row)}
                className="group flex items-center gap-2 px-3 py-1.5 bg-brand-blue-light hover:bg-brand-blue-light text-brand-blue rounded-lg transition-colors text-xs font-semibold cursor-pointer border border-brand-blue-light"
              >
                <span>{categories.length} Categories</span>
                <span className="text-[10px] text-brand-blue group-hover:text-brand-blue">
                  (View Detail)
                </span>
              </button>
            ) : (
              <span className="text-xs font-medium text-brand-text-medium">
                {categories.length} categories
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "selectedItems",
      header: "Items",
      render: (row) => (
        <div className="flex items-center">
          {openViewItemsModal ? (
            <button
              onClick={() => openViewItemsModal(row)}
              className="group flex items-center gap-2 px-3 py-1.5 bg-brand-blue-light hover:bg-brand-blue-light text-brand-blue rounded-lg transition-colors text-xs font-semibold cursor-pointer border border-brand-blue-light"
            >
              <span>{row.selectedItems.length} Items</span>
              <span className="text-[10px] text-brand-blue group-hover:text-brand-blue">
                (View Detail)
              </span>
            </button>
          ) : (
            <span className="text-xs font-medium text-brand-text-medium">
              {row.selectedItems.length} items
            </span>
          )}
        </div>
      ),
    },
    {
      key: "qty",
      header: "Qty",
      align: "center",
      render: (row) => (
        <span className="font-bold text-brand-text-dark bg-brand-gray-light w-7 h-7 flex items-center justify-center rounded-full border border-brand-gray-light mx-auto text-xs">
          {row.qty}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
            title="Edit Order"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openConfirmModal(row)}
            className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer"
            title="Delete Order"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              generateQuotePDF(row);
            }}
            className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
            title="Download PDF"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-brand-text-dark">Orders</span>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm"
          >
            Create Order
          </button>
        </div>

        <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-brand-gray-light px-6">
            <div className="flex items-center gap-6 overflow-x-auto">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 py-4 border-b-2 text-sm cursor-pointer whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-brand-blue text-brand-blue font-bold"
                        : "border-transparent text-brand-text-medium hover:text-brand-text-dark font-medium"
                    }`}
                  >
                    {tab === "All Orders" && (
                      <span className={isActive ? "text-brand-blue" : "text-brand-text-medium"}>☆</span>
                    )}
                    {tab}{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isActive
                          ? "bg-brand-blue-light text-brand-blue-dark"
                          : "bg-brand-gray-light text-brand-text-medium"
                      }`}
                    >
                      {statusCounts[tab]}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-brand-gray-light rounded-lg text-sm font-medium text-brand-text-medium hover:bg-brand-gray-light transition-colors">
                <Icons.ChevronDown /> Sort
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-brand-gray-light rounded-lg text-sm font-medium text-brand-text-medium hover:bg-brand-gray-light transition-colors">
                <span>Y</span> Filter
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-brand-gray-light">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search order"
                className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-gray-light text-brand-text-dark placeholder:text-brand-text-medium"
              />
            </div>
            <PaginationHeader 
              pageSize={pageSize} 
              totalCount={totalCount} 
              onPageSizeChange={changePageSize} 
            />
          </div>

          <div className="flex-1 overflow-auto">
            <Table
              data={paginatedData}
              columns={columns}
              keyExtractor={(row) => row.id}
            />
          </div>

          <PaginationFooter 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onNextPage={nextPage}
            onPrevPage={prevPage}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={onConfirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order "${deletingQuote?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />

      {closeViewItemsModal && (
        <ItemDetailModal
          isOpen={!!viewingItemsQuote}
          onClose={closeViewItemsModal}
          quote={viewingItemsQuote}
        />
      )}

      {closeViewCategoriesModal && (
        <CategoryDetailModal
          isOpen={!!viewingCategoriesQuote}
          onClose={closeViewCategoriesModal}
          quote={viewingCategoriesQuote}
        />
      )}
    </Layout>
  );
};
