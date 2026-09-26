import * as React from "react";
import Layout from "../layout";
import Table from "../../components/Table";
import type { TableColumn } from "../../components/Table";
import { MOCK_QUOTES } from "../../fixture/quotes";
import type { QuoteData } from "../quotes/Quotes.type";
import { Icons } from "../../components/Icons";
import { FiDownload } from "react-icons/fi";
import { generateQuotePDF } from "../../utils/pdfGenerator";

export const ReportComponent = (): React.ReactElement => {
  // Filter for completed orders
  const completedOrders = MOCK_QUOTES.filter(quote => quote.status === "Completed");

  const columns: TableColumn<QuoteData>[] = [
    { key: "name", header: "Event Name" },
    { key: "location", header: "Location" },
    { key: "startDate", header: "Start Date" },
    { key: "endDate", header: "End Date" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
          {row.status || "Completed"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              generateQuotePDF(row);
            }}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
            title="Download PDF"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-gray-900">Completed Orders Report</span>
          <button className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all text-sm cursor-pointer flex items-center gap-2">
            <FiDownload className="w-4 h-4" /> Export Report
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search completed orders"
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              Showing
              <select className="border border-gray-200 rounded px-2 py-1 bg-white font-medium text-gray-700 focus:outline-none">
                <option>15</option>
                <option>30</option>
                <option>50</option>
              </select>
              of {completedOrders.length} results
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <Table
              data={completedOrders}
              columns={columns}
              keyExtractor={(row) => row.id}
            />
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
            <button className="p-1 text-gray-400 hover:text-gray-700">
              {"<"}
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-900">
              1
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-700">
              {">"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
