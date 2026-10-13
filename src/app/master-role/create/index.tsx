import * as React from "react";

import { useMasterRoleCreateForm } from "@/modules/master-role/MasterRole.hook";
import type { MasterRoleCreateFormState } from "@/modules/master-role/MasterRole.type";

/**
 * Render role create form.
 * @param {MasterRoleCreateFormState} props - Form state
 * @returns {React.ReactElement} Role create form
 */
const _renderForm = (props: MasterRoleCreateFormState): React.ReactElement => {
  const { roleName, isSubmitting, errorMessage, handleRoleNameChange, handleSubmit, goBack } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
      <div className="px-6 pt-10 pb-4 flex items-center sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
        <button type="button" onClick={goBack} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <span className="font-bold text-[15px]">Back</span>
        </button>
      </div>
      <div className="px-6 mt-2">
        <div className="mb-8 pl-1">
          <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">New Role</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="role-name" className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">Role Name</label>
            <input id="role-name" value={roleName} onChange={handleRoleNameChange} required className="w-full bg-white border border-gray-100 rounded-3xl py-4 px-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all" />
          </div>
          {errorMessage !== null && <p role="alert" className="mb-4 text-[13px] font-medium text-red-600">{errorMessage}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#1a233a] text-white rounded-full py-4 text-[16px] font-bold mt-2 disabled:opacity-60">{isSubmitting ? "Creating…" : "Create Role"}</button>
        </form>
      </div>
    </div>
  );
};

/**
 * Render Master Role Create page.
 * @returns {React.ReactElement} Create page
 */
export default function MasterRoleCreate(): React.ReactElement {
  const formState = useMasterRoleCreateForm();

  return _renderForm(formState);
}
