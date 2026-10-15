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
    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9h16" /><path d="M4 15h16" /><path d="M10 3L8 21" /><path d="M16 3l-2 18" /></svg>}
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
      <button type="button" onClick={goBack} className="hover:text-text-primary">Master Category</button>
      <span aria-hidden="true">/</span>
      <span className="text-text-primary">New Category</span>
    </nav>
    <div className="mb-6 pl-1">
      <h2 className="text-[26px] font-extrabold text-text-primary tracking-tight">New Category</h2>
      <p className="text-[14px] text-text-secondary mt-1 font-medium">Fill in the category details below.</p>
    </div>
  </>
);

/**
 * Master Category Create Form
 * @param {MasterCategoryCreateFormState} props - Form props
 * @returns {ReactElement} Create form
 */
export const MasterCategoryCreateForm = (props: MasterCategoryCreateFormState): ReactElement => {
  const { isSubmitting, errorMessage, successMessage, handleSubmit, goBack } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-background-page font-sans pb-10 relative overflow-y-auto">
      {_renderMobileBack(goBack)}
      <div className="px-6 mt-2 lg:px-0 lg:mt-0 lg:max-w-3xl">
        {_renderHeaderSection(goBack)}
        <form onSubmit={handleSubmit} className="flex flex-col rounded-2xl lg:border lg:border-border-default lg:bg-background-surface lg:p-6">
          {_renderNameField(props)}
          {errorMessage && <p role="alert" className="mb-4 text-[13px] font-medium text-red-600">{errorMessage}</p>}
          {successMessage && <p role="status" className="mb-4 text-[13px] font-medium text-green-700">{successMessage}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-action-primary text-text-inverse rounded-xl py-3 text-[15px] font-bold tracking-wide shadow-sm hover:bg-action-primary-hover transition-all mt-2 disabled:opacity-60">
            {isSubmitting ? "Creating…" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};
