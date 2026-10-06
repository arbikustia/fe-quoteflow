import * as React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { Icons } from "../../components/Icons";
import { MobileList } from "../../components/MobileList";
import type { MobileListItemProps } from "../../components/MobileList/MobileList.component";
import { PaginationFooter, PaginationHeader } from "../../components/Pagination";
import Table from "../../components/Table";

import type { ItemActionProps, ItemData, MasterItemProps } from "./MasterItem.type";

/**
 * Item action buttons
 * @param {ItemActionProps} props - action props
 * @returns {React.ReactElement} Action buttons
 */
export const ItemActionButtons = ({ row, onEdit, onConfirm }: ItemActionProps): React.ReactElement => {
  /**
   * Handle edit
   * @param {React.MouseEvent<HTMLButtonElement>} e - event
   * @returns {void} void
   */
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onEdit(row);
  };

  /**
   * Handle confirm
   * @param {React.MouseEvent<HTMLButtonElement>} e - event
   * @returns {void} void
   */
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onConfirm(row);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={handleEdit} className="p-1.5 text-brand-text-medium hover:text-brand-blue hover:bg-brand-blue-light rounded-lg transition-colors cursor-pointer" title="Edit Item"><FiEdit2 className="w-4 h-4" /></button>
      <button onClick={handleConfirm} className="p-1.5 text-brand-text-medium hover:text-brand-orange hover:bg-brand-orange-light rounded-lg transition-colors cursor-pointer" title="Delete Item"><FiTrash2 className="w-4 h-4" /></button>
    </div>
  );
};

/**
 * Empty click handler
 * @returns {void} void
 */
const _handleEmptyClick = (): void => {};

/**
 * Dropdown Menu
 * @param {MasterItemProps} props - component props
 * @returns {React.ReactElement | null} Menu
 */
const _renderDropdownMenu = (props: MasterItemProps): React.ReactElement | null => {
  const { isMoreOpen, onCloseMore, onCreate, onDelete } = props;

  if (!isMoreOpen) return null;

  /**
   * Handle Create
   * @returns {void} void
   */
  const handleCreate = (): void => {

    if (onCloseMore) onCloseMore();

    onCreate();
  };

  /**
   * Handle Delete
   * @returns {void} void
   */
  const handleDelete = (): void => {

    if (onDelete) onDelete();
  };

  return (
    <>
      <button type="button" aria-label="Close menu" onClick={onCloseMore} className="fixed inset-0 z-10 cursor-default" tabIndex={-1} />
      <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-20 w-52 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl overflow-hidden">
        <button role="menuitem" type="button" onClick={handleCreate} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[14px] font-medium text-gray-800 hover:bg-gray-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
          New Item
        </button>
        <div className="mx-3 my-1 h-px bg-gray-100" role="separator" />
        <button role="menuitem" type="button" onClick={handleDelete} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          Delete
        </button>
      </div>
    </>
  );
};

/**
 * Render Header
 * @param {MasterItemProps} props - component props
 * @returns {React.ReactElement} Header
 */
const _renderHeader = (props: MasterItemProps): React.ReactElement => {
  const { onBack, onMore, isMoreOpen } = props;

  return (
    <div className="flex items-center justify-between py-2 mb-1 lg:mb-4 relative">
      <button type="button" onClick={onBack} aria-label="Back" className="w-11 h-11 rounded-full bg-[#F4F4F5] hover:bg-[#E9E9EB] active:scale-95 transition-all flex items-center justify-center text-black shrink-0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5" /><path d="M12 19 5 12l7-7" /></svg></button>
      <h1 className="flex-1 text-center text-[17px] font-semibold text-black tracking-tight px-2 truncate">
        Product List
      </h1>
      <div className="relative shrink-0">
        <button type="button" onClick={onMore} aria-label="More options" aria-expanded={isMoreOpen} aria-haspopup="menu" className="w-11 h-11 rounded-full bg-[#F4F4F5] hover:bg-[#E9E9EB] active:scale-95 transition-all flex items-center justify-center text-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="19" cy="12" r="1.8" />
          </svg>
        </button>
        {_renderDropdownMenu(props)}
      </div>
    </div>
  );
};

/**
 * Format mobile list data
 * @param {readonly ItemData[]} paginatedData - paginated data
 * @param {(row: ItemData) => void} onRowClick - click handler
 * @returns {MobileListItemProps[]} mobile list data
 */
const _formatMobileData = (paginatedData: readonly ItemData[], onRowClick: (row: ItemData) => void): MobileListItemProps[] => {
  return paginatedData.map((row) => {
    /**
     * Handle click
     * @returns {void} void
     */
    const handleClick = (): void => {
      onRowClick(row);
    };

    return {
      title: row.name,
      subtitle: "Rp " + row.price.toLocaleString("id-ID"),
      meta: row.stock + " in stocks · " + row.category,
      imageUrl: row.image,
      hideEdit: true,
      titleClassName: "text-xl font-semibold text-brand-text-dark leading-snug truncate",
      subtitleClassName: "text-base font-normal text-brand-text-medium/80 truncate",
      metaClassName: "text-base font-normal text-brand-text-medium/80 truncate",
      badge: (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap ${row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.status}
        </span>
      ),
      onEdit: _handleEmptyClick,
      onClick: handleClick,
    };
  });
};

/**
 * Render Mobile List
 * @param {MasterItemProps} props - component props
 * @returns {React.ReactElement} mobile list view
 */
const _renderMobileList = (props: MasterItemProps): React.ReactElement => {
  const { paginatedData, onRowClick, pageSize, totalCount, changePageSize, currentPage, totalPages, goToPage, nextPage, prevPage } = props;
  
  return (
    <div className="md:hidden space-y-6 mt-10">
      <div className="relative mb-3">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-text-medium scale-125"><Icons.Search /></span>
        <input type="text" placeholder="Search" className="w-full pl-12 pr-6 py-3.5 bg-brand-gray-light border-none rounded-full text-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue/20 text-brand-text-dark placeholder:text-brand-text-medium" />
      </div>
      <div className="scale-100 origin-top">
        <MobileList data={_formatMobileData(paginatedData, onRowClick)} />
      </div>
      <div className="pt-4 flex items-center justify-between">
        <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} className="shrink-0" />
        <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} className="border-t-0 p-0" />
      </div>
    </div>
  );
};

/**
 * Render Desktop Table
 * @param {MasterItemProps} props - component props
 * @returns {React.ReactElement} desktop table view
 */
const _renderDesktopTable = (props: MasterItemProps): React.ReactElement => {
  const { paginatedData, columns, onRowClick, pageSize, totalCount, changePageSize, currentPage, totalPages, goToPage, nextPage, prevPage } = props;

  return (
    <div className="hidden md:flex bg-brand-white rounded-xl border border-brand-gray-light shadow-sm flex-col flex-1 overflow-hidden mt-6">
      <div className="flex items-center justify-between p-5 px-6 border-b border-brand-gray-light">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-text-medium"><Icons.Search /></div>
          <input type="text" placeholder="Search item" className="w-64 pl-10 pr-4 py-2 bg-brand-gray-light border-none rounded-lg text-sm focus:outline-none text-brand-text-dark placeholder:text-brand-text-medium" />
        </div>
        <PaginationHeader pageSize={pageSize} totalCount={totalCount} onPageSizeChange={changePageSize} />
      </div>
      <div className="flex-1 overflow-auto">
        <Table data={paginatedData} columns={columns} onRowClick={onRowClick} keyExtractor={(r: ItemData) => r.id} />
      </div>
      <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} onNextPage={nextPage} onPrevPage={prevPage} />
    </div>
  );
};

/**
 * Master Item component
 * @param {MasterItemProps} props - component props
 * @returns {React.ReactElement} Master Item UI
 */
export const MasterItemComponent = (props: MasterItemProps): React.ReactElement => {
  return (
    <Layout pageTitle="Master Item">
      <div className="flex flex-col h-full pb-18 lg:pb-0 px-3 lg:px-0 lg:-mt-4 relative">
        {_renderHeader(props)}
        {_renderMobileList(props)}
        {_renderDesktopTable(props)}
      </div>
    </Layout>
  );
};
