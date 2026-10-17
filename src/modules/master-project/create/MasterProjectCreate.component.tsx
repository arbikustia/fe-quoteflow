import * as React from "react";

import Layout from "@/app/layout";
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
  const { name, remark, isActive, isSubmitting, errorMessage, successMessage, handleNameChange, handleRemarkChange, toggleStatus, handleSubmit, goBack } = props;

  return (
    <Layout mobileWhiteBackground={true}>
      <div className="flex h-full min-h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
        <div className="sticky top-0 z-20 flex items-center bg-background-surface px-6 lg:hidden">
          <button type="button" onClick={goBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
        </div>
        <div className="mt-2 px-6 lg:px-0">
          <div className="mb-8 pl-1">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">New Project</h2>
            <p className="mt-3 text-sm font-medium text-text-secondary opacity-70">Fill in project details below.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col lg:rounded-4xl lg:border lg:border-border-default lg:bg-background-surface lg:p-8 lg:shadow-xs">
            {_renderInputField({ label: "Project Name", placeholder: "e.g. Wedding Gala - Grand Ballroom", value: name, required: true, onChange: handleNameChange, icon: <span aria-hidden="true">▣</span> })}
            {_renderInputField({ label: "Remark", placeholder: "e.g. Full setup including staging", value: remark, multiline: true, onChange: handleRemarkChange, icon: <span aria-hidden="true">▤</span> })}
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-border-default bg-background-surface p-4">
              <span className="text-sm font-semibold text-text-primary">Active</span>
              <button type="button" role="switch" aria-checked={isActive} onClick={toggleStatus} className={`relative h-7 w-12 rounded-full transition-colors ${isActive ? "bg-action-primary" : "bg-neutral-300"}`}>
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            {errorMessage && <p role="alert" className="mb-4 text-xs font-medium text-feedback-error">{errorMessage}</p>}
            {successMessage && <p role="status" className="mb-4 text-xs font-medium text-feedback-success">{successMessage}</p>}
            <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
              <button type="submit" disabled={isSubmitting} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-sm font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:opacity-60 sm:w-auto">
                {isSubmitting ? "Creating…" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
