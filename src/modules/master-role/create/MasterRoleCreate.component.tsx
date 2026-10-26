import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterRoleCreateFormState } from "./MasterRoleCreate.type";

/**
 * Get validation message.
 * @param {FieldError | undefined} error - Field error
 * @returns {string | null} Error message
 */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/**
 * Render mobile back bar.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Back bar
 */
const _renderMobileBack = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Role" : "New Role";

  return (
  <div className="sticky top-0 z-20 flex items-center gap-3 bg-background-surface px-0 lg:hidden">
    <button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    </button>
    <h2 className="truncate text-4xl font-semibold leading-tight text-text-primary">{title}</h2>
  </div>
  );
};

/**
 * Render form header.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back navigation
 * @returns {ReactElement} Header
 */
const _renderHeader = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit Role" : "New Role";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master Role</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 hidden pl-1 lg:block">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
          {isEditMode ? "Update the role details below." : "Fill in the role details below."}
        </p>
      </div>
    </>
  );
};

/**
 * Render form fields.
 * @param {MasterRoleCreateFormState} props - Form state
 * @returns {ReactElement} Form fields
 */
const _renderFields = (props: MasterRoleCreateFormState): ReactElement => {
  const roleError = props.isSubmitted && !props.roleName ? "Role name is required." : _getFieldError(props.errors?.roleName);

  return (
    <div className="space-y-4">
      <InputComponent
        id="role-name"
        type="text"
        label="Role Name"
        className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
        placeholder="e.g. Administrator"
        value={props.roleName}
        required
        errorMessage={roleError}
        onChange={props.handleRoleNameChange}
      />
      {props.isEditMode && (
        <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
          <div>
            <p className="text-lg font-semibold text-text-primary lg:text-sm">Status</p>
            <p className="text-base text-text-secondary lg:text-xs">Toggle active or inactive status</p>
          </div>
          <SwitchComponent label="Role status" checked={props.isActive} onChange={props.handleStatusChange} />
        </div>
      )}
    </div>
  );
};

/**
 * Render role form.
 * @param {MasterRoleCreateFormState} props - Form state
 * @returns {ReactElement} Form
 */
const _renderForm = (props: MasterRoleCreateFormState): ReactElement => {
  const buttonText = props.isEditMode ? "Update Role" : "Create Role";
  const submittingText = props.isEditMode ? "Updating…" : "Creating…";

  return (
    <form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
      {_renderFields(props)}
      <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
        <button type="submit" disabled={props.isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto lg:text-sm">
          {props.isSubmitting ? submittingText : buttonText}
        </button>
      </div>
    </form>
  );
};

/**
 * Render master role form.
 * @param {MasterRoleCreateFormState} props - Form state
 * @returns {ReactElement} Role form
 */
export const MasterRoleCreateComponent = (props: MasterRoleCreateFormState): ReactElement => (
  <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {_renderMobileBack(props.isEditMode, props.goBack)}
    <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:px-0 lg:text-base">
      {_renderHeader(props.isEditMode, props.goBack)}
      {_renderForm(props)}
    </div>
  </div>
);
