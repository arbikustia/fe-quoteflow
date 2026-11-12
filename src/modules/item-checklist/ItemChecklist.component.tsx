import type { ChangeEvent, MouseEvent, ReactElement } from "react";
import { FiDownload, FiEdit2 } from "react-icons/fi";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import { ChecklistStatusBadge, ItemChecklistMobileCard } from "./ItemChecklist.helper";
import type { ChecklistListState, ChecklistRow } from "./ItemChecklist.type";
import { getChecklistRowKey, getChecklistRowNumber } from "./ItemChecklist.util";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render row actions.
 * @param {ChecklistRow} row - Checklist row
 * @param {ChecklistListState} props - Checklist list state
 * @returns {ReactElement} - Action buttons
 */
const _renderActions = (row: ChecklistRow, props: ChecklistListState): ReactElement => {
  /**
   * Handle edit click.
   * @param {MouseEvent<HTMLButtonElement>} event - Click event
   * @returns {void}
   */
  const handleEdit = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    props.onEdit(row);
  };
  /**
   * Handle download click.
   * @param {MouseEvent<HTMLButtonElement>} event - Click event
   * @returns {void}
   */
  const handleDownload = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    props.onDownload(row);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button type="button" onClick={handleEdit} className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring" title={`Edit ${row.checklistNo}`} aria-label={`Edit ${row.checklistNo}`}>
        <FiEdit2 className="h-5 w-5" aria-hidden="true" />
      </button>
      <button type="button" onClick={handleDownload} disabled={props.isDownloadingId !== null} className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-wait disabled:opacity-50" title={`Download PDF ${row.checklistNo}`} aria-label={`Download PDF ${row.checklistNo}`}>
        <FiDownload className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};

/**
 * Render the status cell.
 * @param {ChecklistRow} row - Checklist row
 * @returns {ReactElement} Status cell
 */
const _renderStatusCell = (row: ChecklistRow): ReactElement => <ChecklistStatusBadge status={row.status} />;

/**
 * Render the checklist number cell.
 * @param {ChecklistRow} row - Checklist row
 * @returns {ReactElement} Checklist number cell
 */
const _renderChecklistNo = (row: ChecklistRow): ReactElement => <span className="text-lg font-medium text-text-primary">{row.checklistNo}</span>;

/**
 * Render the customer name cell.
 * @param {ChecklistRow} row - Checklist row
 * @returns {ReactElement} Customer name cell
 */
const _renderCustomerName = (row: ChecklistRow): ReactElement => <span className="text-lg text-text-secondary">{row.customerName || "-"}</span>;

/**
 * Render the checklist date cell.
 * @param {ChecklistRow} row - Checklist row
 * @returns {ReactElement} Checklist date cell
 */
const _renderChecklistDate = (row: ChecklistRow): ReactElement => <span className="text-lg text-text-secondary">{formatIndonesianDateTime(row.checklistDate)}</span>;

/**
 * Render the item count cell.
 * @param {ChecklistRow} row - Checklist row
 * @returns {ReactElement} Item count cell
 */
const _renderItemCount = (row: ChecklistRow): ReactElement => <span className="text-lg">{row.itemCount}</span>;

/**
 * Get table columns.
 * @param {ChecklistListState} props - Checklist list state
 * @returns {TableColumn<ChecklistRow>[]} Table columns
 */
const _getColumns = (props: ChecklistListState): TableColumn<ChecklistRow>[] => {
  /**
   * Render row number.
   * @param {ChecklistRow} _row - Row data
   * @param {number} index - Row index
   * @returns {ReactElement} Number cell
   */
  const renderRowNumber = (_row: ChecklistRow, index: number): ReactElement => <span className="text-lg text-text-secondary">{getChecklistRowNumber(props.currentPage, props.pageSize, index)}</span>;

  /**
   * Render row actions.
   * @param {ChecklistRow} row - Row data
   * @returns {ReactElement} Action cell
   */
  const renderActions = (row: ChecklistRow): ReactElement => _renderActions(row, props);

  return [
    { key: "no", header: "No", align: "center", render: renderRowNumber },
    { key: "checklistNo", header: "Checklist No", render: _renderChecklistNo },
    { key: "customerName", header: "Customer Name", render: _renderCustomerName },
    { key: "checklistDate", header: "Checklist Date", render: _renderChecklistDate },
    { key: "itemCount", header: "Items", align: "center", render: _renderItemCount },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "actions", header: "Action", align: "center", render: renderActions },
  ];
};

/**
 * Render mobile loading cards.
 * @returns {ReactElement} - Loading cards
 */
const _renderMobileLoading = (): ReactElement => (
  <>{Array.from({ length: 5 }, (_value, index) => (
    <div key={index} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading item checklist card">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="h-7 w-28 rounded-3xl bg-background-subtle" /><div className="h-8 w-20 rounded-full bg-background-subtle" /></div>
      <div className="mt-4 h-7 w-4/5 rounded-3xl bg-background-subtle" /><div className="mt-1.5 h-7 w-3/5 rounded-3xl bg-background-subtle" />
      <div className="mt-4 border-t border-border-default pt-4"><div className="h-7 w-24 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-32 rounded-3xl bg-background-subtle" /></div>
    </div>
  ))}</>
);

/**
 * Render table loading state.
 * @param {TableColumn<ChecklistRow>[]} columns - Table columns
 * @returns {ReactElement} - Loading table
 */
const _renderTableLoading = (columns: TableColumn<ChecklistRow>[]): ReactElement => (
  <div className="w-full overflow-x-auto" role="status" aria-label="Loading item checklist table">
    <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
      <thead><tr>{columns.map((column) => <th key={column.key} className="bg-table-header px-5 py-4 text-center text-[13px] font-bold uppercase tracking-widest text-text-secondary">{column.header}</th>)}</tr></thead>
      <tbody>{Array.from({ length: 5 }, (_value, rowIndex) => <tr key={rowIndex} className="animate-pulse">{columns.map((column) => <td key={column.key} className="border-b border-border-default px-5 py-4 text-center"><span className="inline-block h-5 w-20 rounded-3xl bg-background-subtle" /></td>)}</tr>)}</tbody>
    </table>
  </div>
);

/**
 * Render list state message.
 * @param {ChecklistListState} props - Checklist list state
 * @returns {ReactElement | null} - State message
 */
const _renderListState = (props: ChecklistListState): ReactElement | null => {
  if (props.errorMessage) return <p role="alert" className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No item checklists found.</p>;

  return null;
};

/**
 * Render mobile content.
 * @param {ChecklistListState} props - Checklist list state
 * @returns {ReactElement} - Mobile content
 */
const _renderMobileContent = (props: ChecklistListState): ReactElement => {
  /**
   * Update the checklist search term.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
  <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
    <SearchFilter placeholder="Search item checklist" onChange={handleSearch} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
    <div className="flex min-w-0 flex-col gap-4">{props.isLoading ? _renderMobileLoading() : _renderListState(props) ?? props.rows.map((row) => <ItemChecklistMobileCard key={row.id} row={row} onClick={props.onRowClick} />)}</div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
  </div>
  );
};

/**
 * Render desktop content.
 * @param {ChecklistListState} props - Checklist list state
 * @returns {ReactElement} - Desktop content
 */
const _renderDesktopContent = (props: ChecklistListState): ReactElement => {
  const columns = _getColumns(props);
  /**
   * Update the checklist search term.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);


  return (
    <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
      <div className="flex items-center justify-between gap-4 border-b border-border-default py-6"><SearchFilter placeholder="Search item checklist" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" /><button type="button" onClick={props.onCreate} className="h-14 rounded-2xl bg-action-primary px-8 text-lg font-semibold text-text-inverse">Create Item Checklist</button></div>
      <div className="flex-1 overflow-auto">{props.isLoading ? _renderTableLoading(columns) : _renderListState(props) ?? <Table data={props.rows} columns={columns} isDetail={true} onRowClick={props.onRowClick} keyExtractor={getChecklistRowKey} />}</div>
      <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
    </div>
  );
};

/**
 * Render checklist list.
 * @param {ChecklistListState} props - Checklist list state
 * @returns {ReactElement} - Checklist list
 */
export const ItemChecklistComponent = (props: ChecklistListState): ReactElement => (
  <Layout pageTitle="Item Checklist List">
    <PageLayout title="Item Checklist List" subtitle="Manage rental item checklists and status" breadcrumbs={["Item Checklist", "Item Checklist List"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack} headerRight={<button type="button" onClick={props.onCreate} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-semibold text-action-primary lg:hidden">Create New</button>}>
      <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">{_renderMobileContent(props)}{_renderDesktopContent(props)}</div>
    </PageLayout>
  </Layout>
);
