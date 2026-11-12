import type * as React from "react";
import { FiDownload, FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { VOUCHER_STATUS_BADGE_CLASS } from "./MasterVoucher.config";
import type { VoucherData, VoucherMobileCardProps, VoucherRowActions } from "./MasterVoucher.type";
import { getVoucherRowNumber } from "./MasterVoucher.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {VoucherData} voucher - Voucher of the row
 * @param {(voucher: VoucherData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  voucher: VoucherData,
  onEdit: (voucher: VoucherData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(voucher);
  };
};

/**
 * Render the voucher name cell.
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (voucher: VoucherData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{voucher.name}</span>
);

/**
 * Render the voucher code cell.
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} - Code cell
 */
const _renderCodeCell = (voucher: VoucherData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{voucher.code}</span>
);

/**
 * Render the discount percentage cell.
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} - Discount cell
 */
const _renderDiscountCell = (voucher: VoucherData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{`${voucher.discountPercent}%`}</span>
);

/**
 * Render the voucher status cell.
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (voucher: VoucherData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${VOUCHER_STATUS_BADGE_CLASS[voucher.status]}`}>
    {voucher.status}
  </span>
);

/**
 * Render the created-at cell.
 * @param {VoucherData} voucher - Voucher row
 * @returns {React.ReactElement} - Created-at cell
 */
const _renderCreatedAtCell = (voucher: VoucherData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{voucher.createdAt}</span>
);

/**
 * Create a download click handler that does not bubble up to the table row click.
 * @param {VoucherData} voucher - Voucher of the row
 * @param {(voucher: VoucherData) => void} onDownload - Download callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Download button click handler
 */
export const _createDownloadClickHandler = (
  voucher: VoucherData,
  onDownload: (voucher: VoucherData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onDownload(voucher);
  };
};

/**
 * Render the row action cell; download is always shown, edit needs permission.
 * @param {VoucherData} voucher - Voucher row
 * @param {VoucherRowActions} actions - Edit permission and callbacks
 * @returns {React.ReactElement} - Action cell
 */
const _renderActionCell = (voucher: VoucherData, actions: VoucherRowActions): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={_createDownloadClickHandler(voucher, actions.onDownload)}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="Download voucher"
      aria-label={`Download voucher ${voucher.code}`}
    >
      <FiDownload className="h-5 w-5" />
    </button>
    {actions.canEdit && (
      <button
        type="button"
        onClick={_createEditClickHandler(voucher, actions.onEdit)}
        className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
        title="Edit voucher"
        aria-label={`Edit voucher ${voucher.code}`}
      >
        <FiEdit2 className="h-5 w-5" />
      </button>
    )}
  </div>
);

/**
 * Build the voucher table columns; the action column always has the download button.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {VoucherRowActions} actions - Edit permission and row callbacks
 * @returns {TableColumn<VoucherData>[]} - Voucher table columns
 */
export const getVoucherColumns = (
  currentPage: number,
  pageSize: number,
  actions: VoucherRowActions,
): TableColumn<VoucherData>[] => {
  /**
   * Render the row number cell.
   * @param {VoucherData} _voucher - Voucher row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_voucher: VoucherData, rowIndex: number): React.ReactElement => (
    <span className="text-lg text-text-secondary">{getVoucherRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {VoucherData} voucher - Voucher row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (voucher: VoucherData): React.ReactElement => _renderActionCell(voucher, actions);

  return [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "name", header: "Name", render: _renderNameCell },
    { key: "code", header: "Voucher Code", render: _renderCodeCell },
    { key: "discountPercent", header: "Discount (%)", align: "center", render: _renderDiscountCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "createdAt", header: "Created At", render: _renderCreatedAtCell },
    { key: "actions", header: "Action", align: "center", render: renderActionCell },
  ];
};

/**
 * Get the table row key of a voucher.
 * @param {VoucherData} voucher - Voucher row
 * @returns {string} - Row key
 */
export const getVoucherRowKey = (voucher: VoucherData): string => voucher.id;

/**
 * Render a voucher card for the mobile list; disabled without edit permission.
 * @param {VoucherMobileCardProps} props - Voucher, edit permission and edit callback
 * @returns {React.ReactElement} - Voucher card
 */
export const renderVoucherMobileCard = (props: VoucherMobileCardProps): React.ReactElement => {
  const { voucher, canEdit, onEdit } = props;

  return (
    <button
      key={voucher.id}
      type="button"
      disabled={!canEdit}
      onClick={_createEditClickHandler(voucher, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-default disabled:hover:bg-background-surface"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{voucher.code}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${VOUCHER_STATUS_BADGE_CLASS[voucher.status]}`}>
          {voucher.status}
        </span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Discount</span>
          <span className="mt-1 block text-lg font-medium text-text-primary">{`${voucher.discountPercent}%`}</span>
        </span>
        <span className="min-w-0 text-right">
          <span className="block text-lg text-text-tertiary">Created At</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{voucher.createdAt}</span>
        </span>
      </span>
    </button>
  );
};
