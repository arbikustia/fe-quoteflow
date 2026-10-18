import * as React from "react";

import Layout from "@/app/layout";
import type { MasterProjectCreateFormState, ProjectItemOption, ProjectItemSelection } from "@/modules/master-project/MasterProject.type";

const fieldClass = "w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-[15px] text-text-primary outline-none focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30";

/** Render item selection card. */
const _renderItemCard = (item: ProjectItemOption, selected: ProjectItemSelection | undefined, toggleItem: (item: ProjectItemOption) => void, updateQuantity: (id: string, quantity: number) => void): React.ReactElement => (
  <div className={`rounded-2xl border p-4 transition-colors ${selected ? "border-action-primary bg-action-primary-subtle" : "border-border-default bg-background-surface"}`}>
    <button type="button" onClick={() => toggleItem(item)} className="flex w-full items-center gap-3 text-left">
      {item.image ? <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background-subtle text-xs text-text-tertiary">No image</div>}
      <span className="min-w-0 flex-1"><strong className="block truncate text-sm text-text-primary">{item.name}</strong><small className="text-text-secondary">Stock: {item.stock} · Rp {item.price.toLocaleString("id-ID")}</small></span>
      <span aria-hidden="true" className={`flex h-6 w-6 items-center justify-center rounded-full border ${selected ? "border-action-primary bg-action-primary text-text-inverse" : "border-border-default"}`}>{selected ? "✓" : ""}</span>
    </button>
    {selected && <div className="mt-3 flex items-center gap-2"><label htmlFor={`qty-${item.id}`} className="text-xs text-text-secondary">Qty</label><input id={`qty-${item.id}`} type="number" min="1" max={item.stock} value={selected.qty} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} className="w-24 rounded-lg border border-border-default px-3 py-2 text-sm" /></div>}
  </div>
);

/** Render step indicator. */
const _renderSteps = (step: number): React.ReactElement => <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-text-secondary"><span className={step >= 1 ? "text-action-primary" : ""}>1. Items</span><span>/</span><span className={step >= 2 ? "text-action-primary" : ""}>2. Details</span><span>/</span><span className={step >= 3 ? "text-action-primary" : ""}>3. Preview</span></div>;

/** Render master project multi-step form. */
export const MasterProjectCreateForm = (props: MasterProjectCreateFormState): React.ReactElement => {
  const selectedById = new Map(props.selectedItems.map((item) => [item.id, item]));

  return (
    <Layout mobileWhiteBackground={true}>
      <div className="flex h-full min-h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
        <div className="sticky top-0 z-20 flex items-center bg-background-surface px-6 lg:hidden"><button type="button" onClick={props.goBack} aria-label="Back" className="flex h-14 w-14 items-center justify-center rounded-full border border-border-default">←</button></div>
        <div className="mt-2 px-6 lg:px-0"><div className="mb-8 pl-1"><h2 className="text-4xl font-semibold text-text-primary">New Project</h2><p className="mt-3 text-sm text-text-secondary">Build project in three steps.</p></div>
          {_renderSteps(props.step)}
          <form onSubmit={props.handleSubmit} className="rounded-4xl border border-border-default bg-background-surface p-6 shadow-xs lg:p-8">
            {props.step === 1 && <section><h3 className="mb-4 text-xl font-semibold text-text-primary">Select items</h3>{props.isItemsLoading && <p className="text-sm text-text-secondary">Loading items…</p>}{props.itemsError && <p role="alert" className="text-sm text-red-700">{props.itemsError}</p>}<div className="grid gap-4 sm:grid-cols-2">{props.items.map((item) => _renderItemCard(item, selectedById.get(item.id), props.toggleItem, props.updateItemQuantity))}</div></section>}
            {props.step === 2 && <section className="space-y-5"><h3 className="text-xl font-semibold text-text-primary">Project details</h3><div><label htmlFor="project-name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Project Name</label><input id="project-name" required value={props.name} onChange={props.handleNameChange} className={fieldClass} /></div><div><label htmlFor="project-remark" className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Remark</label><textarea id="project-remark" value={props.remark} onChange={props.handleRemarkChange} rows={4} className={fieldClass} /></div></section>}
            {props.step === 3 && <section className="space-y-5"><h3 className="text-xl font-semibold text-text-primary">Preview</h3><dl className="space-y-3 text-sm"><div><dt className="text-text-secondary">Name</dt><dd className="font-semibold">{props.name}</dd></div><div><dt className="text-text-secondary">Remark</dt><dd>{props.remark || "-"}</dd></div></dl><div><h4 className="mb-2 font-semibold">Selected items</h4>{props.selectedItems.map((item) => <div key={item.id} className="flex justify-between border-b border-border-default py-2 text-sm"><span>{item.name}</span><span>Qty: {item.qty}</span></div>)}</div></section>}
            {props.errorMessage && <p role="alert" className="mt-5 text-sm text-red-700">{props.errorMessage}</p>}{props.successMessage && <p role="status" className="mt-5 text-sm text-green-700">{props.successMessage}</p>}
            <div className="mt-8 flex justify-between border-t border-border-default pt-5"><button type="button" onClick={props.step === 1 ? props.goBack : props.previousStep} className="h-14 rounded-xl border border-border-default px-6">{props.step === 1 ? "Cancel" : "Back"}</button><button type="submit" disabled={props.isSubmitting} className="h-14 rounded-xl bg-action-primary px-8 font-semibold text-text-inverse disabled:opacity-60">{props.step === 3 ? (props.isSubmitting ? "Saving…" : "Save Project") : "Next"}</button></div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
