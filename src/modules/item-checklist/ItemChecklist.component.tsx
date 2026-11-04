import type { ChangeEvent, MouseEvent, ReactElement } from "react";
import { FiDownload, FiEdit2 } from "react-icons/fi";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";
import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ChecklistListState, ChecklistRow, ItemChecklistMobileCardProps } from "./ItemChecklist.type";

/** Render checklist status consistently across card and table. */
const _renderStatus = (row: ChecklistRow): ReactElement => {
  let statusClass = "bg-warning-subtle text-warning-strong";
  if (row.status === "active") statusClass = "bg-success-subtle text-success-strong";
  if (row.status === "inactive") statusClass = "bg-danger-subtle text-danger-strong";
  const label = row.status === "unavailable" ? "Status unavailable" : row.status;

  return <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${statusClass}`}>{label}</span>;
};

const _getColumns = (props: ChecklistListState): TableColumn<ChecklistRow>[] => [
  { key: "no", header: "No", align: "center", render: (_row, index): ReactElement => <span className="text-lg text-text-secondary">{(props.currentPage - 1) * props.pageSize + index + 1}</span> },
  { key: "checklistNo", header: "Checklist No", render: (row): ReactElement => <span className="text-lg font-medium text-text-primary">{row.checklistNo}</span> },
  { key: "checklistDate", header: "Checklist Date", render: (row): ReactElement => <span className="text-lg text-text-secondary">{formatIndonesianDateTime(row.checklistDate)}</span> },
  { key: "itemCount", header: "Items", align: "center", render: (row): ReactElement => <span className="text-lg">{row.itemCount}</span> },
  { key: "status", header: "Status", align: "center", render: (row): ReactElement => _renderStatus(row) },
  {
    key: "actions", header: "Action", align: "center", render: (row): ReactElement => (
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={(event: MouseEvent<HTMLButtonElement>): void => { event.stopPropagation(); props.onEdit(row); }}
          className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          title={`Edit ${row.checklistNo}`}
          aria-label={`Edit ${row.checklistNo}`}
        >
          <FiEdit2 className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={(event: MouseEvent<HTMLButtonElement>): void => { event.stopPropagation(); props.onDownload(row); }}
          disabled={props.isDownloadingId !== null}
          className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-wait disabled:opacity-50"
          title={`Download PDF ${row.checklistNo}`}
          aria-label={`Download PDF ${row.checklistNo}`}
        >
          <FiDownload className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    ),
  },
];


/** Render mobile checklist card with same hierarchy as quotation cards. */
export const ItemChecklistMobileCard = ({ row, onClick }: ItemChecklistMobileCardProps): ReactElement => {
  const handleClick = (): void => onClick(row);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{row.checklistNo}</span>
        {_renderStatus(row)}
      </span>
      <span className="mt-4 block text-lg text-text-secondary">{row.itemCount} items</span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4 text-lg text-text-secondary">
        <span className="min-w-0">
          <span className="block text-lg text-text-tertiary">Checklist date</span>
          <span className="mt-1 block font-medium text-text-primary">{formatIndonesianDateTime(row.checklistDate)}</span>
        </span>
      </span>
    </button>
  );
};

/** Render mobile card skeleton matching checklist card. */
const _renderMobileCardSkeleton = (key: number): ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading item checklist card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-28 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-20 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 h-7 w-4/5 rounded-3xl bg-background-subtle" />
    <div className="mt-1.5 h-7 w-3/5 rounded-3xl bg-background-subtle" />
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div className="min-w-0">
        <div className="h-7 w-24 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-32 rounded-3xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/** Render table skeleton with same columns and action cells as checklist table. */
const _renderTableSkeleton = (columns: TableColumn<ChecklistRow>[]): ReactElement => {
  const widths = ["w-6", "w-28", "w-24", "w-12"];

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading item checklist table">
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
                    <div className="flex justify-center gap-2">
                      <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
                      <span className="h-10 w-10 rounded-3xl bg-background-subtle" />
                    </div>
                  ) : (
                    <span
                      className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${
                        column.key === "status" ? "w-20 rounded-full" : widths[index]
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

const _renderListState = (props: ChecklistListState): ReactElement | null => {
  if (props.errorMessage) return <p role="alert" className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No item checklists found.</p>;
  return null;
};

/** Render checklist list and edit actions. */
export const ItemChecklistComponent = (props: ChecklistListState): ReactElement => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  const columns = _getColumns(props);
  const state = _renderListState(props);

  return (
    <Layout pageTitle="Item Checklist List">
      <PageLayout
        title="Item Checklist List"
        subtitle="Manage rental item checklists and status"
        breadcrumbs={["Item Checklist", "Item Checklist List"]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
        headerRight={
          <button
            type="button"
            onClick={props.onCreate}
            className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-semibold text-action-primary hover:bg-action-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:hidden"
          >
            Create New
          </button>
        }
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
          <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
            <SearchFilter
              placeholder="Search item checklist"
              onChange={handleSearchChange}
              isRoundedFull={true}
              className="w-full sm:w-full"
              inputClassName="!h-16 text-xl placeholder:text-xl"
            />
            <div className="flex min-w-0 flex-col gap-4">
              {props.isLoading ? (
                Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
              ) : (
                state ?? props.rows.map((row) => <ItemChecklistMobileCard key={row.id} row={row} onClick={props.onRowClick} />)
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
              className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs"
            />
          </div>
          <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
            <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
              <SearchFilter
                placeholder="Search item checklist"
                onChange={handleSearchChange}
                isRoundedFull={true}
                inputClassName="text-lg placeholder:text-lg"
              />
              <button
                type="button"
                onClick={props.onCreate}
                className="h-14 rounded-2xl bg-action-primary px-8 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                Create Item Checklist
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {props.isLoading ? (
                _renderTableSkeleton(columns)
              ) : (
                state ?? (
                  <Table
                    data={props.rows}
                    columns={columns}
                    isDetail={true}
                    onRowClick={props.onRowClick}
                    keyExtractor={(row): string => row.id}
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
              className="pt-4"
            />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};
