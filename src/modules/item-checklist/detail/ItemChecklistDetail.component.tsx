import type { ReactElement } from "react";

import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { ItemChecklistDetailState } from "./ItemChecklistDetail.type";
import type { ApiChecklistItem } from "../ItemChecklist.type";

const _columns: TableColumn<ApiChecklistItem>[] = [
  { key: "item_name", header: "Item" },
  { key: "section", header: "Section" },
  { key: "qty", header: "Qty", align: "center" },
  { key: "move_out", header: "Move Out", align: "center", render: (item): string => item.move_out ? "Yes" : "No" },
  { key: "move_in", header: "Move In", align: "center", render: (item): string => item.move_in ? "Yes" : "No" },
  { key: "remark", header: "Remark" },
];

/** Render checklist detail. */
export const ItemChecklistDetailComponent = (props: ItemChecklistDetailState): ReactElement => {
  const { checklist, isLoading, errorMessage, goBack } = props;
  let content: ReactElement;

  if (isLoading) {
    content = <SkeletonComponent rows={5} columns={[{ width: "28%" }, { width: "18%" }, { width: "12%" }, { width: "14%" }, { width: "14%" }, { width: "14%" }]} />;
  } else if (errorMessage) {
    content = <p role="alert" className="py-10 text-center text-danger">{errorMessage}</p>;
  } else if (!checklist) {
    content = <p className="py-10 text-center text-text-secondary">Item checklist unavailable.</p>;
  } else {
    content = <Table data={checklist.items} columns={_columns} keyExtractor={(item): string => item.id} emptyText="No checklist items." />;
  }

  return <Layout pageTitle="Item Checklist Detail" mobileWhiteBackground={true}><PageLayout title={checklist?.checklist_no ?? "Item Checklist"} subtitle="Rental item checklist details." breadcrumbs={["Item Checklist", checklist?.checklist_no ?? "Detail"]} onBack={goBack} headerRight={checklist && !errorMessage ? <button type="button" onClick={props.goEdit} className="h-12 rounded-xl bg-action-primary px-6 font-semibold text-text-inverse hover:bg-action-primary-hover">Edit Checklist</button> : undefined}><div className="rounded-4xl border border-border-default bg-background-surface p-6 shadow-xs"><div className="mb-6 grid grid-cols-1 gap-4 border-b border-border-default pb-6 text-sm text-text-secondary md:grid-cols-3"><p>Order ID: <span className="font-semibold text-text-primary">{checklist?.order_id ?? "-"}</span></p><p>Date: <span className="font-semibold text-text-primary">{checklist?.checklist_date ?? "-"}</span></p><p>Items: <span className="font-semibold text-text-primary">{checklist?.items.length ?? 0}</span></p></div>{content}</div></PageLayout></Layout>;
};
