import type { ReactElement } from "react";

import Layout from "@/app/layout";

import type { MasterUserCreateFormState } from "./MasterUserCreate.type";

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
    <Layout pageTitle={title}>
      <div className="flex h-full w-full flex-col bg-background-page px-6 pb-6 font-sans lg:px-0">
        <button type="button" onClick={goBack} className="mb-5 flex items-center gap-3 text-text-secondary lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-background-surface">←</span><span className="font-bold">Back</span></button>
        <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex"><button type="button" onClick={goBack}>Master User</button><span>/</span><span className="text-text-primary">{title}</span></nav>
        <div className="my-6 pl-1"><h2 className="text-4xl font-semibold tracking-tight text-text-primary">{title}</h2><p className="mt-3 text-sm font-medium text-text-secondary">Fill in user details below.</p></div>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between rounded-4xl border border-border-default bg-background-surface p-6 shadow-xs sm:p-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <div><label htmlFor="username" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Username</label><input id="username" value={username} onChange={handleUsernameChange} required className={fieldClass} /></div>
            <div><label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Email</label><input id="email" type="email" value={email} onChange={handleEmailChange} className={fieldClass} /></div>
            {!isEditMode && <div><label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Password</label><input id="password" type="password" value={password} onChange={handlePasswordChange} required className={fieldClass} /></div>}
            <div><label htmlFor="role" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Role</label><select id="role" value={role} onChange={handleRoleChange} className={fieldClass}><option value="Admin">Admin</option><option value="User">User</option></select></div>
            {isEditMode && <div className="flex items-center justify-between rounded-xl border border-border-default px-4 py-3"><span className="text-sm font-semibold text-text-primary">Status</span><button type="button" role="switch" aria-checked={isActive} onClick={handleStatusChange} className={`relative h-6 w-11 rounded-full ${isActive ? "bg-brand-blue" : "bg-brand-gray-light"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${isActive ? "left-5" : "left-0.5"}`} /></button></div>}
            {errorMessage !== null && <p role="alert" className="lg:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
          </div>
          <div className="mt-6 flex justify-end border-t border-border-default pt-5"><button type="submit" disabled={isSubmitting} className="h-14 rounded-xl bg-action-primary px-8 text-sm font-semibold text-text-inverse disabled:opacity-60">{isSubmitting ? "Saving…" : isEditMode ? "Update User" : "Create User"}</button></div>
        </form>
      </div>
    </Layout>
  );
};
