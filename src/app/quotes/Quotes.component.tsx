import * as React from "react";
import Layout from "../layout";
import Table from "../../components/Table";
import type { TableColumn } from "../../components/Table";
import ConfirmModal from "../../components/ConfirmModal";
import type { QuotesProps, QuoteData } from "./Quotes.type";
import { Icons } from "../../components/Icons";
import { FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiDownload } from "react-icons/fi";
import { MOCK_QUOTES } from "../../fixture/quotes";
import { generateQuotePDF } from "../../utils/pdfGenerator";

export const QuotesComponent = (props: QuotesProps): React.ReactElement => {
  const {
    isConfirmModalOpen,
    deletingQuote,
    openCreateModal,
    openEditModal,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  } = props;

  const columns: TableColumn<QuoteData>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer"
        />
      ),
      render: () => (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue w-4 h-4 cursor-pointer"
        />
      ),
    },
    {
      key: "name",
      header: "Event Info",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-gray-900 text-sm">{row.name}</span>
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <FiMapPin className="w-3 h-3 text-indigo-500" />
            <span>{row.location}</span>
          </div>
        </div>
      ),
    },
    {
      key: "dateRange",
      header: "Date Range",
      render: (row) => (
        <div className="flex items-center gap-2 text-xs font-medium text-gray-900 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 w-fit">
          <FiCalendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>
            {new Date(row.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}{" "}
            -{" "}
            {new Date(row.endDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm w-fit inline-block">
          {row.category}
        </span>
      ),
    },
    {
      key: "selectedItems",
      header: "Items",
      render: (row) => (
        <div className="flex flex-wrap gap-1.5 max-w-[250px]">
          {row.selectedItems.map((item, idx) => (
            <span
              key={idx}
              className="bg-white text-gray-600 px-2 py-0.5 rounded border border-gray-200 shadow-sm text-[11px] truncate max-w-[120px]"
              title={item}
            >
              {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "qty",
      header: "Qty",
      align: "center",
      render: (row) => (
        <span className="font-bold text-gray-900 bg-gray-50 w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 mx-auto text-xs">
          {row.qty}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Order"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openConfirmModal(row)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Order"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
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
          <span className="text-2xl font-bold text-gray-900">Orders</span>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all text-sm"
          >
            Create Order
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 py-4 border-b-2 border-indigo-600 text-indigo-600 font-bold text-sm cursor-pointer">
                <span className="text-indigo-600">☆</span> All Orders{" "}
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  157
                </span>
              </button>
              <button className="flex items-center gap-2 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors cursor-pointer">
                Pending Payment{" "}
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  12
                </span>
              </button>
              <button className="flex items-center gap-2 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors cursor-pointer">
                Confirmed{" "}
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  24
                </span>
              </button>
              <button className="flex items-center gap-2 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors cursor-pointer">
                On Rental{" "}
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  8
                </span>
              </button>
              <button className="flex items-center gap-2 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors cursor-pointer">
                Returned{" "}
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  19
                </span>
              </button>
              <button className="flex items-center gap-2 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors cursor-pointer">
                Completed{" "}
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  89
                </span>
              </button>
              <button className="flex items-center gap-2 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors cursor-pointer">
                Cancel{" "}
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  5
                </span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Icons.ChevronDown /> Sort
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <span>Y</span> Filter
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search order"
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
              of 157 results
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <Table
              data={MOCK_QUOTES}
              columns={columns}
              keyExtractor={(row) => row.id}
            />
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
            <button className="p-1 text-gray-400 hover:text-gray-700">
              {"<"}
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-900">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg">
              ...
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50">
              6
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-700">
              {">"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={onConfirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order "${deletingQuote?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </Layout>
  );
};
