import * as React from "react";

import { AlertComponent } from "@/components/Alert";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { SkeletonComponent } from "@/components/Skeleton";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { QuotationData, QuotationProps } from "./Quotation.type";

/**
 * Render quotation list state.
 * @param {QuotationProps} props - Quotation props
 * @returns {React.ReactElement | null} List state
 */
const _renderListState = (props: QuotationProps): React.ReactElement | null => {
  if (props.isMissingData) return <p className="py-10 text-center text-sm text-danger">Quotation data is unavailable. Please try again.</p>;
  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No quotations found.</p>;

  return null;
};

/**
 * Render quotation list table.
 * @param {QuotationProps} props - Quotation props
 * @returns {React.ReactElement} Table view
 */
const _renderTable = (props: QuotationProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-brand-gray-light py-6">
        <SearchFilter placeholder="Search quotation" onChange={handleSearch} />
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? <SkeletonComponent rows={5} columns={[{ width: "8%" }, { width: "15%" }, { width: "15%" }, { width: "18%" }, { width: "12%" }, { width: "12%" }, { width: "12%" }, { width: "8%" }]} /> : _renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: QuotationData): string => row.id} />}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
    </div>
  );
};

/**
 * Render quotation mobile list.
 * @param {QuotationProps} props - Quotation props
 * @returns {React.ReactElement} Mobile list
 */
const _renderMobile = (props: QuotationProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search quotation" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" />
      <div className="min-w-0">{_renderListState(props) ?? <Table data={props.paginatedData} columns={props.columns} isDetail={false} onRowClick={props.onRowClick} keyExtractor={(row: QuotationData): string => row.id} />}</div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
    </div>
  );
};

/**
 * Render quotation page.
 * @param {QuotationProps} props - Quotation props
 * @returns {React.ReactElement} Quotation page
 */
export const QuotationComponent = (props: QuotationProps): React.ReactElement => (
  <Layout pageTitle="Quotation List" mobileWhiteBackground={true}>
    {props.notificationMessage && (
      <AlertComponent
        type={props.notificationType}
        message={props.notificationMessage}
        onClose={props.closeNotification}
        toast
        closable
      />
    )}
    <PageLayout title="Quotation List" breadcrumbs={["Document", "Quotation"]} mobileHeaderClassName="px-0" onBack={props.onBack}>
      <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
        {_renderMobile(props)}
        {_renderTable(props)}
      </div>
    </PageLayout>
  </Layout>
);
