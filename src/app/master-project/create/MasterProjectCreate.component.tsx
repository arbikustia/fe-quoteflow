import * as React from "react";

import type { InputFieldProps, MasterProjectCreateFormState } from "@/modules/master-project/MasterProject.type";

/**
 * Render labelled project form field.
 * @param {InputFieldProps} props - Field properties
 * @returns {React.ReactElement} Field element
 */
const _renderInputField = (props: InputFieldProps): React.ReactElement => {
  const { label, placeholder, value, required, icon, multiline, onChange } = props;
  const fieldClass = "w-full bg-white border border-gray-100 rounded-3xl py-4 pl-12 pr-5 text-[15px] font-semibold text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.02)] outline-none focus:border-[#daeaf3] focus:ring-4 focus:ring-[#daeaf3]/50 transition-all placeholder:text-gray-300";

  return (
    <div className="mb-5">
      <label className="block text-[12px] font-bold text-gray-400 mb-2 pl-3 tracking-widest uppercase">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        {multiline ? (
          <textarea placeholder={placeholder} value={value} required={required} onChange={onChange} rows={3} className={`${fieldClass} resize-none`} />
        ) : (
          <input type="text" placeholder={placeholder} value={value} required={required} onChange={onChange} className={fieldClass} />
        )}
      </div>
    </div>
  );
};

/**
 * Render master project create form.
 * @param {MasterProjectCreateFormState} props - Form state
 * @returns {React.ReactElement} Form element
 */
export const MasterProjectCreateForm = (props: MasterProjectCreateFormState): React.ReactElement => {
  const { name, remark, isSubmitting, errorMessage, successMessage, handleNameChange, handleRemarkChange, handleSubmit, goBack } = props;

  return (
    <div className="flex-1 w-full min-h-full bg-[#f8f9fb] font-sans pb-10 relative overflow-y-auto">
      <div className="px-6 pt-10 pb-4 flex items-center sticky top-0 bg-[#f8f9fb]/90 backdrop-blur-sm z-20">
        <button type="button" onClick={goBack} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a233a] group-hover:bg-gray-50 transition-colors">
            <span aria-hidden="true">‹</span>
          </div>
          <span className="font-bold text-[15px]">Back</span>
        </button>
      </div>
      <div className="px-6 mt-2">
        <div className="mb-8 pl-1">
          <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">New Project</h2>
          <p className="text-[14px] text-gray-500 mt-2 font-medium">Fill in project details below.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          {_renderInputField({ label: "Project Name", placeholder: "e.g. Wedding Gala - Grand Ballroom", value: name, required: true, onChange: handleNameChange, icon: <span aria-hidden="true">▣</span> })}
          {_renderInputField({ label: "Remark", placeholder: "e.g. Full setup including staging", value: remark, multiline: true, onChange: handleRemarkChange, icon: <span aria-hidden="true">▤</span> })}
          {errorMessage && <p role="alert" className="mb-4 text-[13px] font-medium text-red-600">{errorMessage}</p>}
          {successMessage && <p role="status" className="mb-4 text-[13px] font-medium text-green-700">{successMessage}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#1a233a] text-white rounded-full py-4 text-[16px] font-bold tracking-wide shadow-[0_10px_20px_rgba(26,35,58,0.15)] hover:bg-black transition-all mt-2 disabled:opacity-60">{isSubmitting ? "Creating…" : "Create Project"}</button>
        </form>
      </div>
    </div>
  );
};
