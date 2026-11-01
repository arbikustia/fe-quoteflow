import type { ReactElement } from "react";

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
    statusLabel = checklist.status === 1 ? "Active" : "Inactive";
  }

  if (isLoading) {
    content = <SkeletonComponent rows={5} columns={[{ width: "25%" }, { width: "20%" }, { width: "10%" }, { width: "10%" }, { width: "10%" }, { width: "10%" }, { width: "10%" }, { width: "5%" }]} />;
  } else if (errorMessage) {
    content = <p role="alert" className="py-10 text-center text-danger">{errorMessage}</p>;
  } else if (!checklist) {
    content = <p className="py-10 text-center text-text-secondary">Item checklist unavailable.</p>;
  } else {
    content = (
      <div className="space-y-6">
        <dl className="grid grid-cols-1 gap-4 border-b border-border-default pb-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-text-secondary">Checklist date</dt><dd className="font-semibold text-text-primary">{_formatDate(checklist.checklist_date)}</dd></div>
          <div><dt className="text-text-secondary">Status</dt><dd className="font-semibold text-text-primary">{statusLabel}</dd></div>
          <div><dt className="text-text-secondary">Items</dt><dd className="font-semibold text-text-primary">{checklist.items.length}</dd></div>
        </dl>
        <Table data={checklist.items} columns={_columns} keyExtractor={(item): string => item.id} emptyText="No checklist items." />
      </div>
    );
  }

  return (
    <Layout pageTitle="Item Checklist Detail" mobileWhiteBackground={true}>
      <PageLayout
        title={checklist?.checklist_no ?? "Item Checklist"}
        subtitle="Rental item checklist details."
        breadcrumbs={["Item Checklist", checklist?.checklist_no ?? "Detail"]}
        onBack={goBack}
        headerRight={checklist && !errorMessage ? (
          <div className="flex items-center gap-2">
            <button type="button" onClick={props.onDownload} className="h-12 rounded-xl border border-border-default bg-background-surface px-6 font-semibold text-text-primary hover:bg-background-subtle">
              Download PDF
            </button>
            <button type="button" onClick={goEdit} className="h-12 rounded-xl bg-action-primary px-6 font-semibold text-text-inverse hover:bg-action-primary-hover">
              Edit Checklist
            </button>
          </div>
        ) : undefined}
      >
        <div className="rounded-4xl border border-border-default bg-background-surface p-6 shadow-xs">{content}</div>
      </PageLayout>
    </Layout>
  );
};
