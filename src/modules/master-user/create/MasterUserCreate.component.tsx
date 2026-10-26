/* eslint-disable jsdoc/require-param, jsdoc/require-returns, sonarjs/no-nested-conditional */
import type { ReactElement } from "react";
import type { FieldError } from "react-hook-form";

import { AlertComponent } from "@/components/Alert";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import type { MasterUserCreateFormState } from "./MasterUserCreate.type";

import Layout from "@/app/layout";

/** Read validation message from error. */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/** Render mobile back button. */
const _renderMobileBack = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit User" : "New User";

  return (
  <div className="sticky top-0 z-20 flex items-center gap-3 bg-background-surface px-0 lg:hidden">
    <button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    </button>
    <h2 className="truncate text-4xl font-semibold leading-tight text-text-primary">{title}</h2>
  </div>
  );
};

/** Render header section. */
const _renderHeader = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit User" : "New User";
  const subtitle = isEditMode ? "Update the user details below." : "Fill in the user details below.";

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
        <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master User</button>
        <span aria-hidden="true">/</span>
        <span className="text-text-primary">{title}</span>
      </nav>
      <div className="my-6 hidden pl-1 lg:block">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">{subtitle}</p>
      </div>
    </>
  );
};

/** Render password toggle icon. */
const _renderPasswordIcon = (isPasswordVisible: boolean): ReactElement => isPasswordVisible ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" x2="23" y1="1" y2="23" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

/** Render password input field. */
const _renderPassword = (props: MasterUserCreateFormState): ReactElement => {
  const passwordError = props.isSubmitted && !props.password ? "Password is required." : _getFieldError(props.errors?.password);

  return (
    <div className="relative lg:col-span-2">
      <InputComponent
        id="password"
        type={props.isPasswordVisible ? "text" : "password"}
        label="Password"
        className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
        value={props.password}
        required
        errorMessage={passwordError}
        onChange={props.handlePasswordChange}
      />
      <button
        type="button"
        onClick={props.handleTogglePasswordVisibility}
        className="absolute right-3 top-9 p-1.5 text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer"
        aria-label={props.isPasswordVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        {_renderPasswordIcon(props.isPasswordVisible)}
      </button>
      <p className="-mt-2 mb-4 text-xs font-normal leading-relaxed text-text-secondary">
        Password harus terdiri dari minimal 11 karakter. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol agar password lebih aman.
      </p>
    </div>
  );
};

/** Render role select and status toggle. */
const _renderRoleAndStatus = (props: MasterUserCreateFormState): ReactElement => {
  const roleError = props.isSubmitted && !props.role ? "Role is required." : _getFieldError(props.errors?.role);
  const options = props.roleOptions.map((opt) => ({ label: opt.role, value: opt.role }));

  return (
    <>
      <div className="mb-4 lg:col-span-2">
        <Select
          id="role"
          label="Role"
          labelClassName="text-base"
          className="[&_.ant-select-selector]:text-xl"
          placeholder={props.roleOptionsLoading ? "Loading roles…" : "Select role"}
          value={props.role}
          options={options}
          onChange={props.handleRoleChange}
          required
          disabled={props.roleOptionsLoading}
          errorMessage={roleError || props.roleOptionsError}
        />
      </div>
      {props.isEditMode && (
        <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-primary">Status</span>
            <span className="text-xs text-text-secondary">Toggle active or inactive status</span>
          </div>
          <SwitchComponent label="User status" checked={props.isActive} onChange={props.handleStatusChange} />
        </div>
      )}
    </>
  );
};

/** Render all form inputs in grid. */
const _renderFormInputs = (props: MasterUserCreateFormState): ReactElement => {
  const usernameError = props.isSubmitted && !props.username ? "Username is required." : _getFieldError(props.errors?.username);
  const emailError = props.isSubmitted && !props.email ? "Email is required." : _getFieldError(props.errors?.email);

  return (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-2 lg:grid-cols-2">
      <InputComponent
        id="username"
        type="text"
        label="Username"
        className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
        placeholder="e.g. johndoe"
        value={props.username}
        required
        errorMessage={usernameError}
        onChange={props.handleUsernameChange}
      />
      <InputComponent
        id="email"
        type="email"
        label="Email"
        className="[&_.ant-input]:text-xl [&_.ant-input]:placeholder:text-xl [&_label]:text-base"
        placeholder="e.g. john@example.com"
        value={props.email}
        required
        errorMessage={emailError}
        onChange={props.handleEmailChange}
      />
      {!props.isEditMode && _renderPassword(props)}
      {_renderRoleAndStatus(props)}
    </div>
  );
};

/** Render form action submit button. */
const _renderFormActions = (isSubmitting: boolean, isEditMode: boolean): ReactElement => {
  const submitLabel = isSubmitting ? "Saving…" : (isEditMode ? "Update User" : "Create User");

  return (
    <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button type="submit" disabled={isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto lg:text-sm">
        {submitLabel}
      </button>
    </div>
  );
};

/** Render master user create/edit form. */
export const MasterUserCreateComponent = (props: MasterUserCreateFormState): ReactElement => (
  <Layout pageTitle={props.isEditMode ? "Edit User" : "New User"} mobileWhiteBackground={true} showMobileGlobalHeader={true}>
    <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {_renderMobileBack(props.isEditMode, props.goBack)}
      <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:px-0 lg:text-base">
        {_renderHeader(props.isEditMode, props.goBack)}
        <form noValidate onSubmit={props.handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-brand-gray-light lg:bg-brand-white lg:p-8 lg:shadow-xs">
          {_renderFormInputs(props)}
          {_renderFormActions(props.isSubmitting, props.isEditMode)}
        </form>
      </div>
    </div>
  </Layout>
);
