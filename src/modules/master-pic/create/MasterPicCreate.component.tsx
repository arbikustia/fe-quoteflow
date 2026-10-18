import type { ReactElement } from "react";

import type { MasterPicCreateState } from "./MasterPicCreate.type";

const FIELD_CLASS = "w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-[15px] text-text-primary shadow-xs outline-none transition-all placeholder:text-text-tertiary/60 focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30";

/**
 * Render status switch field.
 * @param {MasterPicCreateState} props - Form state
 * @returns {ReactElement | null} Status field
 */
const _renderStatusField = (props: MasterPicCreateState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5"><div className="flex flex-col"><span className="text-sm font-semibold text-text-primary">Status</span><span className="text-xs text-text-secondary">Toggle active or inactive status</span></div><button type="button" role="switch" aria-checked={props.isActive} onClick={props.handleStatusChange} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 ${props.isActive ? "bg-brand-blue" : "bg-brand-gray-light"}`}><span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${props.isActive ? "translate-x-5" : "translate-x-0"}`} /></button></div>;
};

/**
 * Render mobile back bar.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Back bar
 */
const _renderMobileBack = (goBack: () => void): ReactElement => <div className="sticky top-0 z-20 flex items-center bg-background-surface px-0 lg:hidden"><button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg></button></div>;

/**
 * Render form header.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Header
 */
const _renderHeader = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit PIC" : "New PIC";
  const description = isEditMode ? "Update the PIC details below." : "Fill in the PIC details below.";

  return <><nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex"><button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master PIC</button><span aria-hidden="true">/</span><span className="text-text-primary">{title}</span></nav><div className="my-6 pl-1"><h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2><p className="mt-3 text-sm font-medium text-text-secondary opacity-70">{description}</p></div></>;
};

/**
 * Render PIC fields.
 * @param {MasterPicCreateState} props - Form state
 * @returns {ReactElement} Form fields
 */
const _renderFields = (props: MasterPicCreateState): ReactElement => <div className="space-y-4"><div><label htmlFor="pic-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">PIC Name <span aria-hidden="true" className="text-red-600">*</span></label><input id="pic-name" value={props.name} onChange={props.handleNameChange} placeholder="e.g. John Doe" required className={FIELD_CLASS} /></div>{_renderStatusField(props)}{props.errorMessage !== null && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">{props.errorMessage}</p>}</div>;

/**
 * Resolve PIC submit button text.
 * @param {boolean} isSubmitting - Is submitting state
 * @param {boolean} isEditMode - Is edit mode state
 * @returns {string} Button text
 */
const _resolveSubmitText = (isSubmitting: boolean, isEditMode: boolean): string => {
  if (isSubmitting) {
    return isEditMode ? "Updating…" : "Creating…";
  }

  return isEditMode ? "Update PIC" : "Create PIC";
};

/**
 * Render submit action.
 * @param {boolean} isSubmitting - Submission state
 * @param {boolean} isEditMode - Edit mode state
 * @returns {ReactElement} Submit action
 */
const _renderAction = (isSubmitting: boolean, isEditMode: boolean): ReactElement => {
  const actionText = _resolveSubmitText(isSubmitting, isEditMode);

  return <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default"><button type="submit" disabled={isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto">{actionText}</button></div>;
};

/**
 * Render PIC create/edit form.
 * @param {MasterPicCreateState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterPicCreateForm = (props: MasterPicCreateState): ReactElement => {
  if (props.isLoadingInitialData) return <p className="py-12 text-center text-sm text-text-secondary">Loading PIC data…</p>;

  return <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">{_renderMobileBack(props.goBack)}<div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-0 lg:mt-0 lg:px-0">{_renderHeader(props.isEditMode, props.goBack)}<form onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">{_renderFields(props)}{_renderAction(props.isSubmitting, props.isEditMode)}</form></div></div>;
};
