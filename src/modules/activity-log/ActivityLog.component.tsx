import type { ChangeEvent, ReactElement } from "react";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { SkeletonComponent } from "@/components/Skeleton";
import Table, { type TableColumn } from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import { ActivityLogCard } from "./ActivityLog.helpers";
import type { ActivityLogData, ActivityLogProps } from "./ActivityLog.type";

const COLUMNS: TableColumn<ActivityLogData>[] = [
  { key: "userName", header: "User Name" },
  { key: "action", header: "Action" },
  { key: "page", header: "Page" },
  { key: "description", header: "Description" },
  { key: "createdAt", header: "Created At", render: (row: ActivityLogData): ReactElement => <span>{new Date(row.createdAt).toLocaleString("id-ID")}</span> },
];

/**
 * Render activity log list state.
 * @param {ActivityLogProps} props - Activity log page props
 * @returns {ReactElement} Activity log content
 */
const _renderContent = (props: ActivityLogProps): ReactElement => {
  if (props.isLoading) return <SkeletonComponent rows={5} columns={COLUMNS.map(() => ({ width: "20%" }))} />;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No activity logs found.</p>;

  return <Table data={props.paginatedData} columns={COLUMNS} keyExtractor={(row: ActivityLogData): string => row.id} />;
};

/**
 * Render activity log search input.
 * @param {ActivityLogProps["setSearchTerm"]} setSearchTerm - Search callback
 * @param {boolean} isMobile - Mobile search flag
 * @returns {ReactElement} Search field
 */
const _renderSearch = (setSearchTerm: ActivityLogProps["setSearchTerm"], isMobile: boolean): ReactElement => {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value);

  if (isMobile) {
    return (
      <SearchFilter
        placeholder="Search activity log"
        onChange={handleSearch}
        isRoundedFull={true}
        className="w-full sm:w-full [&_svg]:h-7 [&_svg]:w-7"
        inputClassName="h-16 pl-14 text-xl placeholder:text-xl lg:h-14"
      />
    );
  }

  return <SearchFilter placeholder="Search activity log" onChange={handleSearch} className="w-72" />;
};

/**
 * Render desktop activity log table.
 * @param {ActivityLogProps} props - Activity log page props
 * @returns {ReactElement} Desktop table
 */
const _renderDesktopTable = (props: ActivityLogProps): ReactElement => (
  <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
    <div className="flex items-center justify-between gap-4 py-6">
      {_renderSearch(props.setSearchTerm, false)}
    </div>
    <div className="flex-1 overflow-auto">{_renderContent(props)}</div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
  </div>
);

/**
 * Render mobile activity list content state.
 * @param {ActivityLogProps} props - Activity log page props
 * @returns {ReactElement} Mobile list content
 */
const _renderMobileContent = (props: ActivityLogProps): ReactElement => {
  if (props.isLoading) return <SkeletonComponent rows={3} columns={[{ width: "100%" }]} />;

  if (props.errorMessage) return <p className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;

  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No activity logs found.</p>;

  return <>{props.paginatedData.map((activity) => <ActivityLogCard key={activity.id} activity={activity} />)}</>;
};

/**
 * Render mobile activity log list.
 * @param {ActivityLogProps} props - Activity log page props
 * @returns {ReactElement} Mobile list
 */
const _renderMobileList = (props: ActivityLogProps): ReactElement => (
  <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
    <div className="w-full">{_renderSearch(props.setSearchTerm, true)}</div>
    <div className="min-w-0 space-y-3">{_renderMobileContent(props)}</div>
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
  </div>
);

/**
 * Render activity log list page.
 * @param {ActivityLogProps} props - Activity log page props
 * @returns {ReactElement} Activity log page
 */
export const ActivityLogComponent = (props: ActivityLogProps): ReactElement => (
  <Layout pageTitle="Activity Log" mobileWhiteBackground={true}>
    <PageLayout title="Activity Log" breadcrumbs={["Activity Log"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
      <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
        {_renderMobileList(props)}
        {_renderDesktopTable(props)}
      </div>
    </PageLayout>
  </Layout>
);
