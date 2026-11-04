import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterCategoryCreateFormState } from "./MasterCategoryCreate.type";

/**
 * Render back icon SVG.
 * @returns {ReactElement} Back icon
 */
const _renderBackIcon = (): ReactElement => (
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
);

/**
 * Render mobile top back bar.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Bar element
 */
const _renderMobileBack = (
  isEditMode: boolean,
  goBack: () => void,
): ReactElement => {
  const title = isEditMode ? "Edit Category" : "New Category";
  const subtitle = isEditMode
    ? "Update the category details below."
    : "Fill in the category details below.";

  return (
    <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-page text-text-primary transition-colors hover:bg-background-subtle"
      >
        {_renderBackIcon()}
      </button>
      <div className="min-w-0">
        <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-1 truncate text-sm text-text-secondary">{subtitle}</p>
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
const _renderHeaderSection = (
  isEditMode: boolean,
  goBack: () => void,
): ReactElement => {
  const title = isEditMode ? "Edit Category" : "New Category";
  const subtitle = isEditMode
    ? "Update the category details below."
    : "Fill in the category details below.";

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-2 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex"
      >
        <button
          type="button"
          onClick={goBack}
          className="cursor-pointer hover:text-text-primary"
        >
          Master Category
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="mb-6 hidden lg:block">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
          {subtitle}
        </p>
      </div>
    </>
  );
};

/**
 * Render information step tab.
 * @returns {ReactElement} Step tab element
 */
// _renderInformationStepTab removed

/**
 * Read validation message from React Hook Form.
 * @param {FieldError | undefined} error - Field validation error
 * @returns {string | null} Validation message
 */
const _getFieldError = (error: FieldError | undefined): string | null =>
  error?.message?.toString() ?? null;

/**
 * Render category name field.
 * @param {MasterCategoryCreateFormState} props - Form state
 * @returns {ReactElement} Field element
 */
const _renderNameField = (
  props: MasterCategoryCreateFormState,
): ReactElement => {
  const errorMessage =
    props.isSubmitted && !props.name
      ? "Category name is required."
      : _getFieldError(props.errors.name);

  return (
    <InputComponent
      id="category-name"
      type="text"
      label="Category Name"
      placeholder="e.g. Audio System"
      value={props.name}
      required
      onChange={props.handleNameChange}
      className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
        errorMessage
          ? "[&_.ant-input]:!border-danger"
          : "[&_.ant-input]:!border-border-strong"
      } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
      errorMessage={errorMessage ?? undefined}
    />
  );
};

/**
 * Render status switch field (edit mode only).
 * @param {MasterCategoryCreateFormState} props - Form state
 * @returns {ReactElement | null} Field element
 */
const _renderStatusField = (
  props: MasterCategoryCreateFormState,
): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col">
        <span className="text-lg font-normal text-text-primary">Status</span>
        <span className="text-base text-text-secondary">
          Toggle active or inactive status
        </span>
      </div>
      <SwitchComponent
        label="Category status"
        checked={props.isActive}
        onChange={props.handleStatusChange}
      />
    </div>
  );
};

/**
 * Render submit button section.
 * @param {boolean} isSubmitting - Submitting state
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Submit section
 */
const _renderSubmitSection = (
  isSubmitting: boolean,
  isEditMode: boolean,
  goBack: () => void,
): ReactElement => {
  const buttonText = isEditMode ? "Update Category" : "Create Category";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="mt-8 flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button
        type="button"
        onClick={goBack}
        className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50 lg:text-lg"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60 lg:text-lg"
      >
        {isSubmitting ? submittingText : buttonText}
      </button>
    </div>
  );
};

/**
 * Render form card container.
 * @param {MasterCategoryCreateFormState} props - Form state
 * @returns {ReactElement} Form element
 */
const _renderFormCard = (
  props: MasterCategoryCreateFormState,
): ReactElement => (
  <form
    noValidate
    onSubmit={props.handleSubmit}
    className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:mb-5 lg:rounded-3xl lg:p-10"
  >
    <div className="pb-6">
      <section className="space-y-5">
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            {_renderNameField(props)}
          </div>
          {_renderStatusField(props)}
        </div>
      </section>
    </div>
    {_renderSubmitSection(props.isSubmitting, props.isEditMode, props.goBack)}
  </form>
);

/**
 * Render notification alerts.
 * @param {string | null} errorMessage - Error alert text
 * @param {string | null} successMessage - Success alert text
 * @returns {ReactElement | null} Alert element
 */
const _renderAlerts = (
  errorMessage: string | null,
  successMessage: string | null,
): ReactElement | null => {
  if (errorMessage) {
    return <AlertComponent type="error" message={errorMessage} toast closable />;
  }

  if (successMessage) {
    return (
      <AlertComponent
        type="success"
        message={successMessage}
        toast
        closable
      />
    );
  }

  return null;
};

/**
 * Render master category create form.
 * @param {MasterCategoryCreateFormState} props - Form props
 * @returns {ReactElement} Create form
 */
export const MasterCategoryCreateForm = (
  props: MasterCategoryCreateFormState,
): ReactElement => {
  const {
    isEditMode,
    isLoadingInitialData,
    errorMessage,
    successMessage,
    goBack,
  } = props;

  return (
    <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
      {_renderAlerts(errorMessage, successMessage)}
      {_renderMobileBack(isEditMode, goBack)}
      <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
        {_renderHeaderSection(isEditMode, goBack)}
        {isLoadingInitialData ? (
          <p className="py-12 text-center text-sm text-text-secondary">
            Loading category data…
          </p>
        ) : (
          _renderFormCard(props)
        )}
        <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
      </div>
    </div>
  );
};
