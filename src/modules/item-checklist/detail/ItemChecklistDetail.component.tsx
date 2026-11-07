import type { ReactElement } from "react";
import { FiDownload, FiEdit2, FiMoreHorizontal } from "react-icons/fi";

import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { ItemChecklistDetailState } from "./ItemChecklistDetail.type";
import type { ApiChecklistItem } from "../ItemChecklist.type";

const _displayOptional = (value: string | null): string => value?.trim() || "-";
const _formatDate = (value: string): string => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

const _columns: TableColumn<ApiChecklistItem>[] = [
  { key: "item_name", header: "Item" },
  { key: "description", header: "Description" },
  { key: "section", header: "Section", render: (item): string => _displayOptional(item.section) },
  { key: "qty", header: "Qty", align: "center" },
  { key: "move_out", header: "Move Out", align: "center", render: (item): string => item.move_out ? "Yes" : "No" },
  { key: "move_in", header: "Move In", align: "center", render: (item): string => item.move_in ? "Yes" : "No" },
  { key: "sign", header: "Sign", render: (item): string => _displayOptional(item.sign) },
  { key: "remark", header: "Remark", render: (item): string => _displayOptional(item.remark) },
];

/** Render checklist detail from its detail endpoint. */
export const ItemChecklistDetailComponent = (props: ItemChecklistDetailState): ReactElement => {
  const { checklist, isLoading, errorMessage, goBack, goEdit } = props;
  let content: ReactElement;
  let statusLabel = "Unavailable";

  if (checklist?.status !== null && checklist?.status !== undefined) {
    statusLabel = checklist.status === 1 ? "Done" : "On Progress";
  }

  if (isLoading) {
    content = <SkeletonComponent rows={5} columns={[{ width: "25%" }, { width: "20%" }, { width: "10%" }, { width: "10%" }, { width: "10%" }, { width: "10%" }, { width: "10%" }, { width: "5%" }]} />;
  } else if (errorMessage) {
    content = <p role="alert" className="py-10 text-center text-lg text-danger">{errorMessage}</p>;
  } else if (!checklist) {
    content = <p className="py-10 text-center text-lg text-text-secondary">Item checklist unavailable.</p>;
  } else {
    content = (
      <div className="space-y-6 pb-32 sm:space-y-6 lg:pb-8">
        <section className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="min-w-0 break-words text-3xl font-semibold text-text-primary sm:text-2xl">{checklist.checklist_no}</h2>
            <span className={`w-fit rounded-full px-3.5 py-1 text-lg font-semibold ${checklist.status === 1 ? "bg-success-subtle text-success-strong" : "bg-background-subtle text-text-secondary"}`}>{statusLabel}</span>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div><dt className="text-lg font-medium text-text-secondary">Checklist date</dt><dd className="mt-1 text-xl font-semibold text-text-primary">{_formatDate(checklist.checklist_date)}</dd></div>
            <div><dt className="text-lg font-medium text-text-secondary">Items</dt><dd className="mt-1 text-xl font-semibold text-text-primary">{checklist.items.length}</dd></div>
          </dl>
        </section>
        <section className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10">
          <h2 className="mb-6 text-2xl font-bold text-text-primary sm:text-xl sm:font-semibold">Checklist items</h2>
          {checklist.items.length === 0 ? <p className="text-lg text-text-secondary">No checklist items.</p> : (
            <>
              <div className="space-y-3 sm:hidden">
                {checklist.items.map((item) => (
                  <div key={item.id} className="space-y-2 border-t border-border-default pt-3 first:border-0 first:pt-0">
                    <div className="flex items-start justify-between gap-3"><h3 className="min-w-0 break-words text-xl font-bold text-text-primary">{item.item_name}</h3><span className="shrink-0 rounded-xl bg-action-primary-subtle px-3 py-1 text-lg font-bold text-action-primary">Qty {item.qty}</span></div>
                    <p className="break-words text-lg text-text-secondary">{item.description}</p>
                    <p className="text-lg text-text-secondary">Move out: {item.move_out ? "Yes" : "No"} · Move in: {item.move_in ? "Yes" : "No"}</p>
                    {item.section && <p className="text-lg text-text-secondary">Section: {item.section}</p>}
                    {item.sign && <p className="text-lg text-text-secondary">Sign: {item.sign}</p>}
                    {item.remark && <p className="text-lg text-text-secondary">Remark: {item.remark}</p>}
                  </div>
                ))}
              </div>
              <div className="hidden overflow-x-auto sm:block"><Table data={checklist.items} columns={_columns} keyExtractor={(item): string => item.id} emptyText="No checklist items." /></div>
            </>
          )}
        </section>
      </div>
    );
  }

  return (
    <Layout pageTitle="Item Checklist Detail">
      <PageLayout
        title="Item Checklist Detail"
        subtitle="View item checklist details and item information"
        breadcrumbs={["Item Checklist", checklist?.checklist_no ?? "Detail"]}
        onBack={goBack}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        headerRight={checklist && !errorMessage ? (
          <details className="relative shrink-0">
            <summary aria-label="More options" className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-2xl border border-border-default text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
              <FiMoreHorizontal className="h-7 w-7" aria-hidden="true" />
            </summary>
            <div role="menu" className="absolute right-0 top-16 z-20 w-56 overflow-hidden rounded-2xl border border-border-default bg-background-surface py-2 shadow-lg">
              <button type="button" role="menuitem" onClick={goEdit} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
                <FiEdit2 className="h-5 w-5" aria-hidden="true" /> Edit Checklist
              </button>
              <button type="button" role="menuitem" onClick={props.onDownload} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
                <FiDownload className="h-5 w-5" aria-hidden="true" /> Download PDF
              </button>
            </div>
          </details>
        ) : undefined}
      >
        <div className="bg-background-page pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">
          {isLoading || errorMessage || !checklist ? <div className="rounded-3xl border border-border-default bg-background-surface p-6 sm:p-8 lg:p-10">{content}</div> : content}
        </div>
      </PageLayout>
    </Layout>
  );
};
