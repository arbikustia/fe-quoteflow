import * as React from "react";
import { FiChevronRight, FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { ItemData, MasterItemProps } from "./MasterItem.type";

const _renderListState = (props: MasterItemProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading items…</p>;
  if (props.isMissingData) return <p className="py-10 text-center text-sm text-red-600">Item data is unavailable. Please try again.</p>;
  if (props.errorMessage) return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No items found.</p>;
  return null;
};

const _renderItemCard = (item: ItemData, onRowClick: MasterItemProps["onRowClick"], onEdit: MasterItemProps["onEdit"]): React.ReactElement => {
  const handleEdit = (event: React.MouseEvent): void => { event.stopPropagation(); onEdit(item); };
  return (
    <div role="button" tabIndex={0} onClick={() => onRowClick(item)} className="rounded-2xl border border-border-default bg-background-surface p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {item.image ? <img src={item.image} alt={item.name} className="h-10 w-10 shrink-0 rounded-xl object-cover" /> : <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 font-bold text-brand-blue">{item.name.charAt(0).toUpperCase()}</div>}
          <div className="min-w-0"><h4 className="truncate text-base font-semibold text-text-primary">{item.name}</h4><span className="text-xs text-text-tertiary">ID: {item.id.slice(0, 8)}</span></div>
        </div>
        <div className="flex shrink-0 items-center gap-2"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{item.status}</span><button type="button" aria-label="Edit item" onClick={handleEdit} className="rounded-lg p-1.5 text-text-tertiary hover:bg-background-subtle hover:text-brand-blue"><FiEdit2 className="h-4 w-4" /></button></div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1 border-t border-border-default/60 pt-3 text-sm text-text-secondary"><span className="truncate">Category: {item.categoryId || "-"}</span><span className="text-right">Stock: {item.stock}</span><span>Rp {item.price.toLocaleString("id-ID")}</span><span className="text-right">Duration: {item.duration}</span></div>
      <div className="flex justify-end pt-2 text-xs font-medium text-brand-blue">Lihat detail <FiChevronRight className="ml-1 h-3.5 w-3.5" /></div>
    </div>
  );
};

const _renderMobile = (props: MasterItemProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  return <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16"><div className="flex items-center gap-3"><div className="flex-1"><SearchFilter placeholder="Search item" onChange={handleSearch} /></div><button type="button" onClick={props.onCreate} className="shrink-0 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-brand-white">Create Item</button></div><div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map((item) => <React.Fragment key={item.id}>{_renderItemCard(item, props.onRowClick, props.onEdit)}</React.Fragment>)}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" /></div>;
};

const _renderDesktop = (props: MasterItemProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  return <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6"><div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search item" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-brand-white">Create Item</button></div><div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} onRowClick={props.onRowClick} keyExtractor={(row: ItemData) => row.id} />}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} /></div>;
};

export const MasterItemComponent = (props: MasterItemProps): React.ReactElement => <Layout pageTitle="Item List"><PageLayout title="Item List" breadcrumbs={["Master", "Master Item"]} onBack={props.onBack}><div className="flex h-full flex-col px-3 pb-18 lg:-mt-4 lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
