import * as React from "react";

import { AlertComponent } from "@/components/Alert";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { SkeletonComponent } from "@/components/Skeleton";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { InvoiceData, InvoiceProps } from "./Invoice.type";

/** Render invoice list content. */
const _renderContent = (props: InvoiceProps): React.ReactElement => {
  if (props.isLoading) return <SkeletonComponent rows={5} columns={props.columns.map(() => ({ width: "10%" }))} />;
  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No invoices found.</p>;

  return <Table data={props.paginatedData} columns={props.columns} onRowClick={props.onRowClick} keyExtractor={(row: InvoiceData): string => row.id} />;
};

/** Render invoice list page without create action. */
export const InvoiceComponent = (props: InvoiceProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <Layout pageTitle="Invoice List" mobileWhiteBackground={true}>
      {props.notificationMessage && <AlertComponent type={props.notificationType} message={props.notificationMessage} onClose={props.closeNotification} toast closable />}
      <PageLayout title="Invoice List" breadcrumbs={["Document", "Invoice"]} mobileHeaderClassName="px-0" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
          <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
            <SearchFilter placeholder="Search invoice" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" />
            <div className="min-w-0">{_renderContent(props)}</div>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
          </div>
          <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
            <div className="flex items-center py-6"><SearchFilter placeholder="Search invoice" onChange={handleSearch} /></div>
            <div className="flex-1 overflow-auto">{_renderContent(props)}</div>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};