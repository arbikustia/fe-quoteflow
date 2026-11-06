import type { ReactElement } from "react";
import { Fragment } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import Layout from "@/app/layout";
import type {
  MasterProjectCreateFormState,
  ProjectItemOption,
  ProjectItemSelection,
} from "@/modules/master-data/master-project/MasterProject.type";

/**
 * Read field validation message.
 * @param {FieldError | undefined} error - Field error
 * @returns {string | null} Error message or null
 */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

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
      <span className="min-w-0 flex-1"><strong className="block truncate text-xl font-semibold text-text-primary">{item.name}</strong><small className="mt-1 block text-lg text-text-secondary">Stock: {item.stock} · Rp {item.price.toLocaleString("id-ID")}</small></span>
      {selected && <div className="pointer-events-auto flex shrink-0 items-center gap-2"><label htmlFor={`qty-${item.id}`} className="text-xs text-text-secondary">Qty</label><input id={`qty-${item.id}`} type="number" min="1" max={item.stock} value={selected.qty} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} className="w-20 rounded-lg border border-border-default bg-background-surface px-2 py-2 text-center text-lg" /></div>}
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
  <div aria-label="Project steps" className="mb-6 flex items-center gap-4 overflow-x-auto border-b border-border-default lg:mb-8 lg:gap-8">
    {["Items", "Information", "Preview"].map((title, index) => (
      <div key={title} aria-current={step === index + 1 ? "step" : undefined} className={`relative shrink-0 pb-3 text-lg ${step === index + 1 ? "font-semibold text-action-primary" : "font-normal text-text-secondary"}`}>
        {title}
        <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 ${step === index + 1 ? "bg-action-primary" : "bg-transparent"}`} />
      </div>
    ))}
  </div>
);

/**
 * Render item selection step.
 * @param {MasterProjectCreateFormState} props - Form state
 * @param {Map<string, ProjectItemSelection>} selectedById - Selected items
 * @returns {ReactElement} Item selection step
 */
const _renderItemStep = (props: MasterProjectCreateFormState, selectedById: Map<string, ProjectItemSelection>): ReactElement => <section><h3 className="mb-4 text-2xl font-semibold text-text-primary lg:text-xl">Select items</h3>{props.isItemsLoading && <p className="text-sm text-text-secondary">Loading items…</p>}{props.itemsError && <p role="alert" className="text-sm text-red-700">{props.itemsError}</p>}<div className="max-h-[min(34rem,calc(100vh-20rem))] space-y-3 overflow-y-auto pr-1">{props.items.map((item) => <Fragment key={item.id}>{_renderItemCard(item, selectedById.get(item.id), props.toggleItem, props.updateItemQuantity)}</Fragment>)}</div></section>;

/* eslint-disable max-lines-per-function */
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
    return _renderItemStep(props, selectedById);
  }

  if (props.step === 2) {
    return (
      <section className="space-y-5">
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <InputComponent
            id="project-name"
            type="text"
            label="Project Name"
            className={`!mb-0 lg:col-span-2 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${props.isSubmitted && !props.name || props.errors?.name ? "[&_.ant-input]:!border-danger" : "[&_.ant-input]:!border-border-strong"} [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
            placeholder="e.g. Stage Sound Package"
            required
            value={props.name}
            errorMessage={props.isSubmitted && !props.name ? "Project name is required." : _getFieldError(props.errors?.name)}
            onChange={props.handleNameChange}
          />
          <label className="block space-y-2 lg:col-span-2" htmlFor="project-price">
            <span className="text-lg font-normal text-text-primary">Project Price <span aria-hidden="true">*</span></span>
            <input
              id="project-price"
              type="number"
              min="0"
              required
              value={props.price}
              onChange={props.handlePriceChange}
              placeholder="e.g. 5000000"
              className="h-16 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 text-xl text-text-primary outline-none focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:h-14 lg:text-lg"
            />
            {props.isSubmitted && !props.price && <span className="text-danger">Project price is required.</span>}
          </label>
          <label className="block space-y-2 lg:col-span-2">
            <span className="text-lg font-normal text-text-primary">Remark</span>
            <textarea
              aria-label="Remark"
              placeholder="Optional project notes"
              value={props.remark}
              onChange={props.handleRemarkChange}
              className="min-h-36 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 py-4 text-xl font-normal text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:min-h-28 lg:text-lg"
            />
          </label>
          {props.isEditMode && (
            <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-normal text-text-primary">Status</span>
                  <span className={`inline-flex rounded-full border border-current px-3 py-0.5 text-base font-semibold uppercase ${props.isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
                    {props.isActive ? "active" : "inactive"}
                  </span>
                </div>
                <span className="text-base text-text-secondary">Toggle active or inactive status</span>
              </div>
              <SwitchComponent id="project-status" label="Project status" checked={props.isActive} onChange={props.handleStatusChange} />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <h3 className="text-3xl font-bold text-text-primary">Preview Project</h3>
      <dl className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border-default bg-background-subtle p-6">
          <dt className="mb-2 text-lg font-medium text-text-secondary">Project Name</dt>
          <dd className="break-words text-2xl font-semibold text-text-primary">{props.name}</dd>
        </div>
        <div className="rounded-2xl border border-border-default bg-background-subtle p-6">
          <dt className="mb-2 text-lg font-medium text-text-secondary">Remark</dt>
          <dd className="break-words text-xl text-text-primary">{props.remark || "-"}</dd>
        </div>
      </dl>
      <div>
        <h4 className="mb-4 text-2xl font-semibold text-text-primary">Selected Items</h4>
        <div className="grid gap-3 lg:grid-cols-2">
          {props.selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border-default bg-background-surface p-5 shadow-small"
            >
              <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{item.name}</span>
              <span className="shrink-0 rounded-full border border-border-strong bg-background-subtle px-4 py-2 text-lg font-semibold text-text-primary">
                Qty: {item.qty}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
/* eslint-enable max-lines-per-function */

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

  const handleBack = isFirstStep ? props.goBack : props.previousStep;

  return <div className="mt-auto flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:border-border-default"><button type="button" onClick={handleBack} disabled={props.isSubmitting} className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50">{isFirstStep ? "Cancel" : "Back"}</button><button type="submit" disabled={props.isSubmitting} className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60">{submitText}</button></div>;
};

/**
 * Render master project multi-step form.
 * @param {MasterProjectCreateFormState} props - Form state
 * @returns {ReactElement} Project form
 */
export const MasterProjectCreateForm = (props: MasterProjectCreateFormState): ReactElement => {
  const selectedById = new Map(props.selectedItems.map((item) => [item.id, item]));

  return (
    <Layout>
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {props.successMessage && <AlertComponent type="success" message={props.successMessage} toast closable />}
      <div className="flex h-full min-h-full w-full flex-col bg-background-page pb-6 font-sans">
        <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
          <BackButton onClick={props.goBack} />
          <div className="min-w-0"><h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">New Project</h2><p className="mt-1 truncate text-sm text-text-secondary">Build project in three steps.</p></div>
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
          <div className="mb-6 hidden lg:block"><nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary"><button type="button" onClick={props.goBack} className="cursor-pointer hover:text-text-primary">Master</button><span aria-hidden="true">/</span><span>Master Project</span><span aria-hidden="true">/</span><span>New Project</span></nav><h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">New Project</h2><p className="mt-3 text-sm font-medium text-text-secondary opacity-70">Build project in three steps.</p></div>
    <form
      noValidate
      onSubmit={props.handleSubmit}
      className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:rounded-3xl lg:p-10"
    >
            {_renderSteps(props.step)}
            <div className="pb-6">{_renderCurrentStep(props, selectedById)}</div>
            {_renderActions(props)}
          </form>
          <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
        </div>
      </div>
    </Layout>
  );
};
