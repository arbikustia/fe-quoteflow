import * as React from "react";
import { FiDownload } from "react-icons/fi";

import type { ReportProps } from "./Report.type";
import type { QuoteData } from "../order-page/OrderPage.type";
import Layout from "../../app/layout";
import { Icons } from "../../components/Icons";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";
import { generateQuotePDF } from "../../utils/pdfGenerator";

/**
 * Get report columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<QuoteData>[]} columns
 */
const getReportColumns = (currentPage: number, pageSize: number): TableColumn<QuoteData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    /**
     * Render No
     * @param {QuoteData} _ - row
     * @param {number} index - index
     * @returns {React.ReactElement} element
     */
    render: (_, index): React.ReactElement => (
      <span className="text-brand-text-medium font-medium text-sm">
        {(currentPage - 1) * pageSize + index + 1}
      </span>
    ),
  },
  { key: "name", header: "Event Name" },
  { key: "location", header: "Location" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  {
    key: "status",
    header: "Status",
    /**
     * Render status
     * @param {QuoteData} row - row
     * @returns {React.ReactElement} element
     */
    render: (row): React.ReactElement => (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue-light text-brand-blue">
        {row.status || "Completed"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Action",
    align: "center",
    /**
     * Render action
     * @param {QuoteData} row - row
     * @returns {React.ReactElement} element
     */
    render: (row): React.ReactElement => (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={(): void => { generateQuotePDF(row); }}
          className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer"
          title="Download PDF"
        >
          <FiDownload className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];

/**
 * Render Toolbar
 * @param {ReportProps} props - props
 * @returns {React.ReactElement} element
 */
const ReportToolbar = ({ pageSize, totalCount, changePageSize }: ReportProps): React.ReactElement => (
  <div className="flex items-center justify-between p-4 px-6 border-b border-brand-gray-light">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium">
        <Icons.Search />
      </div>
      <input
        type="text"
        placeholder="Search completed orders"
        className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-gray-light text-brand-text-dark placeholder:text-brand-text-medium"
      />
    </div>
    <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} />
  </div>
);

/**
 * Render Report Component
 * @param {ReportProps} props - props
 * @returns {React.ReactElement} element
 */
export const ReportComponent = (props: ReportProps): React.ReactElement => (
  <Layout>
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-brand-text-dark">Completed Orders Report</span>
        <button className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer flex items-center gap-2">
          <FiDownload className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
        <ReportToolbar {...props} />
        <div className="flex-1 overflow-auto">
          <Table data={props.paginatedData} columns={getReportColumns(props.currentPage, props.pageSize)} keyExtractor={(row): string => row.id} />
        </div>
        <PaginationFooter currentPage={props.currentPage} totalPages={props.totalPages} onPageChange={props.goToPage} onNextPage={props.nextPage} onPrevPage={props.prevPage} />
      </div>
    </div>
  </Layout>
);
