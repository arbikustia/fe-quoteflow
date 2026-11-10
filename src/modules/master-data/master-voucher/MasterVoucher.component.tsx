import React from "react";
import { FiDownload, FiEdit2 } from "react-icons/fi";

import Layout from "../../../app/layout";
import { PageLayout } from "../../../app/shared/PageLayout";
import { Pagination } from "../../../components/Pagination";
import { SearchFilter } from "../../../components/SearchFilter";
import type { TableColumn } from "../../../components/Table";
import Table from "../../../components/Table";
import { formatIndonesianDateTime } from "../../../utils/date.helpers";

import type { MasterVoucherProps, VoucherData } from "./MasterVoucher.type";

/**
 * Render voucher row number.
 *
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @param {number} index - Row index
 * @returns {React.ReactElement} Number cell
 */
const _renderNumber = (currentPage: number, pageSize: number, index: number): React.ReactElement => (
  <span className="text-lg text-text-secondary">{(currentPage - 1) * pageSize + index + 1}</span>
);

/**
 * Render voucher name.
 *
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} Name cell
 */
const _renderName = (voucher: VoucherData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{voucher.name}</span>
);

/**
 * Render voucher code.
 *
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} Code cell
 */
const _renderCode = (voucher: VoucherData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{voucher.code}</span>
);

/**
 * Render voucher discount.
 *
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} Discount cell
 */
const _renderDiscount = (voucher: VoucherData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{voucher.discountPercent}%</span>
);

/**
 * Render voucher status.
 *
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} Status cell
 */
const _renderStatus = (voucher: VoucherData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${voucher.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
    {voucher.status}
  </span>
);

/**
 * Render voucher creation date.
 *
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} Date cell
 */
const _renderDate = (voucher: VoucherData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{voucher.createAt ? formatIndonesianDateTime(voucher.createAt) : "-"}</span>
);

/**
 * Render voucher row actions.
 *
 * @param {VoucherData} voucher - Voucher row
 * @param {MasterVoucherProps["onEdit"]} onEdit - Edit handler
 * @param {MasterVoucherProps["onDownload"]} onDownload - Download handler
 * @returns {React.ReactElement} Action cell
 */
const _renderActions = (voucher: VoucherData, onEdit: MasterVoucherProps["onEdit"], onDownload: MasterVoucherProps["onDownload"]): React.ReactElement => {
    /**
   * Handle voucher download.
   *
   * @param {React.MouseEvent} event - Event
   */
  const handleDownload = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onDownload?.(voucher);
  };
    /**
   * Handle voucher edit.
   *
   * @param {React.MouseEvent} event - Event
   */
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEdit?.(voucher);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button type="button" onClick={handleDownload} className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Download voucher" aria-label={`Download voucher ${voucher.code}`}>
        <FiDownload className="h-5 w-5" />
      </button>
      {onEdit && <button type="button" onClick={handleEdit} className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Edit voucher" aria-label={`Edit voucher ${voucher.code}`}>
        <FiEdit2 className="h-5 w-5" />
      </button>}
    </div>
  );
};

/**
 * Build voucher table columns.
 *
 * @param {MasterVoucherProps} props - Component props
 * @returns {TableColumn<VoucherData>[]} Voucher columns
 */
const _getColumns = (props: MasterVoucherProps): TableColumn<VoucherData>[] => {
    /**
   * @param {VoucherData} _voucher - Voucher
   * @param {number} index - Index
   * @returns {React.ReactElement} Rendered element
   */
  const renderNumber = (_voucher: VoucherData, index: number): React.ReactElement => _renderNumber(props.currentPage, props.pageSize, index);
    /**
   * @param {VoucherData} voucher - Voucher
   * @returns {React.ReactElement} Rendered element
   */
  const renderActions = (voucher: VoucherData): React.ReactElement => _renderActions(voucher, props.onEdit, props.onDownload);
  const columns: TableColumn<VoucherData>[] = [
    { key: "no", header: "No", align: "center", render: renderNumber },
    { key: "name", header: "Name", render: _renderName },
    { key: "code", header: "Voucher Code", render: _renderCode },
    { key: "discountPercent", header: "Discount (%)", align: "center", render: _renderDiscount },
    { key: "status", header: "Status", align: "center", render: _renderStatus },
    { key: "createAt", header: "Created At", render: _renderDate },
  ];

  if (props.onEdit || props.onDownload) {
    columns.push({ key: "actions", header: "Action", align: "center", render: renderActions });
  }

  return columns;
};

/**
 * Render voucher list state.
 *
 * @param {MasterVoucherProps} props - Component props
 * @returns {React.ReactElement | null} List state
 */
const _renderListState = (props: MasterVoucherProps): React.ReactElement | null => {
  if (props.isMissingData) return <p className="py-10 text-center text-lg text-danger">Voucher data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No vouchers found.</p>;

  return null;
};

/**
 * Render voucher action skeleton.
 *
 * @returns {React.ReactElement} Rendered element
 */
const _renderActionSkeleton = (): React.ReactElement => (
  <div className="flex justify-center gap-1">
    <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
    <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
  </div>
);

/**
 * Render voucher table skeleton.
 *
 * @param {MasterVoucherProps} props - Component props
 * @returns {React.ReactElement} Table skeleton
 */
const _renderTableSkeleton = (props: MasterVoucherProps): React.ReactElement => {
  const columns = _getColumns(props);
  const widths = ["w-6", "w-40", "w-32", "w-24", "w-28", "w-28"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading voucher table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column.key} className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${column.align === "center" ? "text-center" : "text-left"} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_value, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {columns.map((column, columnIndex) => (
                <td key={column.key} className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}>
                  {column.key === "actions" ? _renderActionSkeleton() : <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${column.key === "status" ? "w-28 rounded-full" : widths[columnIndex]}`} />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Render voucher mobile card skeleton.
 *
 * @param {number} key - Skeleton key
 * @returns {React.ReactElement} Card skeleton
 */
const _renderMobileCardSkeleton = (key: number): React.ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading voucher card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="h-7 w-32 rounded-3xl bg-background-subtle" />
      <span className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div><div className="h-7 w-20 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" /></div>
      <div className="text-right"><div className="ml-auto h-7 w-20 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" /></div>
    </div>
  </div>
);

/**
 * Render voucher mobile card.
 *
 * @param {VoucherData} voucher - Voucher row
 * @param {MasterVoucherProps["onEdit"]} onEdit - Edit action
 * @returns {React.ReactElement} Voucher card
 */
const _renderVoucherCard = (voucher: VoucherData, onEdit: MasterVoucherProps["onEdit"]): React.ReactElement => {
    /**
   * @returns {void} Resolved value
   */
  const handleClick = (): void => {
    if (onEdit) onEdit(voucher);
  };

  return (
    <button type="button" disabled={!onEdit} onClick={handleClick} className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{voucher.code}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${voucher.status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>{voucher.status}</span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0"><span className="block text-lg text-text-tertiary">Discount</span><span className="mt-1 block text-lg font-medium text-text-primary">{voucher.discountPercent}%</span></span>
        <span className="min-w-0 text-right"><span className="block text-lg text-text-tertiary">Created At</span><span className="mt-1 block text-lg font-medium text-text-primary">{voucher.createAt ? formatIndonesianDateTime(voucher.createAt) : "-"}</span></span>
      </span>
    </button>
  );
};

/**
 * Render voucher mobile list.
 *
 * @param {MasterVoucherProps} props - Component props
 * @returns {React.ReactElement} Mobile element
 */
const _renderMobile = (props: MasterVoucherProps): React.ReactElement => {
    /**
   * @param {React.ChangeEvent<HTMLInputElement>} event - Event
   * @returns {void} Resolved value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter placeholder="Search voucher" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index)) : _renderListState(props) ?? props.paginatedData.map((voucher) => <React.Fragment key={voucher.id}>{_renderVoucherCard(voucher, props.onEdit)}</React.Fragment>)}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
    </div>
  );
};

/**
 * Render voucher desktop table.
 *
 * @param {MasterVoucherProps} props - Component props
 * @returns {React.ReactElement} Desktop element
 */
const _renderDesktop = (props: MasterVoucherProps): React.ReactElement => {
    /**
   * @param {React.ChangeEvent<HTMLInputElement>} event - Event
   * @returns {void} Resolved value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
        <SearchFilter placeholder="Search voucher" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
        {props.onCreate && <button type="button" onClick={props.onCreate} className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">Create Voucher</button>}
      </div>
      <div className="flex-1 overflow-auto">
        {props.isLoading ? _renderTableSkeleton(props) : _renderListState(props) ?? <Table data={props.paginatedData} columns={_getColumns(props)} isDetail={false} keyExtractor={(row: VoucherData): string => row.id} />}
      </div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
    </div>
  );
};

/**
 * Render master voucher page component.
 *
 * @param {MasterVoucherProps} props - Component props
 * @returns {React.ReactElement} Page element
 */
export const MasterVoucherComponent = (props: MasterVoucherProps): React.ReactElement => {
  const createButton = props.onCreate ? (
    <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden">
      Create New
    </button>
  ) : null;

  return (
    <Layout pageTitle="Voucher List">
      <PageLayout title="Voucher List" subtitle="Manage discount codes and vouchers" breadcrumbs={["Master", "Master Voucher"]} headerRight={createButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobile(props)}
          {_renderDesktop(props)}
        </div>
      </PageLayout>
    </Layout>
  );
};
