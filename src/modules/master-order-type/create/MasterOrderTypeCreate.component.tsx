import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterOrderTypeCreateFormState } from "./MasterOrderTypeCreate.type";

/**
 * Read validation message from React Hook Form.
 * @param {FieldError | undefined} error - Field validation error
 * @returns {string | null} Validation message
 */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/**
 * Render name field
 * @param {MasterOrderTypeCreateFormState} props - Form state
 * @returns {ReactElement} Field element
 */
const _renderNameField = (props: MasterOrderTypeCreateFormState): ReactElement => (
  <div className="lg:col-span-2">
    <InputComponent
      id="order-type-name"
      type="text"
      label="Order Type Name"
      className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
      placeholder="e.g. Rental, Project, or Sales"
      value={props.name}
      required
      errorMessage={props.isSubmitted && !props.name ? "Order type name is required." : _getFieldError(props.errors.name)}
      onChange={props.handleNameChange}
    />
  </div>
);

/**
 * Render handover switch field.
 * @param {MasterOrderTypeCreateFormState} props - Form state
 * @returns {ReactElement} Field element
 */
const _renderHandoverField = (props: MasterOrderTypeCreateFormState): ReactElement => (
  <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
    <div className="flex flex-col">
      <span className="text-lg font-semibold text-text-primary lg:text-sm">Require Handover</span>
      <span className="text-base text-text-secondary lg:text-xs">
        Require handover identity documents for orders using this type
      </span>
    </div>
    <SwitchComponent
      id="order-type-handover"
      label="Handover required"
      checked={props.isHandover}
      onChange={props.handleHandoverChange}
    />
  </div>
);

/**
 * Render status switch field (edit mode only)
 * @param {MasterOrderTypeCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (props: MasterOrderTypeCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-text-primary lg:text-sm">Status</span>
        <span className="text-base text-text-secondary lg:text-xs">Toggle active or inactive status</span>
      </div>
      <SwitchComponent
        id="order-type-status"
        label="Order type status"
        checked={props.isActive}
        onChange={props.handleStatusChange}
      />
    </div>
  );
};

/**
 * Render mobile top back bar
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Bar element
 */
const _renderMobileBack = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Order Type" : "New Order Type";

  return (
    <div className="sticky top-0 z-20 mb-6 flex items-center gap-3 bg-background-surface px-0 lg:hidden">
      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="min-w-0">
        <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">{title}</h2>
        <p className="mt-1 truncate text-sm text-text-secondary">
          {isEditMode ? "Update the order type details below." : "Fill in the order type details below."}
        </p>
      </div>
    </div>
  );
};

/**
 * Render page header with breadcrumb
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Header section
 */
const _renderHeaderSection = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Order Type" : "New Order Type";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-2 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master</button>
        <span aria-hidden="true">/</span>
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Order Type</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="mb-6 hidden lg:block">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">
          {isEditMode ? "Update the order type details below." : "Fill in the order type details below."}
        </p>
      </div>
    </>
  );
};

/**
 * Render submit button section
 * @param {boolean} isSubmitting - Submitting state
 * @param {boolean} isEditMode - Edit mode flag
 * @returns {ReactElement} Submit section
 */
const _renderSubmitSection = (isSubmitting: boolean, isEditMode: boolean): ReactElement => {
  const buttonText = isEditMode ? "Update Order Type" : "Create Order Type";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto lg:text-sm"
      >
        {isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Master Order Type Create / Edit Form Component
 * @param {MasterOrderTypeCreateFormState} props - Form state and handlers
 * @returns {ReactElement} The rendered form
 */
export const MasterOrderTypeCreateForm = (props: MasterOrderTypeCreateFormState): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {props.successMessage && <AlertComponent type="success" message={props.successMessage} toast closable />}
    {_renderMobileBack(props.isEditMode, props.goBack)}
    <div className="flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:px-0 lg:text-base">
      {_renderHeaderSection(props.isEditMode, props.goBack)}
      {props.isLoadingInitialData ? (
        <p className="py-12 text-center text-sm text-text-secondary">Loading order type data…</p>
      ) : (
        <form
          noValidate
          onSubmit={props.handleSubmit}
          className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs"
        >
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
            {_renderNameField(props)}
            {_renderHandoverField(props)}
            {_renderStatusField(props)}
          </div>
          {_renderSubmitSection(props.isSubmitting, props.isEditMode)}
        </form>
      )}
    </div>
  </div>
);
