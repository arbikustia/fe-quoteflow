import type { ChangeEvent, MouseEvent, ReactElement } from "react";
import { FiEdit2 } from "react-icons/fi";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ItemReturnMobileCardProps, ReturnListState, ReturnRow } from "./ItemReturn.type";

/**
 * Render return status badge.
 * @param {ReturnRow} row - Return row data
 * @returns {ReactElement} Badge element
 */
const _renderStatus = (row: ReturnRow): ReactElement => {
  let statusClass = "bg-warning-subtle text-warning-strong";
  if (row.status === "active") statusClass = "bg-success-subtle text-success-strong";
  if (row.status === "inactive") statusClass = "bg-danger-subtle text-danger-strong";
  const label = row.status === "unavailable" ? "Status unavailable" : row.status;

  return (
    <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${statusClass}`}>
      {label}
    </span>
  );
};

/**
 * Return table columns definition for item returns.
 * @param {ReturnListState} props - List properties
 * @returns {TableColumn<ReturnRow>[]} Column definitions
 */
const _getColumns = (props: ReturnListState): TableColumn<ReturnRow>[] => [
  {
    key: "no",
    header: "No",
    align: "center",
    render: (_row, index): ReactElement => (
      <span className="text-lg">{(props.currentPage - 1) * props.pageSize + index + 1}</span>
    ),
  },
  {
    key: "orderId",
    header: "Order ID",
    render: (row): ReactElement => <span className="text-lg font-medium">{row.orderId}</span>,
  },
  {
    key: "returnDate",
    header: "Return Date",
    render: (row): ReactElement => <span className="text-lg text-text-secondary">{formatIndonesianDateTime(row.returnDate)}</span>,
  },
  {
    key: "itemCount",
    header: "Items",
    align: "center",
    render: (row): ReactElement => <span className="text-lg">{row.itemCount} items</span>,
  },
  {
    key: "notes",
    header: "Notes",
    render: (row): ReactElement => <span className="text-lg">{row.notes}</span>,
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row): ReactElement => _renderStatus(row),
  },
  {
    key: "actions",
    header: "Action",
    align: "center",
    render: (row): ReactElement => (
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={(event: MouseEvent<HTMLButtonElement>): void => {
            event.stopPropagation();
            props.onEdit(row);
          }}
          className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          title={`Edit ${row.orderId}`}
          aria-label={`Edit ${row.orderId}`}
        >
          <FiEdit2 className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    ),
  },
];

/**
 * Render mobile return card with same hierarchy as item checklist cards.
 * @param {ItemReturnMobileCardProps} props - Card properties
 * @returns {ReactElement} Mobile card element
 */
export const ItemReturnMobileCard = ({ row, onClick }: ItemReturnMobileCardProps): ReactElement => {
  const handleClick = (): void => onClick(row);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{row.orderId}</span>
        {_renderStatus(row)}
      </span>
      <span className="mt-4 block break-words text-lg text-text-secondary">
        {row.notes && row.notes !== "-" ? row.notes : "No remark"}
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0 text-lg text-text-secondary">
          <span className="block text-lg text-text-tertiary">Return date</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">
            {formatIndonesianDateTime(row.returnDate)}
          </span>
        </span>
        <span className="text-right tabular-nums">
          <span className="block text-lg text-text-tertiary">Total Items</span>
          <span className="mt-1 block text-xl font-semibold text-text-primary">{row.itemCount} items</span>
        </span>
      </span>
    </button>
  );
};

/**
 * Render mobile card skeleton matching return card.
 * @param {number} key - Unique key
 * @returns {ReactElement} Skeleton card element
 */
const _renderMobileCardSkeleton = (key: number): ReactElement => (
  <div
    key={key}
    className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small"
    role="status"
    aria-label="Loading item return card"
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-28 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 h-7 w-4/5 rounded-3xl bg-background-subtle" />
    <div className="mt-1.5 h-7 w-3/5 rounded-3xl bg-background-subtle" />
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div className="min-w-0">
        <div className="h-7 w-20 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-36 rounded-3xl bg-background-subtle" />
      </div>
      <div className="text-right">
        <div className="ml-auto h-7 w-12 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-20 rounded-3xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/**
 * Render table skeleton for item return.
 * @param {TableColumn<ReturnRow>[]} columns - Columns
 * @returns {ReactElement} Skeleton table
 */
const _renderTableSkeleton = (columns: TableColumn<ReturnRow>[]): ReactElement => {
  const widths = ["w-6", "w-28", "w-24", "w-16", "w-32"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading item return table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${
                  column.align === "center" ? "text-center" : "text-left"
                } ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_value, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {columns.map((column, index) => (
                <td
                  key={column.key}
                  className={`border-b border-border-default px-5 py-4 ${
                    column.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {column.key === "actions" ? (
                    <div className="flex justify-center gap-1">
                      <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
                    </div>
                  ) : (
                    <span
                      className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${
                        column.key === "status" ? "w-28 rounded-full" : (widths[index] ?? "w-16")
                      }`}
                    />
                  )}
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
 * Render list error or empty state.
 * @param {ReturnListState} props - List properties
 * @returns {ReactElement | null} State element
 */
const _renderListState = (props: ReturnListState): ReactElement | null => {
  if (props.errorMessage) {
    return (
      <p role="alert" className="py-10 text-center text-lg text-danger">
        {props.errorMessage}
      </p>
    );
  }

  if (props.isEmpty) {
    return (
      <p className="py-10 text-center text-lg text-text-secondary">
        No item returns found.
      </p>
    );
  }

  return null;
};

/**
 * Render item return list page.
 * @param {ReturnListState} props - List properties
 * @returns {ReactElement} Page element
 */
export const ItemReturnComponent = (props: ReturnListState): ReactElement => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  const columns = _getColumns(props);
  const state = _renderListState(props);

  const mobileContent = props.isLoading
    ? Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
    : (state ?? props.rows.map((row) => <ItemReturnMobileCard key={row.id} row={row} onClick={props.onRowClick} />));

  const desktopContent = props.isLoading
    ? _renderTableSkeleton(columns)
    : (state ?? <Table data={props.rows} columns={columns} isDetail={true} onRowClick={props.onRowClick} keyExtractor={(row): string => row.id} />);

  return (
    <Layout pageTitle="Item Return List">
      <PageLayout
        title="Item Return List"
        subtitle="Manage rental item returns and status"
        breadcrumbs={["Item Return", "Item Return List"]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
        headerRight={
          <button
            type="button"
            onClick={props.onCreate}
            className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-4 text-lg font-semibold text-action-primary hover:bg-action-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:hidden"
          >
            Create New
          </button>
        }
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
            <SearchFilter
              placeholder="Search item return"
              onChange={handleSearchChange}
              isRoundedFull={true}
              className="w-full sm:w-full"
              inputClassName="!h-16 text-xl placeholder:text-xl"
            />
            <div className="flex min-w-0 flex-col gap-4">{mobileContent}</div>
            <Pagination
              currentPage={props.currentPage}
              totalPages={props.totalPages}
              pageSize={props.pageSize}
              onPageChange={props.goToPage}
              onPageSizeChange={props.changePageSize}
              totalItems={props.totalCount}
              isCompact={true}
              className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs"
            />
          </div>
          <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
            <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
              <SearchFilter
                placeholder="Search item return"
                onChange={handleSearchChange}
                isRoundedFull={true}
                inputClassName="text-lg placeholder:text-lg"
              />
              <button
                type="button"
                onClick={props.onCreate}
                className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover"
              >
                Create Item Return
              </button>
            </div>
            <div className="flex-1 overflow-auto">{desktopContent}</div>
            <Pagination
              currentPage={props.currentPage}
              totalPages={props.totalPages}
              pageSize={props.pageSize}
              onPageChange={props.goToPage}
              onPageSizeChange={props.changePageSize}
              totalItems={props.totalCount}
              className="pt-4"
            />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};

export default ItemReturnComponent;
