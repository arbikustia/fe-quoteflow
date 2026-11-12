import * as React from "react";

import { AlertComponent } from "@/components/Alert";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { CardSkeletonComponent, SkeletonComponent } from "@/components/Skeleton";
import Table from "@/components/Table";

import { ITEM_LIST_MESSAGE, MASTER_ITEM_CONFIG } from "./MasterItem.config";
import { getItemColumns, getItemRowKey, renderItemMobileCard } from "./MasterItem.helper";
import type { ItemListStatus, MasterItemProps } from "./MasterItem.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render the message shown instead of rows, if the list state has one.
 * @param {ItemListStatus} listStatus - Current list state
 * @returns {React.ReactElement | null} - State message, or null when rows render
 */
const _renderListMessage = (listStatus: ItemListStatus): React.ReactElement | null => {
  if (listStatus === "loading" || listStatus === "ready") {
    return null;
  }

  return <p className="py-10 text-center text-lg text-text-secondary">{ITEM_LIST_MESSAGE[listStatus]}</p>;
};

/**
 * Render the desktop table body for the current list state.
 * @param {MasterItemProps} props - Item list props
 * @returns {React.ReactElement} - Skeleton, state message or table
 */
const _renderDesktopContent = (props: MasterItemProps): React.ReactElement => {
  const { listStatus, items, currentPage, pageSize, canEdit, isMultiDownloadMode, selectedItemIds, onToggleItem, onEdit, onDownload } = props;

  if (listStatus === "loading") {
    return <SkeletonComponent rows={MASTER_ITEM_CONFIG.SKELETON_ROW_COUNT} columns={[...MASTER_ITEM_CONFIG.SKELETON_COLUMNS]} />;
  }

  const columns = getItemColumns({ currentPage, pageSize, canEdit, isMultiDownloadMode, selectedItemIds, onToggleItem, onEdit, onDownload });

  return _renderListMessage(listStatus) ?? <Table data={items} columns={columns} isDetail={false} keyExtractor={getItemRowKey} />;
};

/**
 * Render the mobile list body for the current list state.
 * @param {MasterItemProps} props - Item list props
 * @returns {React.ReactNode} - Skeletons, state message or item cards
 */
const _renderMobileContent = (props: MasterItemProps): React.ReactNode => {
  const { listStatus, items, canEdit, onEdit } = props;

  if (listStatus === "loading") {
    return <CardSkeletonComponent count={MASTER_ITEM_CONFIG.SKELETON_ROW_COUNT} />;
  }

  return _renderListMessage(listStatus) ?? items.map((item) => renderItemMobileCard({ item, canEdit, onEdit }));
};

/**
 * Render the multi-download and create buttons of the desktop toolbar.
 * @param {MasterItemProps} props - Item list props
 * @returns {React.ReactElement} - Toolbar actions
 */
const _renderDesktopActions = (props: MasterItemProps): React.ReactElement => {
  const { isMultiDownloadMode, selectedItemIds, canCreate, onStartMultiDownload, onDownloadSelected, onCancelMultiDownload, onCreate } = props;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={isMultiDownloadMode ? onDownloadSelected : onStartMultiDownload}
        disabled={isMultiDownloadMode && selectedItemIds.length === 0}
        className="h-14 rounded-2xl border border-action-primary px-6 text-lg font-semibold text-action-primary hover:bg-action-primary-subtle disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isMultiDownloadMode ? `Download Multiple (${selectedItemIds.length})` : "Download Multiple"}
      </button>
      {isMultiDownloadMode && (
        <button
          type="button"
          onClick={onCancelMultiDownload}
          className="h-14 rounded-2xl border border-border-default px-6 text-lg font-semibold text-text-primary hover:bg-background-subtle"
        >
          Cancel
        </button>
      )}
      {canCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          Create Item
        </button>
      )}
    </div>
  );
};

/**
 * Render the desktop card with search, toolbar, table and pagination.
 * @param {MasterItemProps} props - Item list props
 * @returns {React.ReactElement} - Desktop list
 */
const _renderDesktopList = (props: MasterItemProps): React.ReactElement => {
  const { currentPage, pageSize, totalPages, totalCount, onPageChange, onPageSizeChange, onSearchChange } = props;

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search item" onChange={onSearchChange} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
        {_renderDesktopActions(props)}
      </div>
      <div className="flex-1 overflow-auto">{_renderDesktopContent(props)}</div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        totalItems={totalCount}
        className="pt-4"
      />
    </div>
  );
};

/**
 * Render the mobile list with search, cards and pagination.
 * @param {MasterItemProps} props - Item list props
 * @returns {React.ReactElement} - Mobile list
 */
const _renderMobileList = (props: MasterItemProps): React.ReactElement => {
  const { currentPage, pageSize, totalPages, totalCount, onPageChange, onPageSizeChange, onSearchChange } = props;

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter
        placeholder="Search item"
        onChange={onSearchChange}
        isRoundedFull={true}
        className="w-full sm:w-full"
        inputClassName="!h-16 text-xl placeholder:text-xl"
      />
      <div className="flex min-w-0 flex-col gap-4">{_renderMobileContent(props)}</div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        totalItems={totalCount}
        isCompact={true}
        className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs"
      />
    </div>
  );
};

/**
 * Render the item list page.
 * @param {MasterItemProps} props - Item list props
 * @returns {React.ReactElement} - Item list page
 */
const MasterItemComponent = (props: MasterItemProps): React.ReactElement => {
  const { successMessage, canCreate, onBack, onCreate } = props;

  return (
    <React.Fragment>
      {successMessage && <AlertComponent type="success" message={successMessage} toast closable />}
      <Layout pageTitle="Item List">
        <PageLayout
          title="Item List"
          subtitle="Manage items and inventory data"
          breadcrumbs={["Master", "Master Item"]}
          headerRight={
            canCreate && (
              <button
                type="button"
                onClick={onCreate}
                className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden"
              >
                Create New
              </button>
            )
          }
          mobileHeaderClassName="px-0"
          mobileTitleClassName="text-4xl"
          onBack={onBack}
        >
          <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
            {_renderMobileList(props)}
            {_renderDesktopList(props)}
          </div>
        </PageLayout>
      </Layout>
    </React.Fragment>
  );
};

export default MasterItemComponent;
