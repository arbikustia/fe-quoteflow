import * as React from "react";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { SkeletonComponent } from "@/components/Skeleton";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { PaymentData, PaymentProps } from "./Payment.type";

/** Render payment list state. */
const _renderList = (props: PaymentProps): React.ReactElement => {
  if (props.isLoading) return <SkeletonComponent rows={5} columns={props.columns.map(() => ({ width: "11%" }))} />;
  if (props.isMissingData) return <p className="py-10 text-center text-sm text-danger">Payment data is unavailable. Please try again.</p>;
  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No payments found.</p>;

  return <Table data={props.paginatedData} columns={props.columns} onRowClick={props.onRowClick} keyExtractor={(row: PaymentData): string => row.id} />;
};

/** Render payment list page. */
export const PaymentComponent = (props: PaymentProps): React.ReactElement => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  const createButton = <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-sm font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;

  return (
    <Layout pageTitle="Payment List" mobileWhiteBackground={true}>
      <PageLayout title="Payment List" breadcrumbs={["Document", "Payment"]} headerRight={createButton} mobileHeaderClassName="px-0" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
          <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
            <SearchFilter placeholder="Search payment" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" />
            <div className="min-w-0">{_renderList(props)}</div>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
          </div>
          <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
            <div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search payment" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="h-14 rounded-xl bg-action-primary px-6 text-sm font-semibold text-text-inverse hover:bg-action-primary-hover">Create Payment</button></div>
            <div className="flex-1 overflow-auto">{_renderList(props)}</div>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};
