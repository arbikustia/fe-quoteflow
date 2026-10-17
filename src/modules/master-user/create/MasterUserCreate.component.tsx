import type { ReactElement } from "react";

import Layout from "@/app/layout";

import type { MasterUserCreateFormState } from "./MasterUserCreate.type";

/** Render mobile back button */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-surface px-6 lg:hidden">
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

/** Render user create/edit form. */
export const MasterUserCreateComponent = (props: MasterUserCreateFormState): ReactElement => {
  const {
    username,
    email,
    password,
    role,
    isActive,
    isEditMode,
    isSubmitting,
    errorMessage,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handleRoleChange,
    handleStatusChange,
    handleSubmit,
    goBack,
  } = props;
  const title = isEditMode ? "Edit User" : "New User";
  const fieldClass = "w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-[15px] text-text-primary outline-none focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30";

  return (
    <Layout pageTitle={title} mobileWhiteBackground={true}>
      <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
        {_renderMobileBack(goBack)}
        <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-6 lg:mt-0 lg:px-0">
          <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
            <button type="button" onClick={goBack} className="cursor-pointer hover:text-text-primary">Master User</button>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary">{title}</span>
          </nav>
          <div className="my-6 pl-1">
            <h2 className="text-4xl font-semibold tracking-tight text-text-primary">{title}</h2>
            <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">
              {isEditMode ? "Update user details below." : "Fill in user details below."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label htmlFor="username" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Username</label>
                <input id="username" value={username} onChange={handleUsernameChange} required className={fieldClass} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Email</label>
                <input id="email" type="email" value={email} onChange={handleEmailChange} className={fieldClass} />
              </div>
              {!isEditMode && (
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Password</label>
                  <input id="password" type="password" value={password} onChange={handlePasswordChange} required className={fieldClass} />
                </div>
              )}
              <div>
                <label htmlFor="role" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Role</label>
                <select id="role" value={role} onChange={handleRoleChange} className={fieldClass}>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              {isEditMode && (
                <div className="flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5 lg:col-span-2">
                  <span className="text-sm font-semibold text-text-primary">Status</span>
                  <button type="button" role="switch" aria-checked={isActive} onClick={handleStatusChange} className={`relative h-6 w-11 rounded-full ${isActive ? "bg-brand-blue" : "bg-brand-gray-light"}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${isActive ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
              )}
              {errorMessage !== null && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 lg:col-span-2">{errorMessage}</p>}
            </div>
            <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Saving…" : isEditMode ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
