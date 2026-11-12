import type { ChangeEvent, ReactElement } from "react";
import { Fragment } from "react";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import {
  PROJECT_FORM_MODE_TEXT,
  PROJECT_FORM_STATUS_MESSAGE,
  PROJECT_FORM_STEP_LABEL,
  PROJECT_FORM_STEPS,
  PROJECT_ITEMS_STATUS_MESSAGE,
} from "./MasterProjectCreate.config";
import type {
  MasterProjectCreateProps,
  ProjectFormStep,
  ProjectItemCardProps,
  ProjectItemQuantityProps,
  ProjectSelectedItem,
} from "./MasterProjectCreate.type";
import { findSelectedItem, formatProjectPrice } from "./MasterProjectCreate.util";

import Layout from "@/app/layout";

const FIELD_INPUT_CLASS =
  "w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 text-xl text-text-primary outline-none focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 lg:text-lg";

/**
 * Render the quantity input of a selected item.
 * @param {ProjectItemQuantityProps} props - Item, selection and quantity handler
 * @returns {ReactElement} - Quantity input
 */
const ProjectItemQuantity = (props: ProjectItemQuantityProps): ReactElement => {
  const { item, selectedItem, onItemQuantityChange } = props;

  /**
   * Change the quantity of this item.
   * @param {ChangeEvent<HTMLInputElement>} event - Quantity input change event
   * @returns {void}
   */
  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onItemQuantityChange(item.id, Number(event.target.value));
  };

  return (
    <div className="pointer-events-auto flex shrink-0 items-center gap-2">
      <label htmlFor={`qty-${item.id}`} className="text-xs text-text-secondary">Qty</label>
      <input
        id={`qty-${item.id}`}
        type="number"
        min="1"
        max={item.stock}
        value={selectedItem.qty}
        onChange={handleQuantityChange}
        className="w-20 rounded-lg border border-border-default bg-background-surface px-2 py-2 text-center text-lg"
      />
    </div>
  );
};

/**
 * Render one selectable item card with its quantity input.
 * @param {ProjectItemCardProps} props - Item, selection and handlers
 * @returns {ReactElement} - Item card
 */
const ProjectItemCard = (props: ProjectItemCardProps): ReactElement => {
  const { item, selectedItem, onItemToggle, onItemQuantityChange } = props;

  /**
   * Toggle the selection of this item.
   * @returns {void}
   */
  const handleToggle = (): void => {
    onItemToggle(item);
  };

  return (
    <div className={`relative rounded-2xl border p-4 transition-colors ${selectedItem ? "border-action-primary bg-action-primary-subtle" : "border-border-default bg-background-surface"}`}>
      <button type="button" onClick={handleToggle} aria-label={`Select ${item.name}`} className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30" />
      <div className="pointer-events-none relative z-10 flex items-center gap-3">
        {item.image ? (
          <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background-subtle text-xs text-text-tertiary">No image</div>
        )}
        <span className="min-w-0 flex-1">
          <strong className="block truncate text-xl font-semibold text-text-primary">{item.name}</strong>
          <small className="mt-1 block text-lg text-text-secondary">Stock: {item.stock} · {formatProjectPrice(item.price)}</small>
        </span>
        {selectedItem && <ProjectItemQuantity item={item} selectedItem={selectedItem} onItemQuantityChange={onItemQuantityChange} />}
        <span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm ${selectedItem ? "border-action-primary bg-action-primary text-text-inverse" : "border-border-default text-transparent"}`}>✓</span>
      </div>
    </div>
  );
};

/**
 * Render the wizard step tabs.
 * @param {ProjectFormStep} step - Current step
 * @returns {ReactElement} - Step indicator
 */
const _renderSteps = (step: ProjectFormStep): ReactElement => (
  <div aria-label="Project steps" className="mb-6 flex items-center gap-4 overflow-x-auto border-b border-border-default lg:mb-8 lg:gap-8">
    {PROJECT_FORM_STEPS.map((formStep) => (
      <div key={formStep} aria-current={step === formStep ? "step" : undefined} className={`relative shrink-0 pb-3 text-lg ${step === formStep ? "font-semibold text-action-primary" : "font-normal text-text-secondary"}`}>
        {PROJECT_FORM_STEP_LABEL[formStep]}
        <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 ${step === formStep ? "bg-action-primary" : "bg-transparent"}`} />
      </div>
    ))}
  </div>
);

/**
 * Render the item options, or the message of the item state.
 * @param {MasterProjectCreateProps} props - Form props
 * @returns {ReactElement} - Item step
 */
const _renderItemStep = (props: MasterProjectCreateProps): ReactElement => {
  const { itemsStatus, itemOptions, values, onItemToggle, onItemQuantityChange } = props;

  return (
    <section>
      <h3 className="mb-4 text-2xl font-semibold text-text-primary lg:text-xl">Select items</h3>
      {itemsStatus !== "ready" && <p role="status" className="text-sm text-text-secondary">{PROJECT_ITEMS_STATUS_MESSAGE[itemsStatus]}</p>}
      {props.fieldErrors.selectedItems && <p role="alert" className="mb-3 text-danger">{props.fieldErrors.selectedItems}</p>}
      <div className="max-h-[min(34rem,calc(100vh-20rem))] space-y-3 overflow-y-auto pr-1">
        {itemOptions.map((item) => (
          <Fragment key={item.id}>
            <ProjectItemCard
              item={item}
              selectedItem={findSelectedItem(values.selectedItems, item.id)}
              onItemToggle={onItemToggle}
              onItemQuantityChange={onItemQuantityChange}
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
};

/**
 * Render the project price field.
 * @param {MasterProjectCreateProps} props - Form props
 * @returns {ReactElement} - Price field
 */
const ProjectPriceField = (props: MasterProjectCreateProps): ReactElement => {
  const { values, fieldErrors, onPriceChange } = props;

  /**
   * Pass the entered price, or null when the input is cleared.
   * @param {ChangeEvent<HTMLInputElement>} event - Price input change event
   * @returns {void}
   */
  const handlePriceInput = (event: ChangeEvent<HTMLInputElement>): void => {
    onPriceChange(event.target.value === "" ? null : Number(event.target.value));
  };

  return (
    <label className="block space-y-2 lg:col-span-2" htmlFor="project-price">
      <span className="text-lg font-normal text-text-primary">Project Price <span aria-hidden="true">*</span></span>
      <input
        id="project-price"
        type="number"
        min="0"
        value={values.price ?? ""}
        onChange={handlePriceInput}
        placeholder="e.g. 5000000"
        className={`h-16 lg:h-14 ${FIELD_INPUT_CLASS}`}
      />
      {fieldErrors.price && <span role="alert" className="text-danger">{fieldErrors.price}</span>}
    </label>
  );
};

/**
 * Render the active status switch, shown in edit mode only.
 * @param {MasterProjectCreateProps} props - Form props
 * @returns {ReactElement | null} - Status field, or null in create mode
 */
const _renderStatusField = (props: MasterProjectCreateProps): ReactElement | null => {
  const { mode, values, onStatusChange } = props;

  if (mode !== "edit") {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-normal text-text-primary">Status</span>
          <span className={`inline-flex rounded-full border border-current px-3 py-0.5 text-base font-semibold uppercase ${values.isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
            {values.isActive ? "active" : "inactive"}
          </span>
        </div>
        <span className="text-base text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent id="project-status" label="Project status" checked={values.isActive} onChange={onStatusChange} />
    </div>
  );
};

/**
 * Render the information step: name, price, remark and status.
 * @param {MasterProjectCreateProps} props - Form props
 * @returns {ReactElement} - Information step
 */
const _renderInformationStep = (props: MasterProjectCreateProps): ReactElement => {
  const { values, fieldErrors, onNameChange, onRemarkChange } = props;

  return (
    <section className="space-y-5">
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <InputComponent
          id="project-name"
          type="text"
          label="Project Name"
          className={`!mb-0 lg:col-span-2 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${fieldErrors.name ? "[&_.ant-input]:!border-danger" : "[&_.ant-input]:!border-border-strong"} [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
          placeholder="e.g. Stage Sound Package"
          required
          value={values.name}
          errorMessage={fieldErrors.name ?? null}
          onChange={onNameChange}
        />
        <ProjectPriceField {...props} />
        <label className="block space-y-2 lg:col-span-2">
          <span className="text-lg font-normal text-text-primary">Remark</span>
          <textarea
            aria-label="Remark"
            placeholder="Optional project notes"
            value={values.remark}
            onChange={onRemarkChange}
            className={`min-h-36 py-4 placeholder:text-text-tertiary lg:min-h-28 ${FIELD_INPUT_CLASS}`}
          />
        </label>
        {_renderStatusField(props)}
      </div>
    </section>
  );
};

/**
 * Render one selected item summary card.
 * @param {ProjectSelectedItem} item - Selected item
 * @returns {ReactElement} - Selected item card
 */
const _renderSelectedItem = (item: ProjectSelectedItem): ReactElement => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-border-default bg-background-surface p-5 shadow-small">
    <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{item.name}</span>
    <span className="shrink-0 rounded-full border border-border-strong bg-background-subtle px-4 py-2 text-lg font-semibold text-text-primary">Qty: {item.qty}</span>
  </div>
);

/**
 * Render the preview step with the entered values.
 * @param {MasterProjectCreateProps} props - Form props
 * @returns {ReactElement} - Preview step
 */
const _renderPreviewStep = (props: MasterProjectCreateProps): ReactElement => {
  const { values } = props;

  return (
    <section className="space-y-8">
      <h3 className="text-3xl font-bold text-text-primary">Preview Project</h3>
      <dl className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border-default bg-background-subtle p-6">
          <dt className="mb-2 text-lg font-medium text-text-secondary">Project Name</dt>
          <dd className="break-words text-2xl font-semibold text-text-primary">{values.name}</dd>
        </div>
        <div className="rounded-2xl border border-border-default bg-background-subtle p-6">
          <dt className="mb-2 text-lg font-medium text-text-secondary">Project Price</dt>
          <dd className="break-words text-2xl font-semibold text-text-primary">{formatProjectPrice(values.price ?? 0)}</dd>
        </div>
        <div className="rounded-2xl border border-border-default bg-background-subtle p-6 lg:col-span-2">
          <dt className="mb-2 text-lg font-medium text-text-secondary">Remark</dt>
          <dd className="break-words text-xl text-text-primary">{values.remark || "-"}</dd>
        </div>
      </dl>
      <div>
        <h4 className="mb-4 text-2xl font-semibold text-text-primary">Selected Items</h4>
        <div className="grid gap-3 lg:grid-cols-2">
          {values.selectedItems.map((item) => (
            <Fragment key={item.id}>{_renderSelectedItem(item)}</Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Render the content of the current wizard step.
 * @param {MasterProjectCreateProps} props - Form props
 * @returns {ReactElement} - Current step
 */
const _renderCurrentStep = (props: MasterProjectCreateProps): ReactElement => {
  switch (props.step) {
    case "items":
      return _renderItemStep(props);
    case "information":
      return _renderInformationStep(props);
    case "preview":
      return _renderPreviewStep(props);
    default: {
      const unhandledStep: never = props.step;

      return unhandledStep;
    }
  }
};

/**
 * Render the footer with the back and next / submit buttons.
 * @param {MasterProjectCreateProps} props - Form props
 * @returns {ReactElement} - Form actions
 */
const _renderActions = (props: MasterProjectCreateProps): ReactElement => {
  const { mode, step, isSubmitting, onStepBack } = props;
  const modeText = PROJECT_FORM_MODE_TEXT[mode];
  const isFirstStep = step === PROJECT_FORM_STEPS[0];
  const isLastStep = step === PROJECT_FORM_STEPS[PROJECT_FORM_STEPS.length - 1];
  const lastStepLabel = isSubmitting ? modeText.submittingLabel : modeText.submitLabel;

  return (
    <div className="mt-auto flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:border-border-default">
      <button type="button" onClick={onStepBack} disabled={isSubmitting} className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50">
        {isFirstStep ? "Cancel" : "Back"}
      </button>
      <button type="submit" disabled={isSubmitting} className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60">
        {isLastStep ? lastStepLabel : "Next"}
      </button>
    </div>
  );
};

/**
 * Render the wizard form, or the message of the form state.
 * @param {MasterProjectCreateProps} props - Form props
 * @returns {ReactElement} - Form body
 */
const _renderForm = (props: MasterProjectCreateProps): ReactElement => {
  const { formStatus, step, onSubmit } = props;

  if (formStatus !== "ready") {
    return <p role="status" className="py-10 text-center text-lg text-text-secondary">{PROJECT_FORM_STATUS_MESSAGE[formStatus]}</p>;
  }

  return (
    <form noValidate onSubmit={onSubmit} className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:p-10">
      {_renderSteps(step)}
      <div className="pb-6">{_renderCurrentStep(props)}</div>
      {_renderActions(props)}
    </form>
  );
};

/**
 * Render the project create / edit page.
 * @param {MasterProjectCreateProps} props - Form props
 * @returns {ReactElement} - Project form page
 */
const MasterProjectCreateComponent = (props: MasterProjectCreateProps): ReactElement => {
  const { mode, errorMessage, onBack } = props;
  const modeText = PROJECT_FORM_MODE_TEXT[mode];

  return (
    <Layout>
      {errorMessage && <AlertComponent type="error" message={errorMessage} toast closable />}
      <div className="flex h-full min-h-full w-full flex-col bg-background-page pb-6 font-sans">
        <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
          <BackButton onClick={onBack} />
          <div className="min-w-0">
            <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">{modeText.title}</h2>
            <p className="mt-1 truncate text-sm text-text-secondary">{modeText.subtitle}</p>
          </div>
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
          <div className="mb-6 hidden lg:block">
            <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary">
              <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">Master</button>
              <span aria-hidden="true">/</span>
              <span>Master Project</span>
              <span aria-hidden="true">/</span>
              <span>{modeText.title}</span>
            </nav>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{modeText.title}</h2>
            <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">{modeText.subtitle}</p>
          </div>
          {_renderForm(props)}
          <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
        </div>
      </div>
    </Layout>
  );
};

export default MasterProjectCreateComponent;
