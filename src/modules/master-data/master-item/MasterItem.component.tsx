import { Dropdown, type MenuProps } from "antd";
import type { ChangeEvent, MouseEvent, ReactElement } from "react";
import * as React from "react";
import { FiDownload, FiEdit2 } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

import { CheckboxComponent } from "@/components/Checkbox";

import type { ActionButtonProps, GetColumnsParams } from "./MasterItem.type";
import type { ItemData, MasterItemProps, MobileItemCardProps } from "./MasterItem.type";
import Layout from "../../../app/layout";
import { PageLayout } from "../../../app/shared/PageLayout";
import { MasterDataCard } from "../../../components/MasterDataCard";
import { Pagination } from "../../../components/Pagination";
import { SearchFilter } from "../../../components/SearchFilter";
import { CardSkeletonComponent, SkeletonComponent } from "../../../components/Skeleton";
import type { TableColumn } from "../../../components/Table";
import Table from "../../../components/Table";

/**
 * Render status badge.
 * @param {ItemData} row - Row item data
 * @returns {ReactElement} Status element
 */
const _renderStatus = (row: ItemData): ReactElement => (
  <span
    className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${
      row.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"
    }`}
  >
    {row.status}
  </span>
);

/**
 * Render action edit button.
 * @param {ActionButtonProps} props - Action button props
 * @returns {ReactElement} Edit button element
 */
const _renderActionButton = (props: ActionButtonProps): ReactElement => {
  const { row, onEdit, onDownload } = props;

  /**
   * Handle edit click.
   * @param {MouseEvent<HTMLButtonElement>} event - Click event
   * @returns {void} No return value
   */
  const handleEdit = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(row);
  };
  /**
   * Download QR image.
   * @returns {void} No return value
   */
  const handleDownloadImage = (): void => onDownload(row, "image");
  /**
   * Download QR PDF.
   * @returns {void} No return value
   */
  const handleDownloadPdf = (): void => onDownload(row, "pdf");
  const downloadItems: MenuProps["items"] = [
    { key: "image", label: "Download Image", onClick: handleDownloadImage },
    { key: "pdf", label: "Download PDF", onClick: handleDownloadPdf },
  ];

  return (
    <div className="flex items-center justify-center gap-1">
      <button type="button" onClick={handleEdit} className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Edit item" aria-label={`Edit item ${row.name}`}>
        <FiEdit2 className="h-5 w-5" />
      </button>
      <Dropdown menu={{ items: downloadItems }} trigger={["click"]}>
        <button type="button" className="flex cursor-pointer items-center gap-1 rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Download QR">
          <FiDownload className="h-5 w-5" />
          <FiChevronDown className="h-4 w-4" />
        </button>
      </Dropdown>
    </div>
  );
};

/**
 * Render index column number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} index - Row index
 * @returns {ReactElement} Number element
 */
const _renderIndex = (currentPage: number, pageSize: number, index: number): ReactElement => (
  <span className="text-sm">{(currentPage - 1) * pageSize + index + 1}</span>
);

/**
 * Render image thumbnail or dash.
 * @param {ItemData} row - Row item
 * @returns {ReactElement} Thumbnail element
 */
const _renderImage = (row: ItemData): ReactElement => {
  if (!row.image) {
    return <span>-</span>;
  }

  return (
    <a href={row.image} target="_blank" rel="noreferrer" className="text-lg font-medium text-action-primary underline hover:text-action-primary-hover">
      See image
    </a>
  );
};

/**
 * Render formatted price.
 * @param {ItemData} row - Row item
 * @returns {string} Formatted price
 */
const _renderPrice = (row: ItemData): string => `Rp ${row.price.toLocaleString("id-ID")}`;

/**
 * Render selection checkbox.
 * @param {ItemData} row - Row item
 * @param {string[]} selectedItemIds - Selected IDs
 * @param {(item: ItemData) => void} onToggleItem - Toggle callback
 * @returns {ReactElement} Checkbox element
 */
const _renderSelection = (row: ItemData, selectedItemIds: string[], onToggleItem: (item: ItemData) => void): ReactElement => {
  /**
   * Toggle row checkbox.
   * @param {boolean} _checked - New checked state
   * @returns {void} No return value
   */
  const handleToggle = (_checked: boolean): void => onToggleItem(row);

  return <CheckboxComponent ariaLabel={`Select ${row.name}`} checked={selectedItemIds.includes(row.id)} onChange={handleToggle} />;
};

/**
 * Render selection column when multi download is active.
 * @param {boolean} isMultiDownloadMode - Multi download active
 * @param {string[]} selectedItemIds - Selected IDs
 * @param {(item: ItemData) => void} onToggleItem - Toggle callback
 * @returns {TableColumn<ItemData>[]} Select column list
 */
const _getSelectColumn = (
  isMultiDownloadMode: boolean,
  selectedItemIds: string[],
  onToggleItem: (item: ItemData) => void,
): TableColumn<ItemData>[] => {
  if (!isMultiDownloadMode) {
    return [];
  }

  return [{
    key: "select",
    header: "",
    align: "center",
    /**
     * Render row selection.
     * @param {ItemData} row - Row item
     * @returns {ReactElement} Checkbox
     */
    render: (row: ItemData): ReactElement => _renderSelection(row, selectedItemIds, onToggleItem),
  }];
};

/**
 * Build column configurations for Master Item table.
 * @param {GetColumnsParams} params - Column parameters
 * @returns {TableColumn<ItemData>[]} Column definitions
 */
// ponytail: column list stays local; extract only when another item table shares it.
const _getColumns = (params: GetColumnsParams): TableColumn<ItemData>[] => {
  const { currentPage, pageSize, isMultiDownloadMode, selectedItemIds, onToggleItem, onEdit, onDownload } = params;

  return [
    ..._getSelectColumn(isMultiDownloadMode, selectedItemIds, onToggleItem),
    {
      key: "no",
      header: "No",
      align: "center",
      /**
       * Render row index.
       * @param {ItemData} _row - Row item
       * @param {number} index - Index
       * @returns {ReactElement} Node
       */
      render: (_row: ItemData, index: number): ReactElement => _renderIndex(currentPage, pageSize, index),
    },
    { key: "image", header: "Image", align: "center", render: _renderImage },
    { key: "name", header: "Item Name", mobile: { primary: true } },
    { key: "categoryName", header: "Category" },
    { key: "price", header: "Price", render: _renderPrice },
    { key: "stock", header: "Stock", align: "center" },
    { key: "duration", header: "Duration", align: "center" },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "remark", header: "Remark" },
    {
      key: "actions",
      header: "Action",
      align: "center",
      /**
       * Render action button.
       * @param {ItemData} row - Row item
       * @returns {ReactElement} Action element
       */
      render: (row: ItemData): ReactElement => _renderActionButton({ row, onEdit, onDownload }),
    },
  ];
};

/**
 * Render empty or loading state message.
 * @param {MasterItemProps} props - Component props
 * @returns {ReactElement | null} State message element or null
 */
const _renderListState = (props: MasterItemProps): ReactElement | null => {
  if (props.isLoading) {
    return <p className="py-10 text-center text-lg lg:text-sm text-brand-text-medium">Loading items…</p>;
  }

  if (props.isMissingData) {
    return <p className="py-10 text-center text-lg lg:text-sm text-red-600">Item data is unavailable. Please try again.</p>;
  }

  if (props.errorMessage) {
    return <p className="py-10 text-center text-lg lg:text-sm text-red-600">{props.errorMessage}</p>;
  }

  if (props.isEmpty) {
    return <p className="py-10 text-center text-lg lg:text-sm text-brand-text-medium">No items found.</p>;
  }

  return null;
};

/**
 * Render mobile item card.
 * @param {MobileItemCardProps} props - Item card props
 * @returns {ReactElement} Mobile item card
 */
const MobileItemCard = ({ item, onEdit }: MobileItemCardProps): ReactElement => {
  /**
   *
   */
  const handleClick = (): void => {
    onEdit(item);
  };

  return (
    <MasterDataCard title={item.name} status={item.status} isLargeText={true} onClick={handleClick}>
      <span className="grid gap-2 text-xl text-text-secondary">
        <span className="text-xl text-text-secondary">{item.categoryName ?? "No category"}</span>
        <span className="text-xl text-text-secondary">Rp {item.price.toLocaleString("id-ID")} · {item.stock} unit · {item.duration} days</span>
      </span>
    </MasterDataCard>
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
      <SearchFilter placeholder="Search item" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="min-w-0 space-y-3">
        {props.isLoading ? (
          <CardSkeletonComponent count={5} />
        ) : (
          _renderListState(props) ??
            props.paginatedData.map((item) => (
              <React.Fragment key={item.id}>
                <MobileItemCard item={item} onEdit={props.onEdit} />
              </React.Fragment>
            ))
        )}
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
 * Render desktop layout table.
 * @param {MasterItemProps} props - Component props
 * @returns {ReactElement} Desktop layout element
 */
// ponytail: keep desktop composition local until toolbar becomes reusable.
// eslint-disable-next-line max-lines-per-function
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
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search item" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={props.isMultiDownloadMode ? props.onDownloadSelected : props.onToggleMultiDownload}
            disabled={props.isMultiDownloadMode && props.selectedItemIds.length === 0}
            className="h-14 rounded-2xl border border-action-primary px-6 text-lg font-semibold text-action-primary hover:bg-action-primary-subtle disabled:cursor-not-allowed disabled:opacity-50"
          >
            {props.isMultiDownloadMode ? `Download Multiple (${props.selectedItemIds.length})` : "Download Multiple"}
          </button>
          {props.isMultiDownloadMode && (
            <button
              type="button"
              onClick={props.onCancelMultiDownload}
              className="h-14 rounded-2xl border border-border-default px-6 text-lg font-semibold text-text-primary hover:bg-background-subtle"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={props.onCreate}
            className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover"
          >
            Create Item
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? (
          <SkeletonComponent rows={5} columns={[{ width: "5%" }, { width: "35%" }, { width: "20%" }, { width: "20%" }, { width: "20%" }]} />
        ) : (
          _renderListState(props) ?? (
            <Table
              data={props.paginatedData}
              columns={_getColumns(props)}
              isDetail={false}
              keyExtractor={(row: ItemData): string => row.id}
            />
          )
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
      className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-lg font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden"
    >
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Item List">
      <PageLayout
        title="Item List"
        subtitle="Manage items and inventory data"
        breadcrumbs={["Master", "Master Item"]}
        headerRight={createButton}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
