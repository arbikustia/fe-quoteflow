import type { ReactElement } from "react";

import type { MasterUserCreateFormState } from "./MasterUserCreate.type";

import Layout from "@/app/layout";

const fieldClass = "h-12 w-full rounded-xl border border-border-default bg-background-surface px-4 text-[15px] text-text-primary outline-none transition-all placeholder:text-text-tertiary/60 focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30";

/**
 * Render mobile back button.
 * @param {() => void} goBack - Back handler
 * @returns {ReactElement} Back button element
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-surface px-0 lg:hidden">
    <button
      type="button"
      onClick={goBack}
      aria-label="Back"
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  </div>
);

/**
 * Render password visibility icon.
 * @param {boolean} isPasswordVisible - Password visibility state
 * @returns {ReactElement} Password visibility icon
 */
const _renderPasswordIcon = (isPasswordVisible: boolean): ReactElement => isPasswordVisible ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" x2="23" y1="1" y2="23" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/**
 * Render password toggle button.
 * @param {boolean} isVisible - Is password visible
 * @param {() => void} onToggle - Toggle callback
 * @returns {ReactElement} Toggle button element
 */
const _renderPasswordToggle = (isVisible: boolean, onToggle: () => void): ReactElement => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer"
    aria-label={isVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
  >
    {_renderPasswordIcon(isVisible)}
  </button>
);

/**
 * Render password field.
 * @param {MasterUserCreateFormState} props - Form state
 * @returns {ReactElement} Password input element
 */
const _renderPassword = (props: MasterUserCreateFormState): ReactElement => {
  const { password, isPasswordVisible, handlePasswordChange, handleTogglePasswordVisibility } = props;

  return (
    <div className="lg:col-span-2">
      <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
        Password <span className="text-red-600">*</span>
      </label>
      <div className="relative w-full">
        <input
          id="password"
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          required
          className={`${fieldClass} pr-12`}
        />
        {_renderPasswordToggle(isPasswordVisible, handleTogglePasswordVisibility)}
      </div>
      <p className="mt-2 text-xs font-normal leading-relaxed text-text-secondary">
        Password harus terdiri dari minimal 11 karakter. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol agar password lebih aman.
      </p>
    </div>
  );
};

/**
 * Render role and status switch.
 * @param {MasterUserCreateFormState} props - Form state
 * @returns {ReactElement} Role and status elements
 */
const _renderRoleAndStatus = (props: MasterUserCreateFormState): ReactElement => {
  const { role, roleOptions, roleOptionsLoading, roleOptionsError, handleRoleChange, isEditMode, isActive, handleStatusChange } = props;

  return (
    <>
      <div className="lg:col-span-2">
        <label htmlFor="role" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
          Role <span className="text-red-600">*</span>
        </label>
        <select id="role" value={role} onChange={handleRoleChange} required disabled={roleOptionsLoading} className={fieldClass}>
          <option value="">{roleOptionsLoading ? "Loading roles…" : "Select role"}</option>
          {roleOptions.map((option) => <option key={option.id} value={option.role}>{option.role}</option>)}
        </select>
        {roleOptionsError !== null && <p role="alert" className="mt-2 text-xs text-red-700">{roleOptionsError}</p>}
      </div>
      {isEditMode && (
        <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-primary">Status</span>
            <span className="text-xs text-text-secondary">Toggle active or inactive status</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={handleStatusChange}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue/30 ${isActive ? "bg-brand-blue" : "bg-brand-gray-light"}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-250 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      )}
    </>
  );
};

/**
 * Render form inputs.
 * @param {MasterUserCreateFormState} props - Form state
 * @returns {ReactElement} Form inputs element
 */
const _renderFormInputs = (props: MasterUserCreateFormState): ReactElement => {
  const { username, email, handleUsernameChange, handleEmailChange, isEditMode, errorMessage } = props;

  return (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
          Username <span className="text-red-600">*</span>
        </label>
        <input id="username" value={username} onChange={handleUsernameChange} required className={fieldClass} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
          Email <span className="text-red-600">*</span>
        </label>
        <input id="email" type="email" value={email} onChange={handleEmailChange} required className={fieldClass} />
      </div>
      {!isEditMode && _renderPassword(props)}
      {_renderRoleAndStatus(props)}
      {errorMessage !== null && <p role="alert" className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700 lg:col-span-2">{errorMessage}</p>}
    </div>
  );
};

/**
 * Render form action button.
 * @param {boolean} isSubmitting - Is submitting state
 * @param {boolean} isEditMode - Is edit mode
 * @returns {ReactElement} Action button element
 */
const _renderFormActions = (isSubmitting: boolean, isEditMode: boolean): ReactElement => {
  let submitLabel = "Create User";

  if (isSubmitting) {
    submitLabel = "Saving…";
  } else if (isEditMode) {
    submitLabel = "Update User";
  }

  return (
    <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto"
      >
        {submitLabel}
      </button>
    </div>
  );
};

/**
 * Render user create/edit form.
 * @param {MasterUserCreateFormState} props - Form state
 * @returns {ReactElement} Component element
 */
export const MasterUserCreateComponent = (props: MasterUserCreateFormState): ReactElement => {
  const { isEditMode, isSubmitting, handleSubmit, goBack } = props;
  const title = isEditMode ? "Edit User" : "New User";
  const subtitle = isEditMode ? "Update the user details below." : "Fill in the user details below.";

  return (
    <Layout pageTitle={title} mobileWhiteBackground={true}>
      <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
        {_renderMobileBack(goBack)}
        <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-0 lg:mt-0 lg:px-0">
          <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
            <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master User</button>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary">{title}</span>
          </nav>
          <div className="my-6 pl-1">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
            <p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">{subtitle}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-brand-gray-light lg:bg-brand-white lg:p-8 lg:shadow-xs">
            {_renderFormInputs(props)}
            {_renderFormActions(isSubmitting, isEditMode)}
          </form>
        </div>
      </div>
    </Layout>
  );
};
