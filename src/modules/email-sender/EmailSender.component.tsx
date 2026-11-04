import type { ReactElement } from "react";
import { FiEdit2 } from "react-icons/fi";

import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import { useEmailSender } from "./EmailSender.hook";
import type { EmailSender } from "./EmailSender.type";

/**
 * Render action cell.
 * @param {EmailSender} row - Email sender row
 * @param {(row: EmailSender) => void} onEdit - Edit handler
 * @returns {ReactElement} Action element
 */
const _renderActions = (row: EmailSender, onEdit: (row: EmailSender) => void): ReactElement => {
  const handleEdit = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onEdit(row);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button type="button" onClick={handleEdit} className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary" title="Edit email sender" aria-label={`Edit email sender ${row.name}`}>
        <FiEdit2 className="h-5 w-5" />
      </button>
    </div>
  );
};

/**
 * Get table columns.
 * @param {(row: EmailSender) => void} onEdit - Edit handler
 * @returns {TableColumn<EmailSender>[]} Columns list
 */
const _getColumns = (onEdit: (row: EmailSender) => void): TableColumn<EmailSender>[] => [
  { key: "name", header: "Name", render: (row): ReactElement => <span className="text-lg font-medium text-text-primary">{row.name}</span> },
  { key: "email", header: "Email", render: (row): ReactElement => <span className="text-lg text-text-secondary">{row.email}</span> },
  { key: "smtp_host", header: "SMTP Host", render: (row): ReactElement => <span className="text-lg text-text-secondary">{row.smtp_host}:{row.smtp_port}</span> },
  { key: "enable_ssl", header: "SSL", align: "center", render: (row): ReactElement => <span className="text-lg text-text-secondary">{row.enable_ssl ? "Yes" : "No"}</span> },
  { key: "is_default", header: "Default", align: "center", render: (row): ReactElement => <span className="text-lg text-text-secondary">{row.is_default ? "Yes" : "No"}</span> },
  { key: "actions", header: "Action", align: "center", render: (row): ReactElement => _renderActions(row, onEdit) },
];

/**
 * Render mobile card.
 * @param {EmailSender} row - Email sender row
 * @param {(row: EmailSender) => void} onEdit - Edit handler
 * @returns {ReactElement} Card element
 */
const _renderMobileCard = (row: EmailSender, onEdit: (row: EmailSender) => void): ReactElement => {
  const handleClick = (): void => onEdit(row);

  return (
    <button type="button" onClick={handleClick} className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{row.name}</span>
        <span className={`rounded-full px-3.5 py-1 text-lg font-semibold uppercase ${row.status === 1 ? "bg-badge-success-subtle text-badge-success" : "bg-badge-danger-subtle text-badge-danger"}`}>{row.status === 1 ? "active" : "inactive"}</span>
      </span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0"><span className="block text-lg text-text-tertiary">Email</span><span className="mt-1 block text-lg font-medium text-text-primary">{row.email}</span></span>
        <span className="min-w-0 text-right"><span className="block text-lg text-text-tertiary">Host</span><span className="mt-1 block text-lg font-medium text-text-primary">{row.smtp_host}:{row.smtp_port}</span></span>
      </span>
    </button>
  );
};

/**
 * Render table skeleton.
 * @returns {ReactElement} Table skeleton
 */
const _renderTableSkeleton = (): ReactElement => (
  <div className="w-full overflow-x-auto" role="status" aria-label="Loading email sender table">
    <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
      <thead>
        <tr>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary rounded-l-3xl">Name</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary">Email</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary">SMTP Host</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary text-center">SSL</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary text-center">Default</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary text-center rounded-r-3xl">Action</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }, (_value, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            <td className="border-b border-border-default px-5 py-4"><span className="inline-block h-5 w-40 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4"><span className="inline-block h-5 w-48 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4"><span className="inline-block h-5 w-36 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4 text-center"><span className="inline-block h-5 w-16 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4 text-center"><span className="inline-block h-5 w-16 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4 text-center"><span className="inline-block h-10 w-10 rounded-3xl bg-background-subtle mx-auto" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Render mobile card skeleton.
 * @param {number} key - Skeleton key
 * @returns {ReactElement} Card skeleton
 */
const _renderMobileCardSkeleton = (key: number): ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading email sender card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="h-7 w-32 rounded-3xl bg-background-subtle" />
      <span className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div><div className="h-7 w-20 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-40 rounded-3xl bg-background-subtle" /></div>
      <div className="text-right"><div className="ml-auto h-7 w-16 rounded-3xl bg-background-subtle" /><div className="mt-1 h-7 w-28 rounded-3xl bg-background-subtle" /></div>
    </div>
  </div>
);

export const EmailSenderComponent = (): ReactElement => {
  const state = useEmailSender();
  const onEdit = (row: EmailSender): void => state.edit(row);
  const createButton = (
    <button type="button" onClick={state.create} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden">
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Email Sender" mobileWhiteBackground={true}>
      <PageLayout title="Email Sender" subtitle="Manage SMTP email sender settings" breadcrumbs={["Master", "Email Sender"]} headerRight={createButton} onBack={state.back} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl">
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
            <SearchFilter placeholder="Search email sender" onChange={(event): void => state.setSearch(event.target.value)} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
            <div className="flex min-w-0 flex-col gap-4">
              {state.loading && Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))}
              {!state.loading && state.rows.length === 0 && <p className="py-10 text-center text-lg text-text-secondary">No email senders found.</p>}
              {!state.loading && state.rows.map((row): ReactElement => <div key={row.id}>{_renderMobileCard(row, onEdit)}</div>)}
            </div>
            <Pagination currentPage={state.page} totalPages={state.totalPages} pageSize={10} onPageChange={state.setPage} onPageSizeChange={(): void => undefined} totalItems={state.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
          </div>
          <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
            <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
              <SearchFilter placeholder="Search email sender" onChange={(event): void => state.setSearch(event.target.value)} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
              <button type="button" onClick={state.create} className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">Create Email Sender</button>
            </div>
            <div className="flex-1 overflow-auto">
              {state.loading && _renderTableSkeleton()}
              {!state.loading && state.rows.length === 0 && <p className="py-10 text-center text-lg text-text-secondary">No email senders found.</p>}
              {!state.loading && state.rows.length > 0 && <Table data={state.rows} columns={_getColumns(onEdit)} isDetail={false} keyExtractor={(row): string => row.id} />}
            </div>
            <Pagination currentPage={state.page} totalPages={state.totalPages} pageSize={10} onPageChange={state.setPage} onPageSizeChange={(): void => undefined} totalItems={state.totalCount} className="pt-4" />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};
