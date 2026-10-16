import * as React from "react";

import { CategoryDetailModal } from "./components/CategoryDetailModal.component";
import { PageLayout } from "../../../app/shared/PageLayout";
import { SearchFilter } from "../../../components/SearchFilter";
import { ItemDetailModal } from "./components/ItemDetailModal.component";
import type { BaseDesktopOrderState, DesktopOrderProps, OrderHeaderProps, OrderTableContainerProps, OrderTabsProps, OrderToolbarProps, TabType } from "./DesktopOrder.type";
import ConfirmModal from "../../../components/ConfirmModal";
import { Icons } from "../../../components/Icons";
import { Pagination } from "../../../components/Pagination";
import Table from "../../../components/Table";

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
        /**
         *
         */
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
const OrderToolbar = ({ setSearchTerm }: OrderToolbarProps): React.ReactElement => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);
  return (
    <div className="flex items-center justify-between p-4 px-6 border-b border-brand-gray-light">
      <SearchFilter placeholder="Search order" onChange={handleSearchChange} />
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
const OrderTableContainer = ({ paginatedData, columns, currentPage, totalPages, pageSize, goToPage, changePageSize }: Omit<OrderTableContainerProps, keyof OrderTabsProps | "totalCount" | "setSearchTerm">): React.ReactElement => (
  <>
    <div className="flex-1 overflow-auto">
      <Table data={paginatedData} columns={columns} keyExtractor={(row) => row.id} />
    </div>
    <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={goToPage} onPageSizeChange={changePageSize} />
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
    <PageLayout title="Order List" breadcrumbs={["Order", "Order List"]} onBack={props.onBack}>
        <div className="flex flex-col h-full px-3 lg:px-0 lg:-mt-4">
          <OrderHeader openCreateModal={props.openCreateModal} />

      <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
        <OrderTabs activeTab={props.activeTab} setActiveTab={props.setActiveTab} statusCounts={props.statusCounts} TABS={props.TABS} />
        <OrderToolbar pageSize={props.pageSize} totalCount={props.totalCount} changePageSize={props.changePageSize} setSearchTerm={props.setSearchTerm} />
        <OrderTableContainer
          paginatedData={props.paginatedData}
          columns={props.columns}
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          pageSize={props.pageSize}
          changePageSize={props.changePageSize}
          goToPage={props.goToPage}
          nextPage={props.nextPage}
          prevPage={props.prevPage}
        />
      </div>
          <OrderModals {...props} />
        </div>
      </PageLayout>
  );
};
