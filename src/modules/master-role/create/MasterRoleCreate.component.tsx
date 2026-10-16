import type { ReactElement } from "react";

import type { MasterRoleCreateFormState } from "../MasterRole.type";

/**
 * Render mobile back navigation.
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Back navigation
 */
const _renderMobileBack = (goBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center bg-background-page/90 px-6 pt-6 lg:px-0 lg:pt-0">
    <button type="button" onClick={goBack} className="group flex items-center gap-3 text-text-secondary transition-colors hover:text-text-primary lg:hidden">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-surface text-text-primary shadow-sm transition-colors group-hover:bg-background-subtle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
      </div>
      <span className="text-[15px] font-bold">Back</span>
    </button>
  </div>
);

/**
 * Render role form header.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {() => void} goBack - Back action
 * @returns {ReactElement} Form header
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
      <div className="my-6 pl-1">
        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">{title}</h2>
        <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">{isEditMode ? "Update the role details below." : "Fill in the role details below."}</p>
      </div>
    </>
  );
};

/**
 * Render master role create or edit form.
 * @param {MasterRoleCreateFormState} props - Form state
 * @returns {ReactElement} Role form
 */
export const MasterRoleCreateComponent = (props: MasterRoleCreateFormState): ReactElement => {
  const { roleName, isActive, isEditMode, isSubmitting, errorMessage, handleRoleNameChange, handleStatusChange, handleSubmit, goBack } = props;
  const buttonText = isEditMode ? "Update Role" : "Create Role";
  const submittingText = isEditMode ? "Updating…" : "Creating…";

  return (
    <div className="flex h-full w-full flex-col bg-background-page pb-6 font-sans">
      {_renderMobileBack(goBack)}
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col px-6 lg:mt-0 lg:px-0">
        {_renderHeader(isEditMode, goBack)}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between rounded-4xl border border-border-default bg-background-surface p-6 shadow-xs sm:p-8">
          <div>
            <label htmlFor="role-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">Role Name</label>
            <input id="role-name" value={roleName} onChange={handleRoleNameChange} placeholder="e.g. Administrator" required className="w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-[15px] font-normal text-text-primary shadow-xs outline-none transition-all placeholder:font-normal placeholder:text-text-tertiary/60 focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30" />
            {isEditMode && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Status</p>
                  <p className="text-xs text-text-secondary">Toggle active or inactive status</p>
                </div>
                <button type="button" role="switch" aria-checked={isActive} onClick={handleStatusChange} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/30 ${isActive ? "bg-brand-blue" : "bg-brand-gray-light"}`}>
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${isActive ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            )}
            {errorMessage !== null && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">{errorMessage}</p>}
          </div>
          <div className="mt-6 flex justify-end border-t border-border-default pt-5">
            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60">{isSubmitting ? submittingText : buttonText}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
