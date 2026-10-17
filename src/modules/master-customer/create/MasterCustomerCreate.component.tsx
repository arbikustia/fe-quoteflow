import type { ReactElement } from "react";

import { InputField } from "./InputField.component";
import type { MasterCustomerCreateFormState } from "./MasterCustomerCreate.type";

/**
 * Render name field
 * @param {MasterCustomerCreateFormState} props - Form state
 * @returns {ReactElement} Field element
 */
const _renderNameField = (props: MasterCustomerCreateFormState): ReactElement => (
  <InputField
    label="Customer Name"
    placeholder="e.g. PT Mega Jaya Abadi"
    value={props.name}
    required
    onChange={props.handleNameChange}
  />
);

/**
 * Render phone field
 * @param {MasterCustomerCreateFormState} props - Form state
 * @returns {ReactElement} Field element
 */
const _renderPhoneField = (props: MasterCustomerCreateFormState): ReactElement => (
  <InputField
    label="Phone Number"
    placeholder="0812... atau 628..."
    value={props.phoneNumber}
    required
    type="tel"
    inputMode="numeric"
    pattern="[0-9]{6,15}"
    title="Use 6–15 digits only. Allowed examples: 0812..., 628..., or 12..."
    onChange={props.handlePhoneNumberChange}
  />
);

/**
 * Render status switch field (edit mode only)
 * @param {MasterCustomerCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (props: MasterCustomerCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text-primary">Status</span>
        <span className="text-xs text-text-secondary">Toggle active or inactive status</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={props.isActive}
        onClick={props.handleStatusChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue/30 ${
          props.isActive ? "bg-brand-blue" : "bg-brand-gray-light"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-250 ease-in-out ${
            props.isActive ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
/**
 * Render address field.
 * @param {MasterCustomerCreateFormState} props - Form state
 * @returns {ReactElement} Field element
 */
const _renderAddressField = (props: MasterCustomerCreateFormState): ReactElement => (
  <InputField
    label="Address"
    placeholder="e.g. Jl. Sudirman No. 45"
    value={props.address}
    required
    multiline
    onChange={props.handleAddressChange}
  />
);

/**
 * Render mobile top back bar
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Bar element
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-surface px-6 lg:hidden">
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
  </div>
);

/**
 * Render page header with breadcrumb
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Header element
 */
const _renderHeaderSection = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Customer" : "New Customer";

  return (
    <>
      <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-2 mb-3 text-sm font-medium text-text-secondary">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master Customer</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 pl-1">
        <h2 className="text-4xl font-semibold leading-tight text-text-primary tracking-tight">{title}</h2>
        <p className="text-[14px] text-text-secondary opacity-70 mt-3 font-medium">
          {isEditMode ? "Update the customer details below." : "Fill in the customer details below."}
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
  const buttonText = isEditMode ? "Update Customer" : "Create Customer";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Master Customer Create Form
 * @param {MasterCustomerCreateFormState} props - Form props
 * @returns {ReactElement} Create form
 */
export const MasterCustomerCreateForm = (props: MasterCustomerCreateFormState): ReactElement => {
  const { isEditMode, isLoadingInitialData, isSubmitting, errorMessage, successMessage, handleSubmit, goBack } = props;

  return (
    <div className="flex h-full w-full flex-col bg-background-surface font-sans pb-6 lg:bg-background-page">
      {_renderMobileBack(goBack)}
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-6 lg:mt-0 lg:px-0">
        {_renderHeaderSection(isEditMode, goBack)}
        {isLoadingInitialData ? (
          <p className="py-12 text-center text-sm text-text-secondary">Loading customer data…</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-brand-gray-light lg:bg-brand-white lg:p-8 lg:shadow-xs">
            <div className="grid w-full grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2">
              <div>{_renderNameField(props)}</div>
              <div>{_renderPhoneField(props)}</div>
              <div className="lg:col-span-2">{_renderAddressField(props)}</div>
              {_renderStatusField(props)}
              {errorMessage && <p role="alert" className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700 lg:col-span-2">{errorMessage}</p>}
              {successMessage && <p role="status" className="mb-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[13px] font-medium text-green-700 lg:col-span-2">{successMessage}</p>}
            </div>
            {_renderSubmitSection(isSubmitting, isEditMode)}
          </form>
        )}
      </div>
    </div>
  );
};
