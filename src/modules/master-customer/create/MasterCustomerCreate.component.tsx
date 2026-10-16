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
    placeholder="0812..."
    value={props.phoneNumber}
    required
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
  <div className="px-6 pt-6 lg:px-0 lg:pt-0 flex items-center sticky top-0 bg-background-page/90 backdrop-blur-sm z-20">
    <button type="button" onClick={goBack} className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors group lg:hidden">
      <div className="w-10 h-10 rounded-full bg-background-surface shadow-sm flex items-center justify-center text-text-primary group-hover:bg-background-subtle transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </div>
      <span className="font-bold text-[15px]">Back</span>
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
 * Master Customer Create Form
 * @param {MasterCustomerCreateFormState} props - Form props
 * @returns {ReactElement} Create form
 */
export const MasterCustomerCreateForm = (props: MasterCustomerCreateFormState): ReactElement => {
  const { isEditMode, isLoadingInitialData, isSubmitting, errorMessage, successMessage, handleSubmit, goBack } = props;
  const buttonText = isEditMode ? "Update Customer" : "Create Customer";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="flex h-full w-full flex-col bg-background-page font-sans pb-6">
      {_renderMobileBack(goBack)}
      <div className="flex flex-1 flex-col px-6 mt-2 lg:px-0 lg:mt-0 w-full min-h-0">
        {_renderHeaderSection(isEditMode, goBack)}
        {isLoadingInitialData ? (
          <p className="py-12 text-center text-sm text-text-secondary">Loading customer data…</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between rounded-4xl border border-brand-gray-light bg-brand-white p-6 shadow-xs sm:p-8 min-h-0">
            <div className="grid w-full grid-cols-1 gap-x-6 gap-y-1 lg:grid-cols-2">
              <div>{_renderNameField(props)}</div>
              <div>{_renderPhoneField(props)}</div>
              <div className="lg:col-span-2">{_renderAddressField(props)}</div>
              {_renderStatusField(props)}
              {errorMessage && <p role="alert" className="lg:col-span-2 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">{errorMessage}</p>}
              {successMessage && <p role="status" className="lg:col-span-2 mb-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[13px] font-medium text-green-700">{successMessage}</p>}
            </div>
            <div className="mt-6 flex justify-end border-t border-border-default pt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 px-8 bg-action-primary text-text-inverse rounded-xl text-sm font-semibold tracking-wide shadow-xs hover:bg-action-primary-hover transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? submittingText : buttonText}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
