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
    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
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
    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5 4.18 2 2 0 0 1 7 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L11.09 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>}
  />
);

/**
 * Render address field
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
    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>}
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
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Header element
 */
const _renderHeaderSection = (goBack: () => void): ReactElement => (
  <>
    <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-2 mb-3 text-sm font-medium text-text-secondary">
      <button type="button" onClick={goBack} className="hover:text-text-primary">Master Customer</button>
      <span aria-hidden="true">/</span>
      <span className="text-text-primary">New Customer</span>
    </nav>
    <div className="mb-6 pl-1">
      <h2 className="text-[26px] font-extrabold text-text-primary tracking-tight">New Customer</h2>
      <p className="text-[14px] text-text-secondary mt-1 font-medium">Fill in the customer details below.</p>
    </div>
  </>
);

/**
 * Master Customer Create Form
 * @param {MasterCustomerCreateFormState} props - Form props
 * @returns {ReactElement} Create form
 */
export const MasterCustomerCreateForm = (props: MasterCustomerCreateFormState): ReactElement => {
  const { isSubmitting, errorMessage, successMessage, handleSubmit, goBack } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-background-page font-sans pb-10 relative overflow-y-auto">
      {_renderMobileBack(goBack)}
      <div className="px-6 mt-2 lg:px-8 lg:mt-0 w-full">
        {_renderHeaderSection(goBack)}
        <form onSubmit={handleSubmit} className="grid w-full grid-cols-1 gap-x-6 gap-y-1 rounded-2xl border border-border-default bg-background-surface p-5 shadow-sm sm:p-6 lg:grid-cols-2 lg:p-8">
          <div>{_renderNameField(props)}</div>
          <div>{_renderPhoneField(props)}</div>
          <div className="lg:col-span-2">{_renderAddressField(props)}</div>
          {errorMessage && <p role="alert" className="lg:col-span-2 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">{errorMessage}</p>}
          {successMessage && <p role="status" className="lg:col-span-2 mb-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[13px] font-medium text-green-700">{successMessage}</p>}
          <div className="lg:col-span-2 mt-2 border-t border-border-default pt-5">
            <button type="submit" disabled={isSubmitting} className="w-full bg-action-primary text-text-inverse rounded-xl py-3 text-[15px] font-bold tracking-wide shadow-sm hover:bg-action-primary-hover transition-all disabled:opacity-60">
              {isSubmitting ? "Creating…" : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
