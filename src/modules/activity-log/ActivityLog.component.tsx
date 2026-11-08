import type { ChangeEvent, ReactElement } from "react";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import Table, { type TableColumn } from "@/components/Table";

import { formatActivityDateTime, getActionBadgeClass } from "./ActivityLog.helpers";
import type { ActivityLogCardProps, ActivityLogData, ActivityLogProps } from "./ActivityLog.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render activity log mobile card with same hierarchy as quotation cards.
 * @param {ActivityLogCardProps} props - Activity log card props
 * @returns {ReactElement} Activity log card
 */
export const ActivityLogCard = ({ activity }: ActivityLogCardProps): ReactElement => (
  <article className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40">
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <span className="min-w-0 truncate text-lg font-medium text-text-secondary">{activity.page}</span>
      <span className={`rounded-full px-3.5 py-1 text-lg font-semibold capitalize ${getActionBadgeClass(activity.action)}`}>
        {activity.action}
      </span>
    </div>
    <h3 className="mt-4 block break-words text-xl font-semibold text-text-primary">
      {activity.description}
    </h3>
    <p className="mt-1.5 block break-words text-lg text-text-secondary">
      {activity.userName}
    </p>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div className="min-w-0 text-lg text-text-secondary">
        <span className="block text-lg text-text-tertiary">Logged at</span>
        <time className="mt-1 block break-words text-lg font-medium text-text-primary" dateTime={activity.createdAt}>
          {formatActivityDateTime(activity.createdAt)}
        </time>
      </div>
      <div className="text-right">
        <span className="block text-lg text-text-tertiary">User</span>
        <span className="mt-1 block text-lg font-semibold text-text-primary">{activity.userName}</span>
      </div>
    </div>
  </article>
);

/**
 * Render the row number cell.
 * @param {ActivityLogProps} props - Activity log props
 * @param {ActivityLogData} _row - Activity row
 * @param {number} index - Row index
 * @returns {ReactElement} Row number
 */
const _renderRowNumber = (props: ActivityLogProps, _row: ActivityLogData, index: number): ReactElement => <span className="text-lg">{(props.currentPage - 1) * props.pageSize + index + 1}</span>;
/**
 * Render the user name cell.
 * @param {ActivityLogData} row - Activity row
 * @returns {ReactElement} User name cell
 */
const _renderUserName = (row: ActivityLogData): ReactElement => <span className="text-lg font-medium">{row.userName}</span>;
/**
 * Render the action cell.
 * @param {ActivityLogData} row - Activity row
 * @returns {ReactElement} Action cell
 */
const _renderAction = (row: ActivityLogData): ReactElement => <span className={`inline-flex rounded-full px-4 py-1.5 text-lg font-semibold capitalize ${getActionBadgeClass(row.action)}`}>{row.action}</span>;
/**
 * Render the page cell.
 * @param {ActivityLogData} row - Activity row
 * @returns {ReactElement} Page cell
 */
const _renderPage = (row: ActivityLogData): ReactElement => <span className="text-lg">{row.page}</span>;
/**
 * Render the description cell.
 * @param {ActivityLogData} row - Activity row
 * @returns {ReactElement} Description cell
 */
const _renderDescription = (row: ActivityLogData): ReactElement => <span className="text-lg">{row.description}</span>;
/**
 * Render the timestamp cell.
 * @param {ActivityLogData} row - Activity row
 * @returns {ReactElement} Timestamp cell
 */
const _renderCreatedAt = (row: ActivityLogData): ReactElement => <span className="text-lg">{formatActivityDateTime(row.createdAt)}</span>;

/**
 * Build activity log table columns.
 * @param {ActivityLogProps} props - Activity log page props
 * @returns {TableColumn<ActivityLogData>[]} Table columns
 */
const _getColumns = (props: ActivityLogProps): TableColumn<ActivityLogData>[] => {
  /**
   * Render row number.
   * @param {ActivityLogData} row - Activity row
   * @param {number} index - Row index
   * @returns {ReactElement} Row number cell
   */
  const renderRowNumber = (row: ActivityLogData, index: number): ReactElement => _renderRowNumber(props, row, index);

  return [
  { key: "no", header: "No", align: "center", render: renderRowNumber },
  { key: "userName", header: "User Name", render: _renderUserName },
  { key: "action", header: "Action", align: "center", render: _renderAction },
  { key: "page", header: "Page", render: _renderPage },
  { key: "description", header: "Description", render: _renderDescription },
  { key: "createdAt", header: "Date & Time", render: _renderCreatedAt },
  ];
};

/**
 * Render activity log mobile card skeleton matching real card hierarchy.
 * @param {number} key - Skeleton key
 * @returns {ReactElement} Mobile card skeleton
 */
const _renderMobileCardSkeleton = (key: number): ReactElement => (
  <div
    key={key}
    className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small"
    role="status"
    aria-label="Loading activity log card"
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-24 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-20 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 h-7 w-4/5 rounded-3xl bg-background-subtle" />
    <div className="mt-1.5 h-7 w-2/5 rounded-3xl bg-background-subtle" />
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div className="min-w-0">
        <div className="h-7 w-16 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-32 rounded-3xl bg-background-subtle" />
      </div>
      <div className="text-right">
        <div className="ml-auto h-7 w-12 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-24 rounded-3xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/**
 * Render activity log table skeleton with matching column structure.
 * @param {TableColumn<ActivityLogData>[]} columns - Table column definitions
 * @returns {ReactElement} Table skeleton
 */
const _renderTableSkeleton = (columns: TableColumn<ActivityLogData>[]): ReactElement => {
  const widths = ["w-6", "w-28", "w-20", "w-24", "w-48", "w-32"];
  /**
   * Render a skeleton table header.
   * @param {TableColumn<ActivityLogData>} column - Column definition
   * @param {number} index - Column index
   * @returns {ReactElement} Header cell
   */
  const renderHeader = (column: TableColumn<ActivityLogData>, index: number): ReactElement => <th key={column.key} className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${column.align === "center" ? "text-center" : "text-left"} ${index === 0 ? "rounded-l-3xl" : ""} ${index === columns.length - 1 ? "rounded-r-3xl" : ""}`}>{column.header}</th>;
  /**
   * Render a skeleton table row.
   * @param {number} _value - Array value
   * @param {number} rowIndex - Row index
   * @returns {ReactElement} Skeleton row
   */
  const renderRow = (_value: number, rowIndex: number): ReactElement => <tr key={rowIndex} className="animate-pulse">{columns.map((column, index) => <td key={column.key} className={`border-b border-border-default px-5 py-4 ${column.align === "center" ? "text-center" : "text-left"}`}><span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${column.key === "action" ? "w-24 rounded-full" : widths[index] || "w-24"}`} /></td>)}</tr>;

  return (
    <div className="w-full overflow-x-auto" role="status" aria-label="Loading activity log table">
      <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
        <thead>
          <tr>
            {columns.map(renderHeader)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, renderRow)}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Render activity log list state.
 * @param {ActivityLogProps} props - Activity log page props
 * @returns {ReactElement | null} List state
 */
const _renderListState = (props: ActivityLogProps): ReactElement | null => {
  if (props.errorMessage) return <p className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-lg text-text-secondary">No activity logs found.</p>;

  return null;
};

/**
 * Render mobile activity log list.
 * @param {ActivityLogProps} props - Activity log page props
 * @param {ReactElement | null} listState - List state
 * @returns {ReactElement} Mobile list
 */
const _renderMobileList = (props: ActivityLogProps, listState: ReactElement | null): ReactElement => {
  /**
   * Update the activity search term.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);

  return (
    <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
      <SearchFilter
        placeholder="Search activity log"
        onChange={handleSearch}
        isRoundedFull={true}
        className="w-full sm:w-full"
        inputClassName="!h-16 text-xl placeholder:text-xl"
      />
      <div className="flex min-w-0 flex-col gap-4">
        {props.isLoading ? (
          Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))
        ) : (
          listState ?? props.paginatedData.map((activity) => (
            <ActivityLogCard key={activity.id} activity={activity} />
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
        className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs"
      />
    </div>
  );
};

/**
 * Render desktop activity log table.
 * @param {ActivityLogProps} props - Activity log page props
 * @param {TableColumn<ActivityLogData>[]} columns - Table columns
 * @param {ReactElement | null} listState - List state
 * @returns {ReactElement} Desktop table
 */
const _renderDesktopTable = (
  props: ActivityLogProps,
  columns: TableColumn<ActivityLogData>[],
  listState: ReactElement | null,
): ReactElement => {
  /**
   * Update the activity search term.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input event
   * @returns {void} No return value
   */
  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  const tableContent = props.isLoading ? _renderTableSkeleton(columns) : listState ?? <Table data={props.paginatedData} columns={columns} keyExtractor={(row: ActivityLogData): string => row.id} />;

  return <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
    <div className="flex items-center justify-between gap-4 border-b border-border-default py-6"><SearchFilter placeholder="Search activity log" onChange={handleSearch} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" /></div>
    <div className="flex-1 overflow-auto">{tableContent}</div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} className="pt-4" />
  </div>;
};

/**
 * Render activity log list page.
 * @param {ActivityLogProps} props - Activity log page props
 * @returns {ReactElement} Activity log page
 */
export const ActivityLogComponent = (props: ActivityLogProps): ReactElement => {
  const columns = _getColumns(props);
  const listState = _renderListState(props);

  return (
    <Layout pageTitle="Activity Log">
      <PageLayout
        title="Activity Log"
        subtitle="Track user activities and system audit history"
        breadcrumbs={["Activity Log"]}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
      >
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileList(props, listState)}
          {_renderDesktopTable(props, columns, listState)}
        </div>
      </PageLayout>
    </Layout>
  );
};
