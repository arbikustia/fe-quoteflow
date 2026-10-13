import * as React from "react";

import { useMasterCategoryCreate } from "@/modules/master-category/MasterCategory.hook";
import type { InputFieldProps, MasterCategoryCreateFormState } from "@/modules/master-category/MasterCategory.type";

/**
 * Render category input field.
 * @param {InputFieldProps} props - Field props
 * @returns {React.ReactElement} Input field
 */
const _renderInputField = (props: InputFieldProps): React.ReactElement => {
  const { label, icon, value, required, placeholder, onChange } = props;

  return (
    <div className="mb-5">
      <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input value={value} required={required} placeholder={placeholder} onChange={onChange} className="w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all" />
      </div>
    </div>
  );
};

/**
 * Render MasterCategoryCreate form.
 * @param {MasterCategoryCreateFormState} props - Form props
 * @returns {React.ReactElement} Create form
 */
const _renderCreateForm = (props: MasterCategoryCreateFormState): React.ReactElement => {
  const { name, isSubmitting, errorMessage, successMessage, handleNameChange, handleSubmit, goBack } = props;

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
          <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">New Category</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {_renderInputField({ label: "Category Name", value: name, placeholder: "e.g. Audio System", required: true, onChange: handleNameChange, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 9h16"></path><path d="M4 15h16"></path><path d="M10 3L8 21"></path><path d="M16 3l-2 18"></path></svg> })}
          {errorMessage && <p role="alert" className="mb-4 text-[13px] font-medium text-red-600">{errorMessage}</p>}
          {successMessage && <p role="status" className="mb-4 text-[13px] font-medium text-green-700">{successMessage}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#1a233a] text-white rounded-full py-4 text-[16px] font-bold mt-2 disabled:opacity-60">{isSubmitting ? "Creating…" : "Create Category"}</button>
        </form>
      </div>
    </div>
  );
};

/**
 * Render Master Category Create page.
 * @returns {React.ReactElement} Create page
 */
export default function MasterCategoryCreate(): React.ReactElement {
  const formState = useMasterCategoryCreate();

  return _renderCreateForm(formState);
}
