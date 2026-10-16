import * as React from "react";

import { CategoryDetailModal } from "./order-components/CategoryDetailModal.component";
import { ItemDetailModal } from "./order-components/ItemDetailModal.component";
import type { BaseOrderState, OrderProps, OrderTabsProps, QuoteData } from "./Order.type";
import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import ConfirmModal from "../../components/ConfirmModal";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";
import { Tabs } from "../../components/Tabs";

/** Render reusable order tabs. */
const _renderTabs = ({ activeTab, setActiveTab, statusCounts, TABS }: OrderTabsProps): React.ReactElement => {
  const handleTabChange = (id: string): void => {
    const tab = TABS.find((item) => item === id);

    if (tab) setActiveTab(tab);
  };

  return <Tabs activeId={activeTab} onChange={handleTabChange} items={TABS.map((tab) => ({ id: tab, label: tab.replace("All Orders", "All"), count: statusCounts[tab] }))} />;
};

/** Render empty state. */
const _renderListState = (props: OrderProps): React.ReactElement | null => {
  if (props.paginatedData.length === 0) return <p className="py-10 text-center text-sm text-brand-text-medium">No orders found.</p>;

  return null;
};

/** Render mobile order card. */
const _renderMobileCard = (order: QuoteData): React.ReactElement => (
  <div key={order.id} className="rounded-2xl border border-border-default bg-background-surface p-4 shadow-xs">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0"><h4 className="truncate text-base font-semibold text-text-primary">{order.name}</h4><p className="mt-1 truncate text-sm text-text-secondary">{order.location}</p></div>
      <span className="shrink-0 rounded-full bg-background-subtle px-2.5 py-0.5 text-xs font-semibold text-text-secondary">{order.status}</span>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border-default pt-3 text-sm text-text-secondary"><span>{order.startDate}</span><span className="text-right">{order.qty} item(s)</span></div>
  </div>
);

/** Render mobile toolbar. */
const _renderMobileToolbar = (props: OrderProps): React.ReactElement => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return <div className="flex w-full items-center justify-between gap-3 bg-transparent"><div className="flex-1"><SearchFilter placeholder="Search order" onChange={handleSearchChange} /></div><button type="button" onClick={props.openCreateModal} className="shrink-0 rounded-xl bg-brand-blue h-14 px-5 text-sm font-semibold text-brand-white shadow-sm transition-colors hover:bg-brand-blue/90">Create Order</button></div>;
};

/** Render mobile cards. */
const _renderMobileCards = (props: OrderProps): React.ReactElement => (
  <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16">
    {_renderMobileToolbar(props)}
    {_renderTabs(props)}
    <div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map(_renderMobileCard)}</div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface h-14 px-5 shadow-xs" />
  </div>
);

/** Render desktop table. */
const _renderDesktopTable = (props: OrderProps): React.ReactElement => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden lg:px-6 md:flex bg-brand-white rounded-4xl border border-brand-gray-light shadow-xs flex-col flex-1 overflow-hidden mt-6">
      <div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search order" onChange={handleSearchChange} /><button type="button" onClick={props.openCreateModal} className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white shadow-sm transition-colors hover:bg-brand-blue/90">Create Order</button></div>
      {_renderTabs(props)}
      <div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} keyExtractor={(row) => row.id} />}</div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
    </div>
  );
};

/** Render order modals. */
const _renderModals = (props: BaseOrderState): React.ReactElement => (
  <>
    <ConfirmModal isOpen={props.isConfirmModalOpen} onClose={props.closeConfirmModal} onConfirm={props.onConfirmDelete} title="Delete Order" message={`Are you sure you want to delete order "${props.deletingQuote?.name}"? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" isDestructive={true} />
    {props.closeViewItemsModal && <ItemDetailModal isOpen={!!props.viewingItemsQuote} onClose={props.closeViewItemsModal} quote={props.viewingItemsQuote} />}
    {props.closeViewCategoriesModal && <CategoryDetailModal isOpen={!!props.viewingCategoriesQuote} onClose={props.closeViewCategoriesModal} quote={props.viewingCategoriesQuote} />}
  </>
);

/** Render responsive order list page. */
export const OrderComponent = (props: OrderProps): React.ReactElement => (
  <Layout pageTitle="Order List">
    <PageLayout title="Order List" breadcrumbs={["Order", "Order List"]} onBack={props.onBack}>
      <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">{_renderMobileCards(props)}{_renderDesktopTable(props)}</div>
    </PageLayout>
    {_renderModals(props)}
  </Layout>
);
