import { type ReactElement } from "react";
import type { FieldError } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { AlertComponent } from "@/components/Alert";
import { BackButton } from "@/components/BackButton";
import { InputComponent } from "@/components/Input";
import { Select } from "@/components/Select";
import { SwitchComponent } from "@/components/Switch";

import type { MasterUserCreateFormState } from "./MasterUserCreate.type";

import Layout from "@/app/layout";

/**
 * Read validation message from error.
 *
 * @param {FieldError | undefined} error - Error
 * @returns {string | null} Resolved value
 */
const _getFieldError = (error: FieldError | undefined): string | null => error?.message?.toString() ?? null;

/**
 * Render mobile back button.
 *
 * @param {boolean} isEditMode - Whether edit mode
 * @param {() => void} goBack - Go back
 * @returns {ReactElement} Rendered element
 */
const _renderMobileBack = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit User" : "New User";

  return (
    <div className="mb-6 flex items-center gap-3 bg-background-page lg:hidden">
      <BackButton onClick={goBack} />
      <div className="min-w-0">
        <h2 className="truncate text-4xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-1 truncate text-sm text-text-secondary">
          {isEditMode ? "Update the user details below." : "Fill in the user details below."}
        </p>
      </div>
    </div>
  );
};

/**
 * Render header section.
 *
 * @param {boolean} isEditMode - Whether edit mode
 * @param {() => void} goBack - Go back
 * @returns {ReactElement} Rendered element
 */
const _renderHeader = (isEditMode: boolean, goBack: () => void): ReactElement => {
  const title = isEditMode ? "Edit User" : "New User";
  const subtitle = isEditMode ? "Update the user details below." : "Fill in the user details below.";

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
        <span>Master User</span>
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
 * Render password toggle icon.
 *
 * @param {boolean} isPasswordVisible - Whether password visible
 * @returns {ReactElement} Rendered element
 */
const _renderPasswordIcon = (isPasswordVisible: boolean): ReactElement =>
  isPasswordVisible ? (
    <FiEyeOff className="h-6 w-6" aria-hidden="true" />
  ) : (
    <FiEye className="h-6 w-6" aria-hidden="true" />
  );

/**
 * Render password input field.
 *
 * @param {MasterUserCreateFormState} props - Props
 * @returns {ReactElement} Rendered element
 */
const _renderPassword = (props: MasterUserCreateFormState): ReactElement => {
  const passwordError = props.isSubmitted && !props.password ? "Password is required." : _getFieldError(props.errors?.password);

  return (
    <div className="relative lg:col-span-2">
      <InputComponent
        id="password"
        type={props.isPasswordVisible ? "text" : "password"}
        label="Password"
        className={`!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
          passwordError
            ? "[&_.ant-input]:!border-danger"
            : "[&_.ant-input]:!border-border-strong"
        } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`}
        value={props.password}
        required
        errorMessage={passwordError ?? undefined}
        onChange={props.handlePasswordChange}
      />
      <button
        type="button"
        onClick={props.handleTogglePasswordVisibility}
        className="absolute right-4 top-[3.75rem] -translate-y-1/2 p-2 text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer"
        aria-label={props.isPasswordVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        {_renderPasswordIcon(props.isPasswordVisible)}
      </button>
      <p className="mt-2 text-sm font-normal leading-relaxed text-text-secondary">
        Password harus terdiri dari minimal 11 karakter. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol agar password lebih aman.
      </p>
    </div>
  );
};

/**
 * Render user status card.
 *
 * @param {MasterUserCreateFormState} props - Props
 * @returns {ReactElement | null} Rendered element
 */
const _renderStatusCard = (props: MasterUserCreateFormState): ReactElement | null => {
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
        <span className="text-base text-text-secondary">Toggle active or inactive status</span>
      </div>
      <SwitchComponent label="User status" checked={props.isActive} onChange={props.handleStatusChange} />
    </div>
  );
};

/**
 * Render role select and status toggle.
 *
 * @param {MasterUserCreateFormState} props - Props
 * @returns {ReactElement} Rendered element
 */
const _renderRoleAndStatus = (props: MasterUserCreateFormState): ReactElement => {
  const roleError = props.isSubmitted && !props.role ? "Role is required." : _getFieldError(props.errors?.role);
  const options = props.roleOptions.map((opt) => ({ label: opt.role, value: opt.role }));

  return (
    <>
      <div className="mb-0 lg:col-span-2">
        <Select
          id="role"
          label="Role"
          labelClassName="!text-lg !font-normal !text-text-primary"
          className="!mb-0"
          selectClassName="!h-16 lg:!h-14 [&_.ant-select-content]:!text-xl lg:[&_.ant-select-content]:!text-lg"
          placeholder={props.roleOptionsLoading ? "Loading roles…" : "Select role"}
          value={props.role}
          options={options}
          onChange={props.handleRoleChange}
          required
          disabled={props.roleOptionsLoading}
          errorMessage={roleError || props.roleOptionsError}
        />
      </div>
      {_renderStatusCard(props)}
    </>
  );
};


/**
 * Build the shared input class names, switching the border on error.
 *
 * @param {string | null} error - Field error message
 * @returns {string} Input class names
 */
const _getInputClassName = (error: string | null): string =>
  `!mb-0 [&_.ant-input]:!h-16 lg:[&_.ant-input]:!h-14 [&_.ant-input]:!rounded-2xl [&_.ant-input]:!border-2 ${
    error ? "[&_.ant-input]:!border-danger" : "[&_.ant-input]:!border-border-strong"
  } [&_.ant-input.ant-input-status-error]:!border-danger [&_.ant-input]:!px-4 [&_.ant-input]:!text-xl lg:[&_.ant-input]:!text-lg [&_.ant-input]:!font-normal [&_.ant-input]:placeholder:!text-xl lg:[&_.ant-input]:placeholder:!text-lg [&_.ant-input]:placeholder:!font-normal [&_label]:!text-lg lg:[&_label]:!text-lg [&_label]:!font-normal [&_label]:!normal-case [&_label]:!text-text-primary`;

/**
 * Render username and email inputs.
 *
 * @param {MasterUserCreateFormState} props - Props
 * @returns {ReactElement} Rendered element
 */
const _renderCredentialFields = (props: MasterUserCreateFormState): ReactElement => {
  const usernameError = props.isSubmitted && !props.username ? "Username is required." : _getFieldError(props.errors?.username);
  const emailError = props.isSubmitted && !props.email ? "Email is required." : _getFieldError(props.errors?.email);

  return (
    <>
      <InputComponent
        id="username"
        type="text"
        label="Username"
        className={_getInputClassName(usernameError)}
        placeholder="e.g. johndoe"
        value={props.username}
        required
        errorMessage={usernameError ?? undefined}
        onChange={props.handleUsernameChange}
      />
      <InputComponent
        id="email"
        type="email"
        label="Email"
        className={_getInputClassName(emailError)}
        placeholder="e.g. john@example.com"
        value={props.email}
        required
        errorMessage={emailError ?? undefined}
        onChange={props.handleEmailChange}
      />
    </>
  );
};

/**
 * Render all form inputs in grid.
 *
 * @param {MasterUserCreateFormState} props - Props
 * @returns {ReactElement} Rendered element
 */
const _renderFormInputs = (props: MasterUserCreateFormState): ReactElement => (
  <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
    {_renderCredentialFields(props)}
    {!props.isEditMode && _renderPassword(props)}
    {_renderRoleAndStatus(props)}
  </div>
);

/**
 * Resolve submit button label.
 *
 * @param {MasterUserCreateFormState} props - Form state
 * @returns {string} Submit label
 */
const _getSubmitLabel = (props: MasterUserCreateFormState): string => {
  if (props.isSubmitting) return "Saving…";

  return props.isEditMode ? "Update User" : "Create User";
};

/**
 * Render form action buttons.
 *
 * @param {MasterUserCreateFormState} props - Form state
 * @returns {ReactElement} Form actions
 */
const _renderFormActions = (props: MasterUserCreateFormState): ReactElement => {
  const submitLabel = _getSubmitLabel(props);

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
        {submitLabel}
      </button>
    </div>
  );
};


/**
 * Render master user create/edit form.
 *
 * @param {MasterUserCreateFormState} props - Props
 * @returns {ReactElement} Rendered element
 */
export const MasterUserCreateComponent = (props: MasterUserCreateFormState): ReactElement => (
  <Layout pageTitle={props.isEditMode ? "Edit User" : "New User"}>
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
            <section className="space-y-5">
              {_renderFormInputs(props)}
            </section>
          </div>
          {_renderFormActions(props)}
        </form>
        <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />

      </div>
    </div>
  </Layout>
);
