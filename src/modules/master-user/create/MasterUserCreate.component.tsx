/* eslint-disable jsdoc/require-returns, jsdoc/require-param-type, jsdoc/require-param-description */
import type { ReactElement } from "react";

import { useMasterUserCreateForm } from "./MasterUserCreate.hook";

/**
 * Render user create/edit form.
 * @param props
 */
export const MasterUserCreateComponent = (props: ReturnType<typeof useMasterUserCreateForm>): ReactElement => {
  const { username, password, role, isEdit, handleUsernameChange, handlePasswordChange, handleRoleChange, handleSubmit, goBack } = props;
  const submitLabel = isEdit ? "Update User" : "Create User";

  return (
    <div className="min-h-full w-full overflow-y-auto bg-background-page pb-10">
      <div className="sticky top-0 z-20 flex items-center bg-background-page px-6 pb-4 pt-10"><button type="button" onClick={goBack} className="flex items-center gap-3 text-text-secondary hover:text-text-primary"><span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-background-surface">←</span><span className="font-medium">Back</span></button></div>
      <div className="px-6"><h1 className="mb-2 text-2xl font-semibold text-text-primary">{isEdit ? "Edit User" : "New User"}</h1><p className="mb-8 text-sm text-text-secondary">Fill in user details.</p>
        <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
          <div><label htmlFor="username" className="mb-2 block text-sm font-medium text-text-secondary">Username</label><input id="username" value={username} onChange={handleUsernameChange} required className="h-11 w-full rounded-lg border border-border-strong bg-background-surface px-4 text-text-primary" /></div>
          {!isEdit && <div><label htmlFor="password" className="mb-2 block text-sm font-medium text-text-secondary">Password</label><input id="password" type="password" value={password} onChange={handlePasswordChange} required className="h-11 w-full rounded-lg border border-border-strong bg-background-surface px-4 text-text-primary" /></div>}
          <div><label htmlFor="role" className="mb-2 block text-sm font-medium text-text-secondary">Role</label><select id="role" value={role} onChange={handleRoleChange} className="h-11 w-full rounded-lg border border-border-strong bg-background-surface px-4 text-text-primary"><option value="Admin">Admin</option><option value="User">User</option></select></div>
          <button type="submit" className="h-11 rounded-lg bg-action-primary px-5 font-medium text-text-inverse hover:bg-action-primary-hover">{submitLabel}</button>
        </form>
      </div>
    </div>
  );
};
