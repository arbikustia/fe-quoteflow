import type { ChangeEvent, ReactElement } from "react";
import { FiEdit2 } from "react-icons/fi";

import { MasterDataCard } from "@/components/MasterDataCard";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { ChecklistListState, ChecklistRow } from "./ItemChecklist.type";

const _formatDate = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const _renderStatus = (row: ChecklistRow): ReactElement => <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${row.status === "active" ? "bg-success-subtle text-success-strong" : "bg-background-subtle text-text-secondary"}`}>{row.status}</span>;
const _getColumns = (onEdit: ChecklistListState["onEdit"]): TableColumn<ChecklistRow>[] => [
  { key: "checklistNo", header: "Checklist No" },
  { key: "checklistDate", header: "Checklist Date", render: (row): ReactElement => <span>{_formatDate(row.checklistDate)}</span> },
  { key: "itemCount", header: "Items", align: "center" },
  { key: "status", header: "Status", align: "center", render: _renderStatus },
  { key: "actions", header: "Action", align: "center", render: (row): ReactElement => (
    <button type="button" aria-label={`Edit ${row.checklistNo}`} onClick={(event): void => { event.stopPropagation(); onEdit(row); }} className="inline-flex cursor-pointer items-center gap-2 rounded-lg p-2.5 text-action-primary hover:bg-action-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
      <FiEdit2 className="h-5 w-5" aria-hidden="true" /> Edit
    </button>
  ) },
];

const _renderMobileCard = (row: ChecklistRow, onClick: ChecklistListState["onRowClick"], onEdit: ChecklistListState["onEdit"]): ReactElement => (
  <div key={row.id} className="space-y-1">
    <MasterDataCard title={row.checklistNo} status={row.status} onClick={(): void => onClick(row)}>
      <span className="block text-text-secondary">{_formatDate(row.checklistDate)}</span>
      <span className="mt-1 block text-text-secondary">{row.itemCount} items</span>
    </MasterDataCard>
    <button type="button" onClick={(): void => onEdit(row)} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-action-primary hover:bg-action-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
      <FiEdit2 className="h-5 w-5" aria-hidden="true" /> Edit {row.checklistNo}
    </button>
  </div>
);

const _renderListState = (props: ChecklistListState): ReactElement | null => {
  if (props.isLoading) return <SkeletonComponent rows={5} columns={[{ width: "28%" }, { width: "28%" }, { width: "20%" }, { width: "24%" }]} />;
  if (props.errorMessage) return <p role="alert" className="py-10 text-center text-sm text-danger">{props.errorMessage}</p>;
  if (props.isEmpty) return <p className="py-10 text-center text-sm text-text-secondary">No item checklists found.</p>;
  return null;
};

/** Render checklist list and edit actions. */
export const ItemChecklistComponent = (props: ChecklistListState): ReactElement => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => props.setSearchTerm(event.target.value);
  const columns = _getColumns(props.onEdit);
  const state = _renderListState(props);

  return (
    <Layout pageTitle="Item Checklist" mobileWhiteBackground={true}>
      <PageLayout title="Item Checklist" subtitle="Manage rental item checklists and status." breadcrumbs={["Item Checklist"]} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" onBack={props.onBack}>
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
          <div className="flex flex-col gap-4 pt-2 pb-16 lg:hidden">
            <SearchFilter placeholder="Search item checklist" onChange={handleSearchChange} isRoundedFull={true} className="w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
            <div className="space-y-3">{state ?? props.rows.map((row) => _renderMobileCard(row, props.onRowClick, props.onEdit))}</div>
            <button type="button" onClick={props.onCreate} className="h-14 w-full rounded-xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover">Create Checklist</button>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} isCompact={true} className="w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3" />
          </div>
          <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
            <div className="flex items-center justify-between gap-4 border-b border-border-default py-6"><SearchFilter placeholder="Search item checklist" onChange={handleSearchChange} /><button type="button" onClick={props.onCreate} className="h-14 rounded-xl bg-action-primary px-6 text-sm font-semibold text-text-inverse hover:bg-action-primary-hover">Create Checklist</button></div>
            <div className="flex-1 overflow-auto">{state ?? <Table data={props.rows} columns={columns} isDetail={true} onRowClick={props.onRowClick} keyExtractor={(row): string => row.id} />}</div>
            <Pagination currentPage={props.currentPage} totalPages={props.totalPages} pageSize={props.pageSize} onPageChange={props.goToPage} onPageSizeChange={props.changePageSize} totalItems={props.totalCount} />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};
