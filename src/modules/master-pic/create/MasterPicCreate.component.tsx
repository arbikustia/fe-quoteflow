/* eslint-disable jsdoc/require-param, jsdoc/require-returns */
import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterPicCreateState } from "./MasterPicCreate.type";

/** Read validation message. */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/** Render mobile back button. */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-surface px-0 lg:hidden">
    <button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    </button>
  </div>
);

/** Render page header. */
const _renderHeader = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit PIC" : "New PIC";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex"><button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master PIC</button><span aria-hidden="true">/</span><span className="text-text-primary">{title}</span></nav>
      <div className="my-6 pl-1"><h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2><p className="mt-3 text-sm font-medium text-text-secondary opacity-70">{isEditMode ? "Update the PIC details below." : "Fill in the PIC details below."}</p></div>
    </>
  );
};

/** Render PIC fields. */
const _renderFields = (props: MasterPicCreateState): ReactElement => {
  const nameError = props.isSubmitted && !props.name ? "PIC name is required." : _getFieldError(props.errors?.name);

  return (
    <div className="space-y-4">
      <InputComponent id="pic-name" type="text" label="PIC Name" placeholder="e.g. John Doe" value={props.name} required errorMessage={nameError} onChange={props.handleNameChange} />
      {props.isEditMode && <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5"><div><p className="text-sm font-semibold text-text-primary">Status</p><p className="text-xs text-text-secondary">Toggle active or inactive status</p></div><SwitchComponent label="PIC status" checked={props.isActive} onChange={props.handleStatusChange} /></div>}
    </div>
  );
};

/** Resolve submit text. */
const _resolveSubmitText = (isSubmitting: boolean, isEditMode: boolean): string => {
  if (isSubmitting) {
    return isEditMode ? "Updating…" : "Creating…";
  }

  return isEditMode ? "Update PIC" : "Create PIC";
};

/** Render submit action. */
const _renderAction = (isSubmitting: boolean, isEditMode: boolean): ReactElement => {
  const actionText = _resolveSubmitText(isSubmitting, isEditMode);

  return (
    <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button type="submit" disabled={isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto">
        {actionText}
      </button>
    </div>
  );
};

/** Render PIC create/edit form. */
export const MasterPicCreateForm = (props: MasterPicCreateState): ReactElement => {
  if (props.isLoadingInitialData) return <p className="py-12 text-center text-sm text-text-secondary">Loading PIC data…</p>;

  return <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">{props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}{_renderMobileBack(props.goBack)}<div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-0 lg:mt-0 lg:px-0">{_renderHeader(props.isEditMode, props.goBack)}<form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">{_renderFields(props)}{_renderAction(props.isSubmitting, props.isEditMode)}</form></div></div>;
};
