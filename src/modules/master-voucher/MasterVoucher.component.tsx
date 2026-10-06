import * as React from "react";
import type { MasterVoucherProps } from "./MasterVoucher.type";
import Layout from "../../app/layout";
import { Icons } from "../../components/Icons";
import { MobileList } from "../../components/MobileList";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

export const MasterVoucherComponent = (props: MasterVoucherProps): React.ReactElement => {
  const {
    paginatedData,
    columns,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    pageSize,
    totalCount,
    changePageSize,
    onCreate,
    onRowClick,
    
    onMore,
    isMoreOpen,
    onCloseMore,
    onDelete,
  } = props;

  return (
    <Layout pageTitle="Voucher List">
      <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
        <div className="flex items-center justify-between py-2 mb-1 lg:mb-4 relative">
          <button type="button" onClick={onBack} aria-label="Back" className="w-11 h-11 rounded-full bg-[#F4F4F5] hover:bg-[#E9E9EB] active:scale-95 transition-all flex items-center justify-center text-black shrink-0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5" /><path d="M12 19 5 12l7-7" /></svg></button>
          <h1 className="flex-1 text-center text-[17px] font-semibold text-black tracking-tight px-2 truncate">
            Voucher List
          </h1>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={onMore}
              aria-label="More options"
              aria-expanded={isMoreOpen}
              aria-haspopup="menu"
              className="w-11 h-11 rounded-full bg-[#F4F4F5] hover:bg-[#E9E9EB] active:scale-95 transition-all flex items-center justify-center text-black"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="12" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="19" cy="12" r="1.8" />
              </svg>
            </button>
            {isMoreOpen && (
              <>
                <button type="button" aria-label="Close menu" onClick={onCloseMore} className="fixed inset-0 z-10 cursor-default" tabIndex={-1} />
                <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-20 w-52 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl overflow-hidden">
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => { onCloseMore?.(); onCreate(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-[14px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                    New Voucher
                  </button>
                  <div className="mx-3 my-1 h-px bg-gray-100" role="separator" />
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => { onDelete?.(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    Delete
                  </button>
                </div>
              </>
            )}
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
                title: row.code,
                meta: `${row.discountPercent}% • Created by ${row.createBy}`,
                hideEdit: true,
                hideImage: true,
                titleClassName: "text-xl font-semibold text-brand-text-dark leading-snug truncate",
                metaClassName: "text-base font-normal text-brand-text-medium/80 truncate",
                badge: (
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap ${row.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {row.status}
                  </span>
                ),
                onClick: () => onRowClick(row),
              }))}
            />
          </div>
          <div className="pt-4 flex items-center justify-between">
            <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} className="shrink-0" />
            <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
          </div>
        </div>

        <div className="hidden md:flex bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex-col flex-1 overflow-hidden mt-6">
          <div className="flex items-center justify-between p-5 px-6 border-b border-brand-gray-light">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium"><Icons.Search /></div>
              <input type="text" placeholder="Search voucher" className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm focus:outline-none text-brand-text-dark placeholder:text-brand-text-medium" />
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
