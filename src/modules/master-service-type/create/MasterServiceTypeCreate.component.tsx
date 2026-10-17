import type { ReactElement } from "react";

import Layout from "@/app/layout";

import { formatRupiahInput } from "./MasterServiceTypeCreate.helpers";
import type { MasterServiceTypeCreateFormState } from "./MasterServiceTypeCreate.type";

/**
 * Render status switch field (edit mode only).
 * @param {MasterServiceTypeCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (props: MasterServiceTypeCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
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
 * Render mobile top back bar.
 * @param {() => void} goBack - Back navigation
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  </div>
);

/**
 * Render page header with breadcrumb.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Header element
 */
const _renderHeaderSection = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Service Type" : "New Service Type";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">
          Master Service Type
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 pl-1">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
          {isEditMode ? "Update the service type details below." : "Fill in the service type details below."}
        </p>
      </div>
    </>
  );
};

/**
 * Render service type create/edit form.
 * @param {MasterServiceTypeCreateFormState} props - Form state
 * @returns {ReactElement} Service type form
 */
export const MasterServiceTypeCreateComponent = (props: MasterServiceTypeCreateFormState): ReactElement => {
  const {
    serviceName,
    price,
    isSubmitting,
    isEditMode,
    errorMessage,
    handleServiceNameChange,
    handlePriceChange,
    handleSubmit,
    goBack,
  } = props;

  const buttonText = isEditMode ? "Update Service Type" : "Create Service Type";
  const submittingText = isEditMode ? "Updating…" : "Creating…";
  const fieldClass =
    "w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-[15px] font-normal text-text-primary shadow-xs outline-none transition-all placeholder:font-normal placeholder:text-text-tertiary/60 focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30";

  return (
    <Layout mobileWhiteBackground={true}>
      <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
        {_renderMobileBack(goBack)}
        <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-6 lg:mt-0 lg:px-0">
          {_renderHeaderSection(isEditMode, goBack)}
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="service-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Service Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="service-name"
                  value={serviceName}
                  onChange={handleServiceNameChange}
                  placeholder="e.g. Sound System"
                  required
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="service-price" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Price <span className="text-red-600">*</span>
                </label>
                <input
                  id="service-price"
                  type="text"
                  inputMode="numeric"
                  value={formatRupiahInput(price)}
                  onChange={handlePriceChange}
                  placeholder="Rp 500.000"
                  required
                  className={fieldClass}
                />
              </div>
              {_renderStatusField(props)}
              {errorMessage !== null && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
                  {errorMessage}
                </p>
              )}
            </div>
            <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? submittingText : buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
