import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Icons } from "../../components/Icons";
import type { MobileListItemProps } from "../../components/MobileList";
import { MobileList } from "../../components/MobileList";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

import type { CustomerData, MasterCustomerProps } from "./MasterCustomer.type";

/**
 * Render desktop table view
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The desktop table element
 */
const _renderDesktopTable = (props: MasterCustomerProps): React.ReactElement => {
  const { paginatedData, columns, currentPage, totalPages, goToPage, nextPage, prevPage, pageSize, totalCount, changePageSize, onRowClick } = props;

  return (
    <div className="hidden md:flex bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex-col flex-1 overflow-hidden mt-6">
      <div className="flex items-center justify-between p-5 px-6 border-b border-brand-gray-light">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium"><Icons.Search /></div>
          <input type="text" placeholder="Search customer" className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm focus:outline-none placeholder:text-brand-text-medium text-brand-text-dark" />
        </div>
        <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} />
      </div>
      <div className="flex-1 overflow-auto">
        <Table data={paginatedData} columns={columns} onRowClick={onRowClick} keyExtractor={(r: CustomerData) => r.id} />
      </div>
      <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
    </div>
  );
};

/**
 * Render mobile list view
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The mobile list element
 */
const _renderMobileList = (props: MasterCustomerProps): React.ReactElement => {
  const { paginatedData, currentPage, totalPages, goToPage, nextPage, prevPage, pageSize, totalCount, changePageSize, onRowClick } = props;

  /**
   * Get mobile list data
   * @returns {MobileListItemProps[]} The formatted mobile list data
   */
  const getMobileListData = (): MobileListItemProps[] => paginatedData.map((row) => ({
    title: row.name,
    meta: row.address,
    hideImage: true,
    titleClassName: "text-xl font-semibold text-brand-text-dark leading-snug truncate",
    metaClassName: "text-base font-normal text-brand-text-medium/80 truncate",
    badge: (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap ${row.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {row.status}
      </span>
    ),
    /**
     * Handle row click
     * @returns {void}
     */
    onClick: (): void => onRowClick(row),
  }));

  return (
    <div className="md:hidden space-y-6 mt-10">
      <div className="relative mb-3">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-text-medium scale-125"><Icons.Search /></span>
        <input type="text" placeholder="Search" className="w-full pl-12 pr-6 py-3.5 bg-brand-gray-light border-none rounded-full text-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue/20 placeholder:text-brand-text-medium text-brand-text-dark" />
      </div>
      <div className="scale-100 origin-top">
        <MobileList data={getMobileListData()} />
      </div>
      <div className="pt-4 flex items-center justify-between">
        <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} className="shrink-0" />
        <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
      </div>
    </div>
  );
};

/**
 * Master Customer Component
 * @param {MasterCustomerProps} props - The component props
 * @returns {React.ReactElement} The component
 */
export const MasterCustomerComponent = (props: MasterCustomerProps): React.ReactElement => {
  const { onBack, onCreate, onDelete } = props;

  const actions = [
    { label: "New Customer", onClick: onCreate },
    { label: "Delete", onClick: onDelete, isDangerous: true },
  ];

  return (
    <Layout pageTitle="Customer List">
      <PageLayout
        title="Customer List"
        breadcrumbs={["Home", "Master", "Customer"]}
        actions={actions}
        onBack={onBack}
      >
        <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
          {_renderMobileList(props)}
          {_renderDesktopTable(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
