import * as React from "react";
import { FiChevronRight, FiUser, FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { MasterPicProps, PicData } from "./MasterPic.type";

const _renderListState = (props: MasterPicProps): React.ReactElement | null => {
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No PICs found.</p>;

  return null;
};

const _renderPicCard = (pic: PicData, onRowClick: MasterPicProps["onRowClick"], onEdit: MasterPicProps["onEdit"]): React.ReactElement => {
  const handleCardClick = (): void => { onRowClick(pic); };
  const handleEdit = (event: React.MouseEvent): void => { event.stopPropagation(); onEdit(pic); };

  return <div role="button" tabIndex={0} onClick={handleCardClick} className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-border-default bg-background-surface p-4 shadow-xs active:bg-background-subtle/50"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-2.5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue"><FiUser className="h-5 w-5" /></div><div className="min-w-0"><h4 className="truncate text-base font-semibold text-text-primary">{pic.name}</h4><span className="text-xs text-text-tertiary">{pic.createAt || "-"}</span></div></div><div className="flex shrink-0 items-center gap-2"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pic.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{pic.status}</span><button type="button" aria-label="Edit PIC" onClick={handleEdit} className="rounded-lg p-1.5 text-text-tertiary hover:bg-background-subtle hover:text-brand-blue"><FiEdit2 className="h-4 w-4" /></button></div></div><div className="flex justify-end text-xs font-medium text-brand-blue">Lihat detail <FiChevronRight className="ml-1 h-3.5 w-3.5" /></div></div>;
};

const _renderMobile = (props: MasterPicProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => { props.setSearchTerm(event.target.value); };

  return <div className="lg:hidden flex min-w-0 flex-col gap-4 pt-2 pb-16"><div className="flex items-center gap-3"><div className="flex-1"><SearchFilter placeholder="Search PIC" onChange={handleSearch} /></div><button type="button" onClick={props.onCreate} className="shrink-0 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-brand-white">Create PIC</button></div><div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map((pic) => <React.Fragment key={pic.id}>{_renderPicCard(pic, props.onRowClick, props.onEdit)}</React.Fragment>)}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" /></div>;
};

const _renderDesktop = (props: MasterPicProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => { props.setSearchTerm(event.target.value); };
  const keyExtractor = (row: PicData): string => row.id;

  return <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6"><div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search PIC" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-brand-white">Create PIC</button></div><div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} onRowClick={props.onRowClick} keyExtractor={keyExtractor} />}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} /></div>;
};

export const MasterPicComponent = (props: MasterPicProps): React.ReactElement => <Layout pageTitle="PIC List"><PageLayout title="PIC List" breadcrumbs={["Master", "Master PIC"]} onBack={props.onBack}><div className="flex h-full flex-col px-3 pb-18 lg:-mt-4 lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
