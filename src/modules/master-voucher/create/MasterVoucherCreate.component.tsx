import type { ReactElement } from "react";

import type { MasterVoucherCreateFormState } from "./MasterVoucherCreate.type";

import Layout from "@/app/layout";

/**
 * Render status switch field (edit mode only).
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (props: MasterVoucherCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text-primary">Status</span>
        <span className="text-xs text-text-secondary">Toggle active or inactive status</span>
      </div>
      <button type="button" role="switch" aria-checked={props.isActive} onClick={props.handleStatusChange} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/30 ${props.isActive ? "bg-brand-blue" : "bg-brand-gray-light"}`}>
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${props.isActive ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
};

/**
 * Render mobile back bar.
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Back bar
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-surface px-0 lg:hidden">
    <button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    </button>
  </div>
);

/**
 * Render header section.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Header
 */
const _renderHeaderSection = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Voucher" : "New Voucher";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master Voucher</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 pl-1">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
          {isEditMode ? "Update the voucher details below." : "Fill in the voucher details below."}
        </p>
      </div>
    </>
  );
};

/**
 * Render code options and custom input when active.
 * @param {MasterVoucherCreateFormState} props - Form state
 * @param {string} fieldClass - Input class
 * @returns {ReactElement} Code option element
 */
const _renderCodeOption = (props: MasterVoucherCreateFormState, fieldClass: string): ReactElement => (
  <>
    <div>
      <label htmlFor="voucher-code-mode" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
        Code Option <span aria-hidden="true" className="text-red-600">*</span>
      </label>
      <select id="voucher-code-mode" value={props.codeMode} onChange={props.handleCodeModeChange} className={`${fieldClass} cursor-pointer`}>
        <option value="generate">Generate Code</option>
        <option value="type">Type Code</option>
      </select>
    </div>
    {props.codeMode === "type" && (
      <div>
        <label htmlFor="voucher-code" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
          Voucher Code <span aria-hidden="true" className="text-red-600">*</span>
        </label>
        <input id="voucher-code" value={props.code} onChange={props.handleCodeChange} placeholder="Min 7, max 8 chars (alphanumeric)" maxLength={8} required className={`${fieldClass} uppercase`} />
        <p className="mt-1 text-xs text-text-secondary">Code must be minimum 7 and maximum 8 alphanumeric characters.</p>
      </div>
    )}
  </>
);

/**
 * Render form input fields.
 * @param {MasterVoucherCreateFormState} props - Form state
 * @param {string} fieldClass - Input class
 * @returns {ReactElement} Inputs container
 */
const _renderFormInputs = (props: MasterVoucherCreateFormState, fieldClass: string): ReactElement => (
  <div className="space-y-4">
    <div>
      <label htmlFor="voucher-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
        Voucher Name <span aria-hidden="true" className="text-red-600">*</span>
      </label>
      <input id="voucher-name" value={props.name} onChange={props.handleNameChange} placeholder="e.g. Summer Promo" required className={fieldClass} />
    </div>
    {_renderCodeOption(props, fieldClass)}
    <div>
      <label htmlFor="discount-percent" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
        Discount (%) <span aria-hidden="true" className="text-red-600">*</span>
      </label>
      <input id="discount-percent" type="number" min="0" max="100" value={props.discountPercent} onChange={props.handleDiscountChange} placeholder="e.g. 10" required className={fieldClass} />
    </div>
    {_renderStatusField(props)}
    {props.errorMessage !== null && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">{props.errorMessage}</p>}
  </div>
);

/**
 * Render master voucher create/edit form.
 * @param {MasterVoucherCreateFormState} props - Form state
 * @returns {ReactElement} Voucher form
 */
export const MasterVoucherCreateComponent = (props: MasterVoucherCreateFormState): ReactElement => {
  const { isSubmitting, isEditMode, handleSubmit, goBack } = props;
  const buttonText = isEditMode ? "Update Voucher" : "Create Voucher";
  const submittingText = isEditMode ? "Updating…" : "Creating…";
  const fieldClass = "w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-[15px] font-normal text-text-primary shadow-xs outline-none transition-all placeholder:font-normal placeholder:text-text-tertiary/60 focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30";

  return (
    <Layout mobileWhiteBackground={true}>
      <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
        {_renderMobileBack(goBack)}
        <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-0 lg:mt-0 lg:px-0">
          {_renderHeaderSection(isEditMode, goBack)}
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
            {_renderFormInputs(props, fieldClass)}
            <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
              <button type="submit" disabled={isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto">{isSubmitting ? submittingText : buttonText}</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
