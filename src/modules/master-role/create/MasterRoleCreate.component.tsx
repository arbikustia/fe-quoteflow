import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterRoleCreateFormState } from "./MasterRoleCreate.type";
import { BackButton } from "@/components/BackButton";

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
    <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
      <BackButton onClick={goBack} />
      <div className="min-w-0">
        <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-1 truncate text-sm text-text-secondary">
          {isEditMode ? "Update the role details below." : "Fill in the role details below."}
        </p>
      </div>
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
  const subtitle = isEditMode ? "Update the role details below." : "Fill in the role details below.";

  return (
    <div className="hidden lg:block">
      <nav
        aria-label="Breadcrumb"
        className="mb-2 flex items-center gap-2 text-[15px] font-medium text-text-secondary"
      >
        <button
          type="button"
          onClick={goBack}
          className="cursor-pointer hover:text-text-primary"
        >
          Master
        </button>
        <span aria-hidden="true">/</span>
        <span>Master Role</span>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="mb-6">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          {subtitle}
        </p>
      </div>
    </div>
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
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      <InputComponent
        id="role-name"
        type="text"
        label="Role Name"
        className={`!mb-0 lg:col-span-2 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
          roleError
            ? "[&_.ant-input]:!border-danger"
            : "[&_.ant-input]:!border-border-strong"
        } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
        placeholder="e.g. Administrator"
        value={props.roleName}
        required
        errorMessage={roleError ?? undefined}
        onChange={props.handleRoleNameChange}
      />
      {_renderStatusCard(props)}
    </div>
  );
};

/**
 * Render status card.
 * @param {MasterRoleCreateFormState} props - Form state
 * @returns {ReactElement | null} Status card
 */
const _renderStatusCard = (props: MasterRoleCreateFormState): ReactElement | null => {
  if (!props.isEditMode) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-normal text-text-primary">Status</span>
          <span className={`inline-flex rounded-full px-3 py-0.5 text-base font-semibold uppercase ${props.isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
            {props.isActive ? "active" : "inactive"}
          </span>
        </div>
        <span className="text-base text-text-secondary">
          Toggle active or inactive status
        </span>
      </div>
      <SwitchComponent label="Role status" checked={props.isActive} onChange={props.handleStatusChange} />
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
    <form
      noValidate
      onSubmit={props.handleSubmit}
      className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:rounded-3xl lg:p-10"
    >
      <div className="pb-6">
        <section className="space-y-5">{_renderFields(props)}</section>
      </div>
      <div className="mt-auto flex justify-between gap-3 border-t border-border-default/60 pt-5 lg:border-border-default">
        <button
          type="button"
          onClick={props.goBack}
          disabled={props.isSubmitting}
          className="h-14 cursor-pointer rounded-xl border border-border-default px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50 lg:text-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={props.isSubmitting}
          className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60 lg:text-lg"
        >
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
  <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    {_renderMobileBack(props.isEditMode, props.goBack)}
    <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
      {_renderHeader(props.isEditMode, props.goBack)}
      {_renderForm(props)}
      <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
    </div>
  </div>
);

