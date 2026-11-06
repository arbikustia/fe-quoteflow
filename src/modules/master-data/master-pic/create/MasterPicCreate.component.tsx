/* eslint-disable jsdoc/require-param, jsdoc/require-returns */
import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { SwitchComponent } from "@/components/Switch";

import type { MasterPicCreateState } from "./MasterPicCreate.type";

/** Read validation message. */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/** Render mobile back button. */
const _renderMobileBack = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit PIC" : "New PIC";

  return (
    <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
      <BackButton onClick={goBack} />
      <div className="min-w-0">
        <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-1 truncate text-sm text-text-secondary">
          {isEditMode ? "Update the PIC details below." : "Fill in the PIC details below."}
        </p>
      </div>
    </div>
  );
};

/** Render page header. */
const _renderHeader = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit PIC" : "New PIC";
  const subtitle = isEditMode ? "Update the PIC details below." : "Fill in the PIC details below.";

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
        <span>Master PIC</span>
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


/** Render PIC fields. */
// eslint-disable-next-line max-lines-per-function
const _renderFields = (props: MasterPicCreateState): ReactElement => {
  const nameError = props.isSubmitted && !props.name ? "PIC name is required." : _getFieldError(props.errors?.name);

  return (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      <InputComponent
        id="pic-name"
        type="text"
        label="PIC Name"
        className={`!mb-0 lg:col-span-2 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
          nameError
            ? "[&_.ant-input]:!border-danger"
            : "[&_.ant-input]:!border-border-strong"
        } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
        placeholder="e.g. John Doe"
        value={props.name}
        required
        errorMessage={nameError ?? undefined}
        onChange={props.handleNameChange}
      />
      {props.isEditMode && (
        <div className="flex items-center justify-between rounded-2xl border-2 border-border-strong bg-background-surface px-5 py-4 lg:col-span-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-normal text-text-primary">Status</span>
              <span className={`inline-flex rounded-full border border-current px-3 py-0.5 text-base font-semibold uppercase ${props.isActive ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
                {props.isActive ? "active" : "inactive"}
              </span>
            </div>
            <span className="text-base text-text-secondary">Toggle active or inactive status</span>
          </div>
          <SwitchComponent label="PIC status" checked={props.isActive} onChange={props.handleStatusChange} />
        </div>
      )}
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

/**
 *
 */
const _renderAction = (props: MasterPicCreateState): ReactElement => {
  const actionText = _resolveSubmitText(props.isSubmitting, props.isEditMode);

  return (
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
        {actionText}
      </button>
    </div>
  );
};


/** Render PIC create/edit form. */
export const MasterPicCreateForm = (props: MasterPicCreateState): ReactElement => {
  if (props.isLoadingInitialData) return <p className="py-12 text-center text-sm text-text-secondary">Loading PIC data…</p>;

  return (
    <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {_renderMobileBack(props.isEditMode, props.goBack)}
      <div className="flex min-h-0 w-full flex-1 flex-col pb-32 text-lg lg:pb-0">
        {_renderHeader(props.isEditMode, props.goBack)}
        <form
          noValidate
          onSubmit={props.handleSubmit}
          className="mb-6 flex flex-col rounded-3xl border border-border-default bg-background-surface p-6 shadow-small sm:p-8 lg:-mt-4 lg:mb-5 lg:flex-1 lg:rounded-3xl lg:p-10"
        >
          <div className="pb-6">
            <section className="space-y-5">{_renderFields(props)}</section>
          </div>
          {_renderAction(props)}
        </form>
        <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
      </div>
    </div>
  );
};

