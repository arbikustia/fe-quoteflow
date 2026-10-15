import type { ChangeEvent, ReactElement } from "react";

import { Icons } from "@/components/Icons";
import Table from "@/components/Table";

import Layout from "@/app/layout";

import type { MasterCategoryProps } from "./MasterCategory.type";

/**
 * Resolve empty table message.
 * @param {MasterCategoryProps} props - Component props
 * @returns {string} Empty table message
 */
const _getEmptyText = (props: MasterCategoryProps): string => {
  const { isMissingData, errorMessage, isEmpty } = props;

  if (isMissingData) {
    return "Category data is unavailable. Please try again.";
  }

  if (errorMessage) {
    return errorMessage;
  }

  if (isEmpty) {
    return "No categories found.";
  }

  return "No data available.";
};

/**
 * Master Category pure UI component.
 * @param {MasterCategoryProps} props - Category props
 * @returns {ReactElement} Category list
 */
export const MasterCategoryComponent = (props: MasterCategoryProps): ReactElement => {
  const {
    onBack,
    paginatedData,
    columns,
    currentPage,
    totalPages,
    goToPage,
    pageSize,
    totalCount,
    changePageSize,
    onCreate,
    onRowClick,
    onMore,
    isMoreOpen,
    onCloseMore,
    onDelete,
    isLoading,
    setSearchTerm,
  } = props;
  const emptyText = _getEmptyText(props);
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => { setSearchTerm(event.target.value); };
  const handleCreate = (): void => {
    onCloseMore();
    onCreate();
  };
  const handleDelete = (): void => {
    onCloseMore();
    onDelete();
  };

  return (
    <Layout pageTitle="Category list">
      <div className="relative flex h-full flex-col px-3 pb-18 lg:-mt-4 lg:px-0 lg:pb-0">
        <div className="relative mb-4 flex items-center justify-between py-2">
          <button type="button" onClick={onBack} aria-label="Back" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5" /><path d="M12 19 5 12l7-7" /></svg>
          </button>
          <h1 className="flex-1 truncate px-2 text-center text-lg font-semibold text-text-primary">Category list</h1>
          <div className="relative shrink-0">
            <button type="button" onClick={onMore} aria-label="More options" aria-expanded={isMoreOpen} aria-haspopup="menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>
            </button>
            {isMoreOpen && (
              <>
                <button type="button" aria-label="Close menu" onClick={onCloseMore} className="fixed inset-0 z-10 cursor-default" tabIndex={-1} />
                <div role="menu" className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border-default bg-background-surface py-2 shadow-medium">
                  <button role="menuitem" type="button" onClick={handleCreate} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-text-primary hover:bg-background-subtle">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                    New category
                  </button>
                  <div className="mx-3 my-1 h-px bg-border-default" role="separator" />
                  <button role="menuitem" type="button" onClick={handleDelete} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-tertiary"><Icons.Search /></span>
            <input type="search" aria-label="Search category" placeholder="Search category" onChange={handleSearchChange} className="w-full rounded-lg border border-border-strong bg-background-surface py-2 pl-10 pr-4 text-sm text-text-primary outline-none focus:border-border-focus focus:ring-2 focus:ring-focus-ring sm:w-64" />
          </div>
          <Table data={paginatedData} columns={columns} onRowClick={onRowClick} keyExtractor={(category) => category.id} currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} totalCount={totalCount} onPageChange={goToPage} onPageSizeChange={changePageSize} emptyText={emptyText} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
};
