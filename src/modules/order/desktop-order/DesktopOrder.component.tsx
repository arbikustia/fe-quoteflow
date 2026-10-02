import * as React from "react";

import Layout from "../../../app/layout";
import ConfirmModal from "../../../components/ConfirmModal";
import { Icons } from "../../../components/Icons";
import { PaginationFooter, PaginationHeader } from "../../../components/Pagination";
import Table from "../../../components/Table";

import { CategoryDetailModal } from "./components/CategoryDetailModal.component";
import { ItemDetailModal } from "./components/ItemDetailModal.component";
import type { BaseDesktopOrderState, DesktopOrderProps, OrderHeaderProps, OrderTableContainerProps, OrderTabsProps, OrderToolbarProps, TabType } from "./DesktopOrder.type";

/**
 * Render order header
 * @param {OrderHeaderProps} props - component props
 * @returns {React.ReactElement} - Header
 */
const OrderHeader = ({ openCreateModal }: OrderHeaderProps): React.ReactElement => (
  <div className="flex justify-between items-center mb-6">
    <span className="text-2xl font-bold text-brand-text-dark">Orders</span>
    <button
      onClick={openCreateModal}
      className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer"
    >
      Create Order
    </button>
  </div>
);

/**
 * Render order tabs
 * @param {OrderTabsProps} props - component props
 * @returns {React.ReactElement} - Header
 */
const OrderTabs = ({ activeTab, setActiveTab, statusCounts, TABS }: OrderTabsProps): React.ReactElement => (
  <div className="flex items-center justify-between border-b border-brand-gray-light px-6">
    <div className="flex items-center gap-6 overflow-x-auto">
      {TABS.map((tab: TabType) => {
        const isActive = activeTab === tab;
        const _handleTabClick = (): void => setActiveTab(tab);

        return (
          <button
            key={tab}
            onClick={_handleTabClick}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm cursor-pointer whitespace-nowrap transition-colors ${isActive ? "border-brand-blue text-brand-blue font-bold" : "border-transparent text-brand-text-medium hover:text-brand-text-dark font-medium"}`}
          >
            {tab === "All Orders" && <span className={isActive ? "text-brand-blue" : "text-brand-text-medium"}>☆</span>}
            {tab}{" "}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-brand-blue-light text-brand-blue-dark" : "bg-brand-gray-light text-brand-text-medium"}`}>
              {statusCounts[tab]}
            </span>
          </button>
        );
      })}
    </div>
    <div className="flex items-center gap-3">
      <button className="flex items-center gap-2 px-3 py-1.5 border border-brand-gray-light rounded-lg text-sm font-medium text-brand-text-medium hover:bg-brand-gray-light transition-colors cursor-pointer">
        <Icons.ChevronDown /> Sort
      </button>
      <button className="flex items-center gap-2 px-3 py-1.5 border border-brand-gray-light rounded-lg text-sm font-medium text-brand-text-medium hover:bg-brand-gray-light transition-colors cursor-pointer">
        <span>Y</span> Filter
      </button>
    </div>
  </div>
);

/**
 * Render order toolbar
 * @param {OrderToolbarProps} props - component props
 * @returns {React.ReactElement} - Toolbar
 */
const OrderToolbar = ({ pageSize, totalCount, changePageSize }: OrderToolbarProps): React.ReactElement => {
  const _handlePageSizeChange = (size: number): void => changePageSize(size);

  return (
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
      <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={_handlePageSizeChange} />
    </div>
  );
};

/**
 * Render order table container
 * @param {object} props - component props
 * @param {QuoteData[]} props.paginatedData - paginated data
 * @param {TableColumn<QuoteData>[]} props.columns - table columns
 * @param {number} props.currentPage - current page
 * @param {number} props.totalPages - total pages
 * @param {(p: number) => void} props.goToPage - go to page handler
 * @param {() => void} props.nextPage - next page handler
 * @param {() => void} props.prevPage - prev page handler
 * @returns {React.ReactElement} - TableContainer
 */
const OrderTableContainer = ({ paginatedData, columns, currentPage, totalPages, goToPage, nextPage, prevPage }: Omit<OrderTableContainerProps, keyof OrderTabsProps | keyof OrderToolbarProps>): React.ReactElement => (
  <>
    <div className="flex-1 overflow-auto">
      <Table data={paginatedData} columns={columns} keyExtractor={(row) => row.id} />
    </div>

    <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
  </>
);

/**
 * Render order modals
 * @param {BaseDesktopOrderState} props - component props
 * @returns {React.ReactElement} node
 */
const OrderModals = (props: BaseDesktopOrderState): React.ReactElement => (
  <>
    <ConfirmModal
      isOpen={props.isConfirmModalOpen}
      onClose={props.closeConfirmModal}
      onConfirm={props.onConfirmDelete}
      title="Delete Order"
      message={`Are you sure you want to delete order "${props.deletingQuote?.name}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      isDestructive={true}
    />
    {props.closeViewItemsModal && (
      <ItemDetailModal isOpen={!!props.viewingItemsQuote} onClose={props.closeViewItemsModal} quote={props.viewingItemsQuote} />
    )}
    {props.closeViewCategoriesModal && (
      <CategoryDetailModal isOpen={!!props.viewingCategoriesQuote} onClose={props.closeViewCategoriesModal} quote={props.viewingCategoriesQuote} />
    )}
  </>
);

/**
 * Render Order Page Component
 * @param {DesktopOrderProps} props - component props
 * @returns {React.ReactElement} order page element
 */
export const DesktopOrderComponent = (props: DesktopOrderProps): React.ReactElement => {
  return (
    <Layout>
      <div className="flex flex-col h-full">
        <OrderHeader openCreateModal={props.openCreateModal} />

        <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
          <OrderTabs activeTab={props.activeTab} setActiveTab={props.setActiveTab} statusCounts={props.statusCounts} TABS={props.TABS} />
          <OrderToolbar pageSize={props.pageSize} totalCount={props.totalCount} changePageSize={props.changePageSize} />
          <OrderTableContainer
            paginatedData={props.paginatedData}
            columns={props.columns}
            currentPage={props.currentPage}
            totalPages={props.totalPages}
            goToPage={props.goToPage}
            nextPage={props.nextPage}
            prevPage={props.prevPage}
          />
        </div>
      </div>
      <OrderModals {...props} />
    </Layout>
  );
};
