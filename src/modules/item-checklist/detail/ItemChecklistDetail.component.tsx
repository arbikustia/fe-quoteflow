import type { ReactElement } from "react";
import { FiDownload, FiEdit2, FiMoreHorizontal } from "react-icons/fi";

import { SkeletonComponent } from "@/components/Skeleton";
import type { TableColumn } from "@/components/Table";
import Table from "@/components/Table";

import type { ApiChecklistItem } from "../ItemChecklist.type";

import type { ItemChecklistDetailState } from "./ItemChecklistDetail.type";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";


/**
 * Display optional value.
 * @param {string | null} value - value
 * @returns {string} - display string
 */
const _displayOptional = (value: string | null): string => value?.trim() || "-";

/**
 * Format date value.
 * @param {string} value - value
 * @returns {string} - formatted date
 */
const _formatDate = (value: string): string => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

/**
 * Render section cell.
 * @param {ApiChecklistItem} item - checklist item
 * @returns {string} - section string
 */
const _renderSection = (item: ApiChecklistItem): string => _displayOptional(item.section);

/**
 * Render move out cell.
 * @param {ApiChecklistItem} item - checklist item
 * @returns {string} - move out string
 */
const _renderMoveOut = (item: ApiChecklistItem): string => item.move_out ? "Yes" : "No";

/**
 * Render move in cell.
 * @param {ApiChecklistItem} item - checklist item
 * @returns {string} - move in string
 */
const _renderMoveIn = (item: ApiChecklistItem): string => item.move_in ? "Yes" : "No";

/**
 * Render sign cell.
 * @param {ApiChecklistItem} item - checklist item
 * @returns {string} - sign string
 */
const _renderSign = (item: ApiChecklistItem): string => _displayOptional(item.sign);

/**
 * Render remark cell.
 * @param {ApiChecklistItem} item - checklist item
 * @returns {string} - remark string
 */
const _renderRemark = (item: ApiChecklistItem): string => _displayOptional(item.remark);

/**
 * Extract item key.
 * @param {ApiChecklistItem} _item - checklist item (unused)
 * @returns {string} - key
 */
const _keyExtractor = (_item: ApiChecklistItem): string => _item.id;

const _columns: TableColumn<ApiChecklistItem>[] = [
  { key: "item_name", header: "Item" },
  { key: "description", header: "Description" },
  { key: "section", header: "Section", render: _renderSection },
  { key: "qty", header: "Qty", align: "center" },
  { key: "move_out", header: "Move Out", align: "center", render: _renderMoveOut },
  { key: "move_in", header: "Move In", align: "center", render: _renderMoveIn },
  { key: "sign", header: "Sign", render: _renderSign },
  { key: "remark", header: "Remark", render: _renderRemark },
];

/**
 * Render mobile checklist item.
 * @param {ApiChecklistItem} item - checklist item
 * @returns {ReactElement} - rendered item
 */
const _renderMobileItem = (item: ApiChecklistItem): ReactElement => (
  <div key={item.id} className="space-y-2 border-t border-border-default pt-3 first:border-0 first:pt-0">
    <div className="flex items-start justify-between gap-3"><h3 className="min-w-0 break-words text-xl font-bold text-text-primary">{item.item_name}</h3><span className="shrink-0 rounded-xl bg-action-primary-subtle px-3 py-1 text-lg font-bold text-action-primary">Qty {item.qty}</span></div>
    <p className="break-words text-lg text-text-secondary">{item.description}</p>
    <p className="text-lg text-text-secondary">Move out: {_renderMoveOut(item)} · Move in: {_renderMoveIn(item)}</p>
    {item.section && <p className="text-lg text-text-secondary">Section: {item.section}</p>}
    {item.sign && <p className="text-lg text-text-secondary">Sign: {item.sign}</p>}
    {item.remark && <p className="text-lg text-text-secondary">Remark: {item.remark}</p>}
  </div>
);

/**
 * Render checklist items.
 * @param {ItemChecklistDetailState["checklist"]} checklist - checklist data
 * @returns {ReactElement} - rendered items
 */
const _renderItems = (checklist: ItemChecklistDetailState["checklist"]): ReactElement => {
  if (!checklist || checklist.items.length === 0) {
    return <p className="text-lg text-text-secondary">No checklist items.</p>;
  }

  return <><div className="space-y-3 sm:hidden">{checklist.items.map(_renderMobileItem)}</div><div className="hidden overflow-x-auto sm:block"><Table data={checklist.items} columns={_columns} keyExtractor={_keyExtractor} emptyText="No checklist items." /></div></>;
};

/**
 * Render loaded checklist.
 * @param {NonNullable<ItemChecklistDetailState["checklist"]>} checklist - checklist data
 * @returns {ReactElement} - rendered checklist
 */
const _renderChecklist = (checklist: NonNullable<ItemChecklistDetailState["checklist"]>): ReactElement => {
  const status = checklist.status === 1 ? "Done" : "On Progress";
  const statusLabel = checklist.status === null ? "Unavailable" : status;

  return <div className="space-y-6 pb-32 sm:space-y-6 lg:pb-8">
    <section className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-3"><h2 className="min-w-0 break-words text-3xl font-semibold text-text-primary sm:text-2xl">{checklist.checklist_no}</h2><span className={`w-fit rounded-full px-3.5 py-1 text-lg font-semibold ${checklist.status === 1 ? "bg-success-subtle text-success-strong" : "bg-background-subtle text-text-secondary"}`}>{statusLabel}</span></div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2"><div><dt className="text-lg font-medium text-text-secondary">Checklist date</dt><dd className="mt-1 text-xl font-semibold text-text-primary">{_formatDate(checklist.checklist_date)}</dd></div><div><dt className="text-lg font-medium text-text-secondary">Items</dt><dd className="mt-1 text-xl font-semibold text-text-primary">{checklist.items.length}</dd></div></dl>
    </section>
    <section className="rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:p-10"><h2 className="mb-6 text-2xl font-bold text-text-primary sm:text-xl sm:font-semibold">Checklist items</h2>{_renderItems(checklist)}</section>
  </div>;
};

/**
 * Render checklist detail content.
 * @param {ItemChecklistDetailState} props - component props
 * @returns {ReactElement} - content
 */
const _renderContent = (props: ItemChecklistDetailState): ReactElement => {
  if (props.isLoading) return <SkeletonComponent rows={5} columns={[{ width: "25%" }, { width: "20%" }, { width: "10%" }, { width: "10%" }, { width: "10%" }, { width: "10%" }, { width: "10%" }, { width: "5%" }]} />;

  if (props.errorMessage) return <p role="alert" className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;

  if (!props.checklist) return <p className="py-10 text-center text-lg text-text-secondary">Item checklist unavailable.</p>;

  return _renderChecklist(props.checklist);
};

/**
 * Render detail actions.
 * @param {ItemChecklistDetailState} props - component props
 * @returns {ReactElement | undefined} - actions
 */
const _renderActions = (props: ItemChecklistDetailState): ReactElement | undefined => props.checklist && !props.errorMessage ? (
  <details className="relative shrink-0"><summary aria-label="More options" className="flex h-14 w-14 cursor-pointer list-none items-center justify-center rounded-2xl border border-border-default text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"><FiMoreHorizontal className="h-7 w-7" aria-hidden="true" /></summary><div role="menu" className="absolute right-0 top-16 z-20 w-56 overflow-hidden rounded-2xl border border-border-default bg-background-surface py-2 shadow-lg"><button type="button" role="menuitem" onClick={props.goEdit} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"><FiEdit2 className="h-5 w-5" aria-hidden="true" /> Edit Checklist</button><button type="button" role="menuitem" onClick={props.onDownload} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"><FiDownload className="h-5 w-5" aria-hidden="true" /> Download PDF</button></div></details>
) : undefined;

/**
 * Render checklist detail from its detail endpoint.
 * @param {ItemChecklistDetailState} props - detail state
 * @returns {ReactElement} - detail page
 */
export const ItemChecklistDetailComponent = (props: ItemChecklistDetailState): ReactElement => {
  const content = _renderContent(props);

  return <Layout pageTitle="Item Checklist Detail"><PageLayout title="Item Checklist Detail" subtitle="View item checklist details and item information" breadcrumbs={["Item Checklist", props.checklist?.checklist_no ?? "Detail"]} onBack={props.goBack} mobileHeaderClassName="px-0" mobileTitleClassName="text-4xl" headerRight={_renderActions(props)}><div className="bg-background-page pb-18 lg:-mt-4 lg:bg-transparent lg:pb-0">{props.isLoading || props.errorMessage || !props.checklist ? <div className="rounded-3xl border border-border-default bg-background-surface p-6 sm:p-8 lg:p-10">{content}</div> : content}</div></PageLayout></Layout>;
};
