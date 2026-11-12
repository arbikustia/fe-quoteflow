import type * as React from "react";
import { FiEdit2 } from "react-icons/fi";

import type { TableColumn } from "@/components/Table";

import { PIC_STATUS_BADGE_CLASS } from "./MasterPic.config";
import type { PicData, PicMobileCardProps } from "./MasterPic.type";
import { getPicRowNumber } from "./MasterPic.util";

/**
 * Create an edit click handler that does not bubble up to the table row click.
 * @param {PicData} pic - PIC of the row
 * @param {(pic: PicData) => void} onEdit - Edit callback
 * @returns {(event: React.MouseEvent<HTMLButtonElement>) => void} - Edit button click handler
 */
export const _createEditClickHandler = (
  pic: PicData,
  onEdit: (pic: PicData) => void,
): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
  return (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(pic);
  };
};

/**
 * Render the PIC name cell.
 * @param {PicData} pic - PIC row
 * @returns {React.ReactElement} - Name cell
 */
const _renderNameCell = (pic: PicData): React.ReactElement => (
  <span className="text-lg font-medium text-text-primary">{pic.name}</span>
);

/**
 * Render the PIC status cell.
 * @param {PicData} pic - PIC row
 * @returns {React.ReactElement} - Status badge cell
 */
const _renderStatusCell = (pic: PicData): React.ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${PIC_STATUS_BADGE_CLASS[pic.status]}`}>
    {pic.status}
  </span>
);

/**
 * Render the created-at cell.
 * @param {PicData} pic - PIC row
 * @returns {React.ReactElement} - Created-at cell
 */
const _renderCreatedAtCell = (pic: PicData): React.ReactElement => (
  <span className="text-lg text-text-secondary">{pic.createdAt}</span>
);

/**
 * Render the row action cell.
 * @param {PicData} pic - PIC row
 * @param {(pic: PicData) => void} onEdit - Edit callback
 * @returns {React.ReactElement} - Action cell
 */
const _renderActionCell = (pic: PicData, onEdit: (pic: PicData) => void): React.ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={_createEditClickHandler(pic, onEdit)}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary"
      title="Edit PIC"
      aria-label={`Edit PIC ${pic.name}`}
    >
      <FiEdit2 className="h-5 w-5" />
    </button>
  </div>
);

/**
 * Build the PIC table columns; the action column is shown only with edit permission.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {boolean} canEdit - Whether the user may edit PICs
 * @param {(pic: PicData) => void} onEdit - Edit callback
 * @returns {TableColumn<PicData>[]} - PIC table columns
 */
export const getPicColumns = (
  currentPage: number,
  pageSize: number,
  canEdit: boolean,
  onEdit: (pic: PicData) => void,
): TableColumn<PicData>[] => {
  /**
   * Render the row number cell.
   * @param {PicData} _pic - PIC row
   * @param {number} rowIndex - Zero-based row index
   * @returns {React.ReactElement} - Row number cell
   */
  const renderNumberCell = (_pic: PicData, rowIndex: number): React.ReactElement => (
    <span className="text-lg text-text-secondary">{getPicRowNumber(currentPage, pageSize, rowIndex)}</span>
  );

  /**
   * Render the row action cell.
   * @param {PicData} pic - PIC row
   * @returns {React.ReactElement} - Action cell
   */
  const renderActionCell = (pic: PicData): React.ReactElement => _renderActionCell(pic, onEdit);

  const columns: TableColumn<PicData>[] = [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "name", header: "PIC Name", render: _renderNameCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "createdAt", header: "Created At", render: _renderCreatedAtCell },
  ];

  if (!canEdit) {
    return columns;
  }

  return [...columns, { key: "actions", header: "Action", align: "center", render: renderActionCell }];
};

/**
 * Get the table row key of an PIC.
 * @param {PicData} pic - PIC row
 * @returns {string} - Row key
 */
export const getPicRowKey = (pic: PicData): string => pic.id;

/**
 * Render an PIC card for the mobile list; disabled without edit permission.
 * @param {PicMobileCardProps} props - PIC, edit permission and edit callback
 * @returns {React.ReactElement} - PIC card
 */
export const renderPicMobileCard = (props: PicMobileCardProps): React.ReactElement => {
  const { pic, canEdit, onEdit } = props;

  return (
    <button
      key={pic.id}
      type="button"
      disabled={!canEdit}
      onClick={_createEditClickHandler(pic, onEdit)}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-default disabled:hover:bg-background-surface"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{pic.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${PIC_STATUS_BADGE_CLASS[pic.status]}`}>
          {pic.status}
        </span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Created At</span>
          <span className="mt-1 block text-lg font-medium text-text-primary">{pic.createdAt}</span>
        </span>
      </span>
    </button>
  );
};
