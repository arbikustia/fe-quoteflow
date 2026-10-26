import * as React from "react";
import { FiDownload, FiEdit2 } from "react-icons/fi";

import Layout from "../../app/layout";
import { PageLayout } from "../../app/shared/PageLayout";
import { MasterDataCard } from "../../components/MasterDataCard";
import { Pagination } from "../../components/Pagination";
import { SearchFilter } from "../../components/SearchFilter";
import type { TableColumn } from "../../components/Table";
import Table from "../../components/Table";

import type { MasterVoucherProps, VoucherData } from "./MasterVoucher.type";

/**
 * Build voucher table columns.
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @param {(voucher: VoucherData) => void} onEdit - Edit handler
 * @param {((voucher: VoucherData) => void) | undefined} onDownload - Download handler
 * @returns {TableColumn<VoucherData>[]} Voucher columns
 */
const _getColumns = (currentPage: number, pageSize: number, onEdit: (voucher: VoucherData) => void, onDownload?: (voucher: VoucherData) => void): TableColumn<VoucherData>[] => {
  /**
   * Render row number.
   * @param {VoucherData} _row - Voucher row
   * @param {number} index - Row index
   * @returns {React.ReactElement} Number cell
   */
  const renderNo = (_row: VoucherData, index: number): React.ReactElement => <span className="text-sm text-brand-text-medium">{(currentPage - 1) * pageSize + index + 1}</span>;
  /**
   * Render discount.
   * @param {VoucherData} row - Voucher row
   * @returns {string} Discount label
   */
  const renderDiscount = (row: VoucherData): string => `${row.discountPercent}%`;
  /**
   * Render status.
   * @param {VoucherData} row - Voucher row
   * @returns {React.ReactElement} Status cell
   */
  const renderStatus = (row: VoucherData): React.ReactElement => <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{row.status}</span>;
  /**
   * Render creation date.
   * @param {VoucherData} row - Voucher row
   * @returns {string} Creation date
   */
  const renderDate = (row: VoucherData): string => row.createAt ?? "-";
  /**
   * Render action buttons.
   * @param {VoucherData} row - Voucher row
   * @returns {React.ReactElement} Action buttons
   */
  const renderActions = (row: VoucherData): React.ReactElement => {
    /**
     * Handle voucher download.
     * @param {React.MouseEvent} event - Click event
     * @returns {void} No return value
     */
    const handleDownload = (event: React.MouseEvent): void => {
      event.stopPropagation();
      onDownload?.(row);
    };
    /**
     * Handle voucher edit.
     * @param {React.MouseEvent} event - Click event
     * @returns {void} No return value
     */
    const handleEdit = (event: React.MouseEvent): void => {
      event.stopPropagation();
      onEdit(row);
    };

    return <div className="flex items-center justify-center gap-2"><button type="button" onClick={handleDownload} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue" title="Download voucher" aria-label={`Download voucher ${row.code}`}><FiDownload className="h-4 w-4" /></button><button type="button" onClick={handleEdit} className="cursor-pointer rounded-lg p-1.5 text-brand-text-medium transition-colors hover:bg-brand-blue-light hover:text-brand-blue" title="Edit" aria-label={`Edit voucher ${row.code}`}><FiEdit2 className="h-4 w-4" /></button></div>;
  };

  return [
    { key: "no", header: "No", align: "center", render: renderNo },
    { key: "name", header: "Name" },
    { key: "code", header: "Voucher Code", mobile: { primary: true } },
    { key: "discountPercent", header: "Discount (%)", align: "center", render: renderDiscount, mobile: { primary: true } },
    { key: "status", header: "Status", align: "center", render: renderStatus },
    { key: "createAt", header: "Created At", render: renderDate },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render voucher list state.
 * @param {MasterVoucherProps} props - Component props
 * @returns {React.ReactElement | null} List state
 */
const _renderListState = (props: MasterVoucherProps): React.ReactElement | null => {
  if (props.isLoading) return <p className="py-10 text-center text-sm text-brand-text-medium">Loading vouchers…</p>;

  if (props.isMissingData) return <p className="py-10 text-center text-sm text-red-600">Voucher data is unavailable. Please try again.</p>;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-red-600">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-brand-text-medium">No vouchers found.</p>;

  return null;
};

/**
 * Render voucher mobile card.
 * @param {VoucherData} voucher - Voucher row
 * @param {MasterVoucherProps["onEdit"]} onEdit - Edit action
 * @returns {React.ReactElement} Voucher card
 */
const _renderVoucherCard = (voucher: VoucherData, onEdit: MasterVoucherProps["onEdit"]): React.ReactElement => {
  /**
   * Open voucher editing.
   * @returns {void} No return value
   */
  const handleClick = (): void => onEdit(voucher);

  return (
    <MasterDataCard title={voucher.code} status={voucher.status} isLargeText={true} onClick={handleClick}>
      <span className="grid gap-2 text-xl text-text-secondary">
        <span>Discount {voucher.discountPercent}%</span>
        <span>Created {voucher.createAt || "-"}</span>
      </span>
    </MasterDataCard>
  );
};

/**
 * Render voucher mobile list.
 * @param {MasterVoucherProps} props - Component props
 * @returns {React.ReactElement} Mobile element
 */
const _renderMobile = (props: MasterVoucherProps): React.ReactElement => {
  /**
   * Update search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden"><SearchFilter placeholder="Search voucher" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" /><div className="min-w-0 space-y-3">{_renderListState(props) ?? props.paginatedData.map((voucher) => <React.Fragment key={voucher.id}>{_renderVoucherCard(voucher, props.onEdit)}</React.Fragment>)}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" /></div>;
};

/**
 * Render voucher desktop table.
 * @param {MasterVoucherProps} props - Component props
 * @returns {React.ReactElement} Desktop element
 */
const _renderDesktop = (props: MasterVoucherProps): React.ReactElement => {
  const columns = _getColumns(props.currentPage, props.pageSize, props.onEdit, props.onDownload);

  /**
   * Update search term.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void} No return value
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return <div className="hidden lg:flex rounded-4xl border border-brand-gray-light bg-brand-white px-6 shadow-xs md:flex-1 md:flex-col md:overflow-hidden md:mt-6"><div className="flex items-center justify-between gap-4 py-6"><SearchFilter placeholder="Search voucher" onChange={handleSearch} /><button type="button" onClick={props.onCreate} className="rounded-xl bg-brand-blue h-14 px-6 text-sm font-semibold text-brand-white">Create Voucher</button></div><div className="flex-1 overflow-auto">{_renderListState(props) ?? <Table data={props.paginatedData} columns={columns} isDetail={false} keyExtractor={(row: VoucherData) => row.id} />}</div><Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} /></div>;
};

/**
 * Render master voucher page component.
 * @param {MasterVoucherProps} props - Component props
 * @returns {React.ReactElement} Page element
 */
export const MasterVoucherComponent = (props: MasterVoucherProps): React.ReactElement => {
  const createButton = <button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-brand-blue bg-background-surface px-6 text-sm font-bold text-brand-blue transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30">Create New</button>;

  return <Layout pageTitle="Voucher List" mobileWhiteBackground={true}><PageLayout title="Voucher List" breadcrumbs={["Master", "Master Voucher"]} headerRight={createButton} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}><div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">{_renderMobile(props)}{_renderDesktop(props)}</div></PageLayout></Layout>;
};
