import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterCategoryCreateFormState } from "./MasterCategoryCreate.type";

/**
 * Read validation message from React Hook Form.
 * @param {FieldError | undefined} error - Field validation error
 * @returns {string | null} Validation message
 */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/**
 * Render category name field.
 * @param {MasterCategoryCreateFormState} props - Form state
 * @returns {ReactElement} Field element
 */
const _renderNameField = (props: MasterCategoryCreateFormState): ReactElement => (
  <InputComponent
    id="category-name"
    type="text"
    label="Category Name"
    className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
    placeholder="e.g. Audio System"
    value={props.name}
    required
    errorMessage={props.isSubmitted && !props.name ? "Category name is required." : _getFieldError(props.errors.name)}
    onChange={props.handleNameChange}
  />
);

/**
 * Render status switch field (edit mode only).
 * @param {MasterCategoryCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (props: MasterCategoryCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text-primary">Status</span>
        <span className="text-xs text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="Category status" checked={props.isActive} onChange={props.handleStatusChange} />
    </div>
  );
};

/**
 * Render mobile top back bar.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Bar element
 */
const _renderMobileBack = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Category" : "New Category";

  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 bg-background-surface px-0 lg:hidden">
      <button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="min-w-0">
        <h2 className="truncate text-4xl font-semibold leading-tight text-text-primary">{title}</h2>
      </div>
    </div>
  );
};

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
      <div className="my-6 hidden pl-1 lg:block">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
          {isEditMode ? "Update the category details below." : "Fill in the category details below."}
        </p>
      </div>
    </>
  );
};

/**
 * Render submit button section.
 * @param {boolean} isSubmitting - Submitting state
 * @param {boolean} isEditMode - Edit mode flag
 * @returns {ReactElement} Submit section
 */
const _renderSubmitSection = (isSubmitting: boolean, isEditMode: boolean): ReactElement => {
  const buttonText = isEditMode ? "Update Category" : "Create Category";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button type="submit" disabled={isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto lg:text-sm">
        {isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Render master category create form.
 * @param {MasterCategoryCreateFormState} props - Form props
 * @returns {ReactElement} Create form
 */
export const MasterCategoryCreateForm = (props: MasterCategoryCreateFormState): ReactElement => {
  const { isEditMode, isLoadingInitialData, isSubmitting, errorMessage, successMessage, handleSubmit, goBack } = props;

  return (
    <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
      {errorMessage && <AlertComponent type="error" message={errorMessage} toast closable />}
      {successMessage && <AlertComponent type="success" message={successMessage} toast closable />}
      {_renderMobileBack(isEditMode, goBack)}
      <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:px-0 lg:text-base">
        {_renderHeaderSection(isEditMode, goBack)}
        {isLoadingInitialData ? (
          <p className="py-12 text-center text-sm text-text-secondary">Loading category data…</p>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-brand-gray-light lg:bg-brand-white lg:p-8 lg:shadow-xs">
            <div className="w-full">
              {_renderNameField(props)}
              {_renderStatusField(props)}
            </div>
            {_renderSubmitSection(isSubmitting, isEditMode)}
          </form>
        )}
      </div>
    </div>
  );
};
