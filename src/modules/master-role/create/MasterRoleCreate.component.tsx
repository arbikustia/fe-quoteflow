import type { ReactElement } from "react";

import type { MasterRoleCreateFormState } from "../MasterRole.type";

/**
 * Render role create form.
 * @param {MasterRoleCreateFormState} props - Form state
 * @returns {ReactElement} Role create form
 */
export const MasterRoleCreateComponent = (props: MasterRoleCreateFormState): ReactElement => {
  const { roleName, isSubmitting, errorMessage, handleRoleNameChange, handleSubmit, goBack } = props;

  return (
    <div className="min-h-full w-full overflow-y-auto bg-background-page pb-10">
      <div className="sticky top-0 z-20 flex items-center bg-background-page px-6 pb-4 pt-10">
        <button type="button" onClick={goBack} className="flex items-center gap-3 text-text-secondary hover:text-text-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-background-surface">←</span>
          <span className="font-medium">Back</span>
        </button>
      </div>
      <div className="px-6">
        <h1 className="mb-8 text-2xl font-semibold text-text-primary">New role</h1>
        <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
          <div>
            <label htmlFor="role-name" className="mb-2 block text-sm font-medium text-text-secondary">Role name</label>
            <input id="role-name" value={roleName} onChange={handleRoleNameChange} required className="h-11 w-full rounded-lg border border-border-strong bg-background-surface px-4 text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-focus-ring/30" />
          </div>
          {errorMessage !== null && <p role="alert" className="text-sm text-red-600">{errorMessage}</p>}
          <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="h-11 rounded-lg bg-action-primary px-5 font-medium text-text-inverse hover:bg-action-primary-hover disabled:opacity-60">{isSubmitting ? "Creating…" : "Create role"}</button>
        </form>
      </div>
    </div>
  );
};
