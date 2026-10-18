import type { ReactElement } from "react";
import { Fragment } from "react";

import Layout from "@/app/layout";
import type {
  MasterProjectCreateFormState,
  ProjectItemOption,
  ProjectItemSelection,
} from "@/modules/master-project/MasterProject.type";

const fieldClass = "w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-[15px] text-text-primary outline-none focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30";

/**
 * Render item selection card.
 * @param {ProjectItemOption} item - Item option
 * @param {ProjectItemSelection | undefined} selected - Selected item
 * @param {(item: ProjectItemOption) => void} toggleItem - Toggle callback
 * @param {(id: string, quantity: number) => void} updateQuantity - Quantity callback
 * @returns {ReactElement} Item card
 */
const _renderItemCard = (
  item: ProjectItemOption,
  selected: ProjectItemSelection | undefined,
  toggleItem: (item: ProjectItemOption) => void,
  updateQuantity: (id: string, quantity: number) => void,
): ReactElement => (
  <div className={`relative rounded-2xl border p-4 transition-colors ${selected ? "border-action-primary bg-action-primary-subtle" : "border-border-default bg-background-surface"}`}>
    <button type="button" onClick={() => toggleItem(item)} aria-label={`Select ${item.name}`} className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30" />
    <div className="relative z-10 flex items-center gap-3 pointer-events-none">
      {item.image ? <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background-subtle text-xs text-text-tertiary">No image</div>}
      <span className="min-w-0 flex-1"><strong className="block truncate text-sm font-semibold text-text-primary">{item.name}</strong><small className="mt-1 block text-text-secondary">Stock: {item.stock} · Rp {item.price.toLocaleString("id-ID")}</small></span>
      {selected && <div className="pointer-events-auto flex shrink-0 items-center gap-2"><label htmlFor={`qty-${item.id}`} className="text-xs text-text-secondary">Qty</label><input id={`qty-${item.id}`} type="number" min="1" max={item.stock} value={selected.qty} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} className="w-20 rounded-lg border border-border-default bg-background-surface px-2 py-2 text-center text-sm" /></div>}
      <span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm ${selected ? "border-action-primary bg-action-primary text-text-inverse" : "border-border-default text-transparent"}`}>✓</span>
    </div>
  </div>
);

/**
 * Render step indicator.
 * @param {number} step - Current step
 * @returns {ReactElement} Step indicator
 */
const _renderSteps = (step: number): ReactElement => (
  <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-text-secondary">
    <span className={step >= 1 ? "text-action-primary" : ""}>1. Items</span><span>/</span>
    <span className={step >= 2 ? "text-action-primary" : ""}>2. Details</span><span>/</span>
    <span className={step >= 3 ? "text-action-primary" : ""}>3. Preview</span>
  </div>
);

/**
 * Render current form step.
 * @param {MasterProjectCreateFormState} props - Form state
 * @param {Map<string, ProjectItemSelection>} selectedById - Selected items by ID
 * @returns {ReactElement} Current form step
 */
const _renderCurrentStep = (
  props: MasterProjectCreateFormState,
  selectedById: Map<string, ProjectItemSelection>,
): ReactElement => {
  if (props.step === 1) {
    return <section><h3 className="mb-4 text-xl font-semibold text-text-primary">Select items</h3>{props.isItemsLoading && <p className="text-sm text-text-secondary">Loading items…</p>}{props.itemsError && <p role="alert" className="text-sm text-red-700">{props.itemsError}</p>}<div className="max-h-[min(34rem,calc(100vh-20rem))] space-y-3 overflow-y-auto pr-1">{props.items.map((item) => <Fragment key={item.id}>{_renderItemCard(item, selectedById.get(item.id), props.toggleItem, props.updateItemQuantity)}</Fragment>)}</div></section>;
  }

  if (props.step === 2) {
    return <section className="space-y-5"><h3 className="text-xl font-semibold text-text-primary">Project details</h3><div><label htmlFor="project-name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Project Name</label><input id="project-name" required value={props.name} onChange={props.handleNameChange} className={fieldClass} /></div><div><label htmlFor="project-remark" className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Remark</label><textarea id="project-remark" value={props.remark} onChange={props.handleRemarkChange} rows={4} className={fieldClass} /></div></section>;
  }

  return <section className="space-y-5"><h3 className="text-xl font-semibold text-text-primary">Preview</h3><dl className="space-y-3 text-sm"><div><dt className="text-text-secondary">Name</dt><dd className="font-semibold">{props.name}</dd></div><div><dt className="text-text-secondary">Remark</dt><dd>{props.remark || "-"}</dd></div></dl><div><h4 className="mb-2 font-semibold">Selected items</h4>{props.selectedItems.map((item) => <div key={item.id} className="flex justify-between border-b border-border-default py-2 text-sm"><span>{item.name}</span><span>Qty: {item.qty}</span></div>)}</div></section>;
};

/**
 * Render form footer actions.
 * @param {MasterProjectCreateFormState} props - Form state
 * @returns {ReactElement} Form actions
 */
const _renderActions = (props: MasterProjectCreateFormState): ReactElement => {
  const isFirstStep = props.step === 1;
  let submitText = "Next";

  if (props.step === 3) {
    submitText = props.isSubmitting ? "Saving…" : "Save Project";
  }

  return <div className="mt-8 flex justify-between border-t border-border-default pt-5"><button type="button" onClick={isFirstStep ? props.goBack : props.previousStep} className="h-14 rounded-xl border border-border-default px-6">{isFirstStep ? "Cancel" : "Back"}</button><button type="submit" disabled={props.isSubmitting} className="h-14 rounded-xl bg-action-primary px-8 font-semibold text-text-inverse disabled:opacity-60">{submitText}</button></div>;
};

/**
 * Render master project multi-step form.
 * @param {MasterProjectCreateFormState} props - Form state
 * @returns {ReactElement} Project form
 */
export const MasterProjectCreateForm = (props: MasterProjectCreateFormState): ReactElement => {
  const selectedById = new Map(props.selectedItems.map((item) => [item.id, item]));

  return <Layout mobileWhiteBackground={true}><div className="flex h-full min-h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page"><div className="sticky top-0 z-20 flex items-center bg-background-surface px-0 lg:hidden"><button type="button" onClick={props.goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg></button></div><div className="mt-2 px-0 lg:px-0"><div className="mb-8 pl-1"><h2 className="text-4xl font-semibold text-text-primary">New Project</h2><p className="mt-3 text-sm text-text-secondary">Build project in three steps.</p></div>{_renderSteps(props.step)}<form onSubmit={props.handleSubmit} className="bg-transparent p-0">{_renderCurrentStep(props, selectedById)}{props.errorMessage && <p role="alert" className="mt-5 text-sm text-red-700">{props.errorMessage}</p>}{props.successMessage && <p role="status" className="mt-5 text-sm text-green-700">{props.successMessage}</p>}{_renderActions(props)}</form></div></div></Layout>;
};
