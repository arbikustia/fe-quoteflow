import type { ReactElement } from "react";
import { FiEdit2 } from "react-icons/fi";

import { MasterDataCard } from "@/components/MasterDataCard";
import { Pagination } from "@/components/Pagination";
import { SearchFilter } from "@/components/SearchFilter";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import { useEmailSender } from "./EmailSender.hook";
import type { EmailSender } from "./EmailSender.type";

const _renderActions = (row: EmailSender, onEdit: (row: EmailSender) => void): ReactElement => (
  <button type="button" title="Edit" onClick={(event): void => { event.stopPropagation(); onEdit(row); }} className="rounded-lg p-1.5 text-brand-text-medium hover:bg-brand-blue-light hover:text-brand-blue">
    <FiEdit2 className="h-4 w-4" />
  </button>
);

const _getColumns = (onEdit: (row: EmailSender) => void): TableColumn<EmailSender>[] => [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "smtp_host", header: "SMTP Host" },
  { key: "smtp_port", header: "Port", align: "center" },
  { key: "enable_ssl", header: "SSL", align: "center", render: (row) => <span>{row.enable_ssl ? "Yes" : "No"}</span> },
  { key: "is_default", header: "Default", align: "center", render: (row) => <span>{row.is_default ? "Yes" : "No"}</span> },
  { key: "actions", header: "Action", align: "center", render: (row) => _renderActions(row, onEdit) },
];

const _renderMobileCard = (row: EmailSender, onEdit: (row: EmailSender) => void): ReactElement => (
  <MasterDataCard title={row.name} status={row.status === 1 ? "active" : "inactive"} isLargeText={true} onClick={(): void => onEdit(row)}>
    <span className="grid gap-1 text-lg text-text-secondary">
      <span className="truncate">{row.email}</span>
      <span className="truncate">{row.smtp_host}:{row.smtp_port}</span>
      <span>{row.enable_ssl ? "SSL enabled" : "SSL disabled"}</span>
    </span>
  </MasterDataCard>
);

const _renderSearch = (onSearch: (value: string) => void): ReactElement => (
  <SearchFilter placeholder="Search email sender" onChange={(event): void => onSearch(event.target.value)} isRoundedFull={true} className="w-full sm:w-full" inputClassName="text-lg placeholder:text-lg" />
);

export const EmailSenderComponent = (): ReactElement => {
  const state = useEmailSender();
  const onEdit = (row: EmailSender): void => state.edit(row);

  return (
    <Layout pageTitle="Email Sender" mobileWhiteBackground={true}>
      <PageLayout title="Email Sender" breadcrumbs={["Master", "Email Sender"]} onBack={state.back} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl">
        <div className="relative flex h-full flex-col bg-background-surface px-0 pb-18 lg:-mt-4 lg:bg-transparent lg:px-0 lg:pb-0">
          <div className="flex min-w-0 flex-col gap-4 pt-2 pb-16 lg:hidden">
            {_renderSearch(state.setSearch)}
            <div className="min-w-0 space-y-3">
              {state.loading && <p className="py-10 text-center text-sm text-text-secondary">Loading email senders…</p>}
              {!state.loading && state.rows.length === 0 && <p className="py-10 text-center text-sm text-text-secondary">No email senders found.</p>}
              {!state.loading && state.rows.map((row): ReactElement => <div key={row.id}>{_renderMobileCard(row, onEdit)}</div>)}
            </div>
            <Pagination currentPage={state.page} totalPages={state.totalPages} pageSize={10} onPageChange={state.setPage} onPageSizeChange={(): void => undefined} totalItems={state.totalCount} isCompact={true} className="mt-2 w-full rounded-2xl border border-border-default bg-background-surface px-4 py-3 shadow-xs" />
          </div>
          <div className="hidden rounded-4xl border border-border-default bg-background-surface px-6 shadow-xs md:mt-6 md:flex md:flex-1 md:flex-col md:overflow-hidden lg:flex">
            <div className="flex items-center justify-between gap-4 py-6">
              <SearchFilter placeholder="Search email sender" onChange={(event): void => state.setSearch(event.target.value)} />
              <button type="button" onClick={state.create} className="h-14 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-brand-white shadow-sm transition-colors hover:bg-brand-blue/90">Create Email Sender</button>
            </div>
            <div className="flex-1 overflow-auto">
              {state.loading && <p className="py-10 text-center text-sm text-text-secondary">Loading email senders…</p>}
              {!state.loading && state.rows.length === 0 && <p className="py-10 text-center text-sm text-text-secondary">No email senders found.</p>}
              {!state.loading && state.rows.length > 0 && <Table data={state.rows} columns={_getColumns(onEdit)} isDetail={false} keyExtractor={(row): string => row.id} />}
            </div>
            <Pagination currentPage={state.page} totalPages={state.totalPages} pageSize={10} onPageChange={state.setPage} onPageSizeChange={(): void => undefined} totalItems={state.totalCount} />
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
};