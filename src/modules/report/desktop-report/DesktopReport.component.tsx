import * as React from "react";
import { FiDownload } from "react-icons/fi";

import { Icons } from "@/components/Icons";
import { PaginationFooter, PaginationHeader } from "@/components/Pagination";
import Table, { type TableColumn } from "@/components/Table";

import Layout from "@/app/layout";
import type { QuoteData } from "@/modules/order/desktop-order/DesktopOrder.type";
import { generateQuotePDF } from "@/utils/pdfGenerator";

import type { DesktopReportProps } from "./DesktopReport.type";

/**
 * Get report columns
 * @param {number} currentPage - current page
 * @param {number} pageSize - page size
 * @returns {TableColumn<QuoteData>[]} - report columns
 */
const getDesktopReportColumns = (currentPage: number, pageSize: number): TableColumn<QuoteData>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    /**
     * Render No column
     * @param {QuoteData} _ - row data
     * @param {number} index - row index
     * @returns {React.ReactElement} - rendered element
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
     * Render Status column
     * @param {QuoteData} row - row data
     * @returns {React.ReactElement} - rendered element
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
     * Render Action column
     * @param {QuoteData} row - row data
     * @returns {React.ReactElement} - rendered element
     */
    render: (row): React.ReactElement => (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={(): void => {
            void generateQuotePDF(row);
          }}
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
 * @param {DesktopReportProps} props - props
 * @returns {React.ReactElement} - rendered toolbar
 */
const DesktopReportToolbar = (props: DesktopReportProps): React.ReactElement => (
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
    <PaginationHeader pageSize={props.pageSize} totalCount={props.totalCount} onPageSizeChange={props.changePageSize} />
  </div>
);

/**
 * Render DesktopReport Component
 * @param {DesktopReportProps} props - props
 * @returns {React.ReactElement} - rendered component
 */
export const DesktopReportComponent = (props: DesktopReportProps): React.ReactElement => (
  <Layout>
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-brand-text-dark">Completed Orders DesktopReport</span>
        <button className="px-5 py-2.5 bg-brand-blue text-brand-white font-medium rounded-lg hover:bg-brand-blue-dark transition-all text-sm cursor-pointer flex items-center gap-2">
          <FiDownload className="w-4 h-4" /> Export DesktopReport
        </button>
      </div>

      <div className="bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex flex-col flex-1 overflow-hidden">
        <DesktopReportToolbar {...props} />
        <div className="flex-1 overflow-auto">
          <Table data={props.paginatedData} columns={getDesktopReportColumns(props.currentPage, props.pageSize)} keyExtractor={(row): string => row.id} />
        </div>
        <PaginationFooter currentPage={props.currentPage} totalPages={props.totalPages} onPageChange={props.goToPage} onNextPage={props.nextPage} onPrevPage={props.prevPage} />
      </div>
    </div>
  </Layout>
);
