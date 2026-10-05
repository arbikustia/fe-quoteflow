import * as React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type {
  MasterItemProps,
  ItemActionProps,
  ItemToolbarProps,
} from "./MasterItem.type";
import Layout from "../../app/layout";
import { Icons } from "../../components/Icons";
import { MobileList } from "../../components/MobileList";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

export const ItemActionButtons = ({ row, onEdit, onConfirm }: ItemActionProps): React.ReactElement => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={(e) => { e.stopPropagation(); onEdit(row); }} className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer" title="Edit Item"><FiEdit2 className="w-4 h-4" /></button>
    <button onClick={(e) => { e.stopPropagation(); onConfirm(row); }} className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer" title="Delete Item"><FiTrash2 className="w-4 h-4" /></button>
  </div>
);

export const MasterItemComponent = (props: MasterItemProps): React.ReactElement => {
  const { onCreate, onEdit, onRowClick, paginatedData, columns, currentPage, totalPages, goToPage, nextPage, prevPage, pageSize, totalCount, changePageSize } = props;
  return (
    <Layout pageTitle="Master Item">
      <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4">
        <div className="flex justify-between items-start gap-4 mb-4 lg:mb-4">
          <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
            <span className="text-4xl lg:text-5xl lg:font-semibold text-brand-text-dark leading-none break-words">Product List</span>
            <p className="text-sm lg:text-sm text-brand-text-medium leading-tight">Manage your products, inventory, and pricing</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onCreate} className="hidden lg:block px-4 py-2 bg-brand-blue text-brand-white font-medium rounded-lg lg:px-10 lg:py-3 hover:bg-brand-blue-dark transition-all lg:text-md cursor-pointer shadow-sm">Create Item</button>
            <button onClick={onCreate} className="lg:hidden px-4 py-2.5 shrink-0 flex items-center justify-center gap-2 bg-brand-blue text-brand-white rounded-lg shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-dark active:scale-95 transition-all whitespace-nowrap" aria-label="Create">
              <span className="text-sm font-bold tracking-tight">Create Item</span>
            </button>
          </div>
        </div>

        <div className="md:hidden space-y-6 mt-10">
          <div className="relative mb-3">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-text-medium scale-125"><Icons.Search /></span>
            <input type="text" placeholder="Search" className="w-full pl-12 pr-6 py-3.5 bg-brand-gray-light border-none rounded-full text-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue/20 text-brand-text-dark placeholder:text-brand-text-medium" />
          </div>
          <div className="scale-100 origin-top">
            <MobileList
              data={paginatedData.map((row) => ({
                title: row.name,
                subtitle: "Rp " + row.price.toLocaleString("id-ID"),
                meta: row.stock + " in stocks · " + row.category,
                imageUrl: row.image,
                onEdit: () => onEdit(row),
                onClick: () => onRowClick(row),
              }))}
            />
          </div>
          <div className="pt-4 flex items-center justify-between">
            <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} className="shrink-0" />
            <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} className="border-t-0 p-0" />
          </div>
        </div>

        <div className="hidden md:flex bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex-col flex-1 overflow-hidden mt-6">
          <div className="flex items-center justify-between p-5 px-6 border-b border-brand-gray-light">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium"><Icons.Search /></div>
              <input type="text" placeholder="Search item" className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm focus:outline-none text-brand-text-dark placeholder:text-brand-text-medium" />
            </div>
            <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} />
          </div>
          <div className="flex-1 overflow-auto">
            <Table data={paginatedData} columns={columns} onRowClick={onRowClick} keyExtractor={(r: any) => r.id} />
          </div>
          <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
        </div>
      </div>
    </Layout>
  );
};
