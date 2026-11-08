import type { ReactElement } from "react";
import { FiEdit2 } from "react-icons/fi";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import { AlertComponent } from "@/components/Alert";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import { useEmailSender } from "./EmailSender.hook";
import type { EmailSender, EmailSenderListState } from "./EmailSender.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

/**
 * Render action cell.
 *
 * @param {EmailSender} row - Email sender row
 * @param {(row: EmailSender) => void} onEdit - Edit handler
 * @returns {ReactElement} Action element
 */
const _renderActions = (row: EmailSender, onEdit: (row: EmailSender) => void): ReactElement => {
    /**
   * @param {React.MouseEvent} event - Event
   */
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
 * No-op callback used for disabled pagination controls.
 *
 * @returns {void} No return value
 */
const _noop = (): void => undefined;

/**
 * Map a row to its stable key.
 *
 * @param {EmailSender} row - Sender row
 * @returns {string} Row key
 */
const _getRowKey = (row: EmailSender): string => row.id;

/**
 * Create a search input handler bound to the setter.
 *
 * @param {(value: string) => void} setSearch - Search setter
 * @returns {(event: React.ChangeEvent<HTMLInputElement>) => void} Search handler
 */
const _createSearchHandler = (setSearch: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>): void =>
  setSearch(event.target.value);

/**
 * Render row number cell.
 *
 * @param {number} currentPage - Current page
 * @param {number} index - Row index
 * @returns {ReactElement} Number cell
 */
const _renderNumberCell = (currentPage: number, index: number): ReactElement => (
  <span className="text-lg text-text-secondary">{(currentPage - 1) * 10 + index + 1}</span>
);

/**
 * Render name cell.
 *
 * @param {EmailSender} row - Email sender row
 * @returns {ReactElement} Name cell
 */
const _renderNameCell = (row: EmailSender): ReactElement => (
  <span className="text-lg font-medium text-text-primary">{row.name}</span>
);

/**
 * Render email cell.
 *
 * @param {EmailSender} row - Email sender row
 * @returns {ReactElement} Email cell
 */
const _renderEmailCell = (row: EmailSender): ReactElement => (
  <span className="text-lg text-text-secondary">{row.email}</span>
);

/**
 * Render SMTP host cell.
 *
 * @param {EmailSender} row - Email sender row
 * @returns {ReactElement} Host cell
 */
const _renderHostCell = (row: EmailSender): ReactElement => (
  <span className="text-lg text-text-secondary">{row.smtp_host}:{row.smtp_port}</span>
);

/**
 * Render SSL cell.
 *
 * @param {EmailSender} row - Email sender row
 * @returns {ReactElement} SSL cell
 */
const _renderSslCell = (row: EmailSender): ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${row.enable_ssl ? "bg-information-subtle text-information-strong" : "bg-background-subtle text-text-secondary"}`}>{row.enable_ssl ? "Yes" : "No"}</span>
);

/**
 * Render default sender cell.
 *
 * @param {EmailSender} row - Email sender row
 * @returns {ReactElement} Default cell
 */
const _renderDefaultCell = (row: EmailSender): ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${row.is_default ? "bg-information-subtle text-information-strong" : "bg-background-subtle text-text-secondary"}`}>{row.is_default ? "Yes" : "No"}</span>
);

/**
 * Render status cell.
 *
 * @param {EmailSender} row - Email sender row
 * @returns {ReactElement} Status cell
 */
const _renderStatusCell = (row: EmailSender): ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${row.status === 1 ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>{row.status === 1 ? "active" : "inactive"}</span>
);

/**
 * Render created at cell.
 *
 * @param {EmailSender} row - Email sender row
 * @returns {ReactElement} Created at cell
 */
const _renderCreatedCell = (row: EmailSender): ReactElement => (
  <span className="text-lg text-text-secondary">{row.created_at ? formatIndonesianDateTime(row.created_at) : "-"}</span>
);

/**
 * Get table columns.
 *
 * @param {(row: EmailSender) => void} onEdit - Edit handler
 * @param {number} currentPage - Current page
 * @returns {TableColumn<EmailSender>[]} Columns list
 */
const _getColumns = (onEdit: (row: EmailSender) => void, currentPage: number): TableColumn<EmailSender>[] => {
  /**
   * Render action cell for a row.
   *
   * @param {EmailSender} row - Email sender row
   * @returns {ReactElement} Action cell
   */
  const renderActionCell = (row: EmailSender): ReactElement => _renderActions(row, onEdit);
  /**
   * Render number cell for a row.
   *
   * @param {EmailSender} _row - Email sender row
   * @param {number} index - Row index
   * @returns {ReactElement} Number cell
   */
  const renderNumberCell = (_row: EmailSender, index: number): ReactElement => _renderNumberCell(currentPage, index);

  return [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "name", header: "Name", render: _renderNameCell },
    { key: "email", header: "Email", render: _renderEmailCell },
    { key: "smtp_host", header: "SMTP Host", render: _renderHostCell },
    { key: "enable_ssl", header: "SSL", align: "center", render: _renderSslCell },
    { key: "is_default", header: "Default", align: "center", render: _renderDefaultCell },
    { key: "status", header: "Status", align: "center", render: _renderStatusCell },
    { key: "created_at", header: "Created At", render: _renderCreatedCell },
    { key: "actions", header: "Action", align: "center", render: renderActionCell },
  ];
};

/**
 * Render mobile card.
 *
 * @param {EmailSender} row - Email sender row
 * @param {(row: EmailSender) => void} onEdit - Edit handler
 * @returns {ReactElement} Card element
 */
const _renderMobileCard = (row: EmailSender, onEdit: (row: EmailSender) => void): ReactElement => {
    /**
   * @returns {void} Resolved value
   */
  const handleClick = (): void => onEdit(row);

  return (
    <button type="button" onClick={handleClick} className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{row.name}</span>
        <span className={`rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${row.status === 1 ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>{row.status === 1 ? "active" : "inactive"}</span>
      </span>
      <span className="mt-4 grid grid-cols-1 gap-4 border-t border-border-default pt-4 sm:grid-cols-2">
        <span className="min-w-0"><span className="block text-lg text-text-tertiary">Email</span><span className="mt-1 block break-all text-lg font-medium text-text-primary">{row.email}</span></span>
        <span className="min-w-0 sm:text-right"><span className="block text-lg text-text-tertiary">Host</span><span className="mt-1 block break-all text-lg font-medium text-text-primary">{row.smtp_host}:{row.smtp_port}</span></span>
        <span className="min-w-0"><span className="block text-lg text-text-tertiary">Default sender</span><span className="mt-1 block text-lg font-medium text-text-primary">{row.is_default ? "Yes" : "No"}</span></span>
        <span className="min-w-0 sm:text-right"><span className="block text-lg text-text-tertiary">Created At</span><span className="mt-1 block text-lg font-medium text-text-primary">{row.created_at ? formatIndonesianDateTime(row.created_at) : "-"}</span></span>
      </span>
    </button>
  );
};

/**
 * Render table skeleton.
 *
 * @returns {ReactElement} Table skeleton
 */
const _renderTableSkeleton = (): ReactElement => (
  <div className="w-full overflow-x-auto" role="status" aria-label="Loading email sender table">
    <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
      <thead>
        <tr>
          <th className="bg-table-header px-5 py-4 text-center text-[13px] font-bold uppercase tracking-widest text-text-secondary rounded-l-3xl">No</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary">Name</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary">Email</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary">SMTP Host</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary text-center">SSL</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary text-center">Default</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary text-center">Status</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary">Created At</th>
          <th className="bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary text-center rounded-r-3xl">Action</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }, (_value, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            <td className="border-b border-border-default px-5 py-4 text-center"><span className="inline-block h-5 w-6 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4"><span className="inline-block h-5 w-40 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4"><span className="inline-block h-5 w-48 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4"><span className="inline-block h-5 w-36 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4 text-center"><span className="inline-block h-5 w-16 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4 text-center"><span className="inline-block h-5 w-16 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4 text-center"><span className="inline-block h-7 w-24 rounded-full bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4"><span className="inline-block h-5 w-36 rounded-3xl bg-background-subtle" /></td>
            <td className="border-b border-border-default px-5 py-4 text-center"><span className="inline-block h-10 w-10 rounded-3xl bg-background-subtle mx-auto" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Render mobile card skeleton.
 *
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

/**
 * Render the mobile email sender list.
 *
 * @param {EmailSenderListState} state - Sender list state
 * @param {(row: EmailSender) => void} onEdit - Edit handler
 * @returns {ReactElement} Mobile list
 */
const _renderMobileList = (state: EmailSenderListState, onEdit: (row: EmailSender) => void): ReactElement => (
  <div className="flex min-w-0 flex-col gap-4 pb-16 pt-2 lg:hidden">
    <SearchFilter placeholder="Search email sender" onChange={_createSearchHandler(state.setSearch)} isRoundedFull={true} className="w-full sm:w-full" inputClassName="!h-16 text-xl placeholder:text-xl" />
    <div className="flex min-w-0 flex-col gap-4">
      {state.loading && Array.from({ length: 5 }, (_value, index) => _renderMobileCardSkeleton(index))}
      {!state.loading && state.rows.length === 0 && <p className="py-10 text-center text-lg text-text-secondary">No email senders found.</p>}
      {!state.loading && state.rows.map((row): ReactElement => <div key={row.id}>{_renderMobileCard(row, onEdit)}</div>)}
    </div>
    <Pagination currentPage={state.page} totalPages={state.totalPages} pageSize={10} onPageChange={state.setPage} onPageSizeChange={_noop} totalItems={state.totalCount} isCompact={true} className="w-full rounded-3xl border border-border-default bg-background-surface px-5 py-4 shadow-xs" />
  </div>
);

/**
 * Render the desktop email sender table.
 *
 * @param {EmailSenderListState} state - Sender list state
 * @param {(row: EmailSender) => void} onEdit - Edit handler
 * @returns {ReactElement} Desktop table
 */
const _renderDesktopTable = (state: EmailSenderListState, onEdit: (row: EmailSender) => void): ReactElement => (
  <div className="hidden rounded-3xl border border-border-default bg-background-surface px-6 pb-6 pt-0 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
    <div className="flex items-center justify-between gap-4 border-b border-border-default py-6">
      <SearchFilter placeholder="Search email sender" onChange={_createSearchHandler(state.setSearch)} isRoundedFull={true} inputClassName="text-lg placeholder:text-lg" />
      <button type="button" onClick={state.create} className="h-14 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">Create Email Sender</button>
    </div>
    <div className="flex-1 overflow-auto">
      {state.loading && _renderTableSkeleton()}
      {!state.loading && state.rows.length === 0 && <p className="py-10 text-center text-lg text-text-secondary">No email senders found.</p>}
      {!state.loading && state.rows.length > 0 && <Table data={state.rows} columns={_getColumns(onEdit, state.page)} isDetail={false} keyExtractor={_getRowKey} />}
    </div>
    <Pagination currentPage={state.page} totalPages={state.totalPages} pageSize={10} onPageChange={state.setPage} onPageSizeChange={_noop} totalItems={state.totalCount} className="pt-4" />
  </div>
);

/**
 * Render the email sender page.
 *
 * @returns {ReactElement} Page element
 */
export const EmailSenderComponent = (): ReactElement => {
  const state = useEmailSender();

  /**
   * Open the edit form for a sender row.
   *
   * @param {EmailSender} row - Sender row
   * @returns {void} No return value
   */
  const onEdit = (row: EmailSender): void => state.edit(row);

  const createButton = (
    <button type="button" onClick={state.create} className="h-14 rounded-full border-2 border-action-primary bg-background-surface px-6 text-lg font-bold text-action-primary transition-colors hover:bg-action-primary-subtle focus:outline-none focus:ring-2 focus:ring-focus-ring/30 lg:hidden">
      Create New
    </button>
  );

  return (
    <Layout pageTitle="Email Sender">
      {state.successMessage && <AlertComponent type="success" message={state.successMessage} toast closable />}
      <PageLayout title="Email Sender" subtitle="Manage SMTP email sender settings" breadcrumbs={["Master", "Email Sender"]} headerRight={createButton} onBack={state.back} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl">
        <div className="relative flex h-full flex-col bg-background-page px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          {_renderMobileList(state, onEdit)}
          {_renderDesktopTable(state, onEdit)}
        </div>
      </PageLayout>
    </Layout>
  );
};
