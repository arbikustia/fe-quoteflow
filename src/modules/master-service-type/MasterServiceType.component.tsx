import * as React from "react";
import { FiChevronRight, FiEdit2, FiTool } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterServiceTypeProps, ServiceTypeData } from "./MasterServiceType.type";

const _renderListState = (props: MasterServiceTypeProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading service types…</p>;
  if (props.isMissingData) return <p className="py-10 text-center text-sm text-red-600">Service type data is unavailable. Please try again.</p>;
  if (props.errorMessage) return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No service types found.</p>;
  return null;
};

const _renderServiceTypeCard = (serviceType: ServiceTypeData, onRowClick: MasterServiceTypeProps["onRowClick"], onEdit: MasterServiceTypeProps["onEdit"]): React.ReactElement => {
  const handleEdit = (event: React.MouseEvent): void => { event.stopPropagation(); onEdit(serviceType); };
  return <div role="button" tabIndex={0} onClick={() => onRowClick(serviceType)} className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-border-default bg-background-surface p-4 shadow-xs active:bg-background-subtle/50"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-2.5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue"><FiTool className="h-5 w-5" /></div><div className="min-w-0"><h4 className="truncate text-base font-semibold text-text-primary">{serviceType.name}</h4><span className="text-xs text-text-tertiary">Rp {serviceType.price.toLocaleString("id-ID")}</span></div></div><div className="flex shrink-0 items-center gap-2"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${serviceType.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{serviceType.status}</span><button type="button" aria-label="Edit service type" onClick={handleEdit} className="rounded-lg p-1.5 text-text-tertiary hover:bg-background-subtle hover:text-brand-blue"><FiEdit2 className="h-4 w-4" /></button></div></div><div className="border-t border-border-default/60 pt-2 text-sm text-text-secondary">Active: {serviceType.isActive ? "Yes" : "No"}</div><div className="flex justify-end text-xs font-medium text-brand-blue">Lihat detail <FiChevronRight className="ml-1 h-3.5 w-3.5" /></div></div>;
};

const _renderMobile = (props: MasterServiceTypeProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  return <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16"><div className="flex items-center gap-3"><div className="flex-1"><SearchFilter placeholder="Search service type" onChange={handleSearch} /></div><button type="button" onClick={props.onCreate} className="shrink-0 rounded-xl bg-brand-blue h-14 px-5 text-sm font-semibold text-brand-white">Create Service Type</button></div><div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map((serviceType) => <React.Fragment key={serviceType.id}>{_renderServiceTypeCard(serviceType, props.onRowClick, props.onEdit)}</React.Fragment>)}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface h-14 px-5 shadow-xs" /></div>;
};

const _renderDesktop = (props: MasterServiceTypeProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  return <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6"><div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search service type" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white">Create Service Type</button></div><div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} onRowClick={props.onRowClick} keyExtractor={(row: ServiceTypeData) => row.id} />}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} /></div>;
};

export const MasterServiceTypeComponent = (props: MasterServiceTypeProps): React.ReactElement => <Layout pageTitle="Service Type List"><PageLayout title="Service Type List" breadcrumbs={["Master", "Master Service Type"]} onBack={props.onBack}><div className="flex h-full flex-col px-3 pb-18 lg:-mt-4 lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
