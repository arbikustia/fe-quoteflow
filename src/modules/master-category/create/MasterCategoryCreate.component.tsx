import type { ReactElement } from "react";

import { InputField } from "./InputField.component";
import type { MasterCategoryCreateFormState } from "./MasterCategoryCreate.type";

/**
 * Render name input field.
 * @param {MasterCategoryCreateFormState} props - Form state
 * @returns {ReactElement} Field element
 */
const _renderNameField = (props: MasterCategoryCreateFormState): ReactElement => (
  <InputField
    label="Category Name"
    placeholder="e.g. Audio System"
    value={props.name}
    required
    onChange={props.handleNameChange}
  />
);

/**
 * Render mobile top back bar.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Bar element
 */
/**
 * Render status switch field (edit mode only).
 * @param {MasterCategoryCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (props: MasterCategoryCreateFormState): ReactElement | null => {
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

const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-page/90 px-6 pt-6 lg:px-0 lg:pt-0">
    <button type="button" onClick={goBack} className="group flex items-center gap-3 text-text-secondary transition-colors hover:text-text-primary lg:hidden">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-surface text-text-primary shadow-sm transition-colors group-hover:bg-background-subtle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
      </div>
      <span className="text-[15px] font-bold">Back</span>
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
  const title = isEditMode ? "Edit Category" : "New Category";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master Category</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 pl-1">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
          {isEditMode ? "Update the category details below." : "Fill in the category details below."}
        </p>
      </div>
    </>
  );
};

/**
 * Master Category Create Form.
 * @param {MasterCategoryCreateFormState} props - Form props
 * @returns {ReactElement} Create form
 */
export const MasterCategoryCreateForm = (props: MasterCategoryCreateFormState): ReactElement => {
  const { isEditMode, isSubmitting, errorMessage, successMessage, handleSubmit, goBack } = props;
  const buttonText = isEditMode ? "Update Category" : "Create Category";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
      {_renderMobileBack(goBack)}
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-6 lg:mt-0 lg:px-0">
        {_renderHeaderSection(isEditMode, goBack)}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between rounded-4xl border border-border-default bg-background-surface p-6 shadow-xs sm:p-8">
          <div>
            {_renderNameField(props)}
            {_renderStatusField(props)}
            {errorMessage && <p role="alert" className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">{errorMessage}</p>}
            {successMessage && <p role="status" className="mb-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[13px] font-medium text-green-700">{successMessage}</p>}
          </div>
          <div className="mt-6 flex justify-end border-t border-border-default pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60"
            >
              {isSubmitting ? submittingText : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
