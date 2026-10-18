import type { ChangeEvent, ReactElement } from "react";
import * as React from "react";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import Table from "../../components/Table";

import type { ItemData, MasterItemProps, MobileItemCardProps } from "./MasterItem.type";

/**
 * Render empty or loading state message.
 * @param {MasterItemProps} props - Component props
 * @returns {ReactElement | null} State message element or null
 */
const _renderListState = (props: MasterItemProps): ReactElement | null => {
  if (props.isLoading) {
    return <p className="py-10 text-center text-sm text-brand-text-medium">Loading items…</p>;
  }

  if (props.isMissingData) {
    return <p className="py-10 text-center text-sm text-red-600">Item data is unavailable. Please try again.</p>;
  }

  if (props.errorMessage) {
    return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;
  }

  if (props.isEmpty) {
    return <p className="py-10 text-center text-sm text-brand-text-medium">No items found.</p>;
  }

  return null;
};

/**
 * Render mobile item card metrics grid.
 * @param {ItemData} item - Item data
 * @returns {ReactElement} Metrics element
 */
const _renderMobileMetrics = (item: ItemData): ReactElement => (
  <div className="grid grid-cols-2 gap-2 rounded-xl bg-background-subtle/60 p-3 text-sm">
    <div>
      <p className="text-xs text-text-tertiary">Category</p>
      <p className="truncate font-medium text-text-primary">{item.categoryName ?? "-"}</p>
    </div>
    <div>
      <p className="text-xs text-text-tertiary">Stock</p>
      <p className="font-medium text-text-primary">{item.stock}</p>
    </div>
    <div>
      <p className="text-xs text-text-tertiary">Price</p>
      <p className="truncate font-medium text-text-primary">Rp {item.price.toLocaleString("id-ID")}</p>
    </div>
    <div>
      <p className="text-xs text-text-tertiary">Duration</p>
      <p className="font-medium text-text-primary">{item.duration} days</p>
    </div>
  </div>
);

/**
 * Render mobile item card.
 * @param {MobileItemCardProps} props - Item card props
 * @returns {ReactElement} Mobile item card
 */
const MobileItemCard = ({ item, onEdit }: MobileItemCardProps): ReactElement => {
  /**
   * Handle card click.
   * @returns {void}
   */
  const handleClick = (): void => {
    onEdit(item);
  };

  const statusClass = item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className="flex cursor-pointer flex-col gap-4 rounded-3xl border border-border-default bg-background-surface p-5 transition-all hover:border-border-strong active:bg-background-subtle/50"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 truncate text-base font-semibold text-text-primary">{item.name}</h4>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusClass}`}>
          {item.status}
        </span>
      </div>
      {_renderMobileMetrics(item)}
    </div>
  );
};

/**
 * Render mobile layout list.
 * @param {MasterItemProps} props - Component props
 * @returns {ReactElement} Mobile layout element
 */
const _renderMobile = (props: MasterItemProps): ReactElement => {
  /**
   * Handle search input change.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void}
   */
  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    props.setSearchTerm(event.target.value);
  };

  return (
    <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden">
      <SearchFilter placeholder="Search item" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" />
      <div className="min-w-0 space-y-3">
        {_renderListState(props) ??
          props.paginatedData.map((item) => (
            <React.Fragment key={item.id}>
              <MobileItemCard item={item} onEdit={props.onEdit} />
            </React.Fragment>
          ))}
      </div>
      <Pagination
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        pageSize={props.pageSize}
        onPageChange={props.goToPage}
        onPageSizeChange={props.changePageSize}
        totalItems={props.totalCount}
        isCompact={true}
        className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs"
      />
    </div>
  );
};

/**
 * Render desktop table header toolbar.
 * @param {MasterItemProps} props - Component props
 * @param {(event: ChangeEvent<HTMLInputElement>) => void} onSearch - Search callback
 * @returns {ReactElement} Toolbar element
 */
const _renderDesktopToolbar = (
  props: MasterItemProps,
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void,
): ReactElement => (
  <div className="flex items-center justify-between gap-4 py-6">
    <SearchFilter placeholder="Search item" onChange={onSearch} />
    <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={props.isMultiDownloadMode ? props.onDownloadSelected : props.onToggleMultiDownload}
      disabled={props.isMultiDownloadMode && props.selectedItemIds.length === 0}
      className="h-14 rounded-xl border border-brand-blue px-6 text-sm font-semibold text-brand-blue disabled:cursor-not-allowed disabled:opacity-50"
      >
      {props.isMultiDownloadMode ? `Download Multiple (${props.selectedItemIds.length})` : "Download Multiple"}
    </button>
    {props.isMultiDownloadMode && (
      <button
        type="button"
        onClick={props.onCancelMultiDownload}
        className="h-14 rounded-xl border border-border-default px-6 text-sm font-semibold text-text-primary"
      >
        Cancel
      </button>
    )}
    <button
      type="button"
      onClick={props.onCreate}
      className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white"
    >
      Create Item
    </button>
    </div>
  </div>
);

/**
 * Render desktop layout table.
 * @param {MasterItemProps} props - Component props
 * @returns {ReactElement} Desktop layout element
 */
const _renderDesktop = (props: MasterItemProps): ReactElement => {
  /**
   * Handle search input change.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void}
   */
  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    props.setSearchTerm(event.target.value);
  };

  return (
    <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6">
      {_renderDesktopToolbar(props, handleSearch)}
      <div className="flex-1 overflow-auto">
        {_renderListState(props) ?? (
          <Table
            data={props.paginatedData}
            columns={props.columns}
            isDetail={false}
            onRowClick={props.onRowClick}
            keyExtractor={(row: ItemData): string => row.id}
          />
        )}
      </div>
      <Pagination
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        pageSize={props.pageSize}
        onPageChange={props.goToPage}
        onPageSizeChange={props.changePageSize}
        totalItems={props.totalCount}
      />
    </div>
  );
};

/**
 * Render Master Item list view.
 * @param {MasterItemProps} props - Component props
 * @returns {ReactElement} Component element
 */
export const MasterItemComponent = (props: MasterItemProps): ReactElement => {
  const createButton = (
    <button
      type="button"
      onClick={props.onCreate}
      className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30"
    >
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Item List" mobileWhiteBackground={true}>
      <PageLayout
        title="Item List"
        breadcrumbs={["Master", "Master Item"]}
        headerRight={createButton}
        mobileHeaderClassName="px-6"
        onBack={props.onBack}
      >
        <div className="relative flex h-full flex-col bg-background-surface px-6 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
