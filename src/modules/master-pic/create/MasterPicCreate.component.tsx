import type { ReactElement } from "react";

import type { MasterPicCreateState } from "./MasterPicCreate.type";

/**
 * Render PIC form.
 * @param {MasterPicCreateState} props - Form state
 * @returns {ReactElement} Form
 */
export const MasterPicCreateForm = (props: MasterPicCreateState): ReactElement => {
  const { name, isEdit, handleNameChange, handleSubmit, goBack } = props;

  return (
    <div className="w-full min-h-full bg-background-surface px-6 pb-10 pt-10">
      <button type="button" onClick={goBack} className="mb-8 flex items-center gap-3 text-text-secondary hover:text-text-primary">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background-subtle">←</span>
        <span className="font-bold text-sm">Back</span>
      </button>
      <h2 className="text-2xl font-extrabold tracking-tight">{isEdit ? "Edit PIC" : "New PIC"}</h2>
      <p className="mb-8 mt-2 text-sm font-medium text-text-secondary">Fill in PIC details below.</p>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-2 pl-3 text-xs font-bold uppercase tracking-widest text-text-secondary" htmlFor="pic-name">PIC Name</label>
        <input id="pic-name" type="text" required value={name} onChange={handleNameChange} className="mb-5 w-full rounded-3xl border border-border-default bg-background-subtle px-5 py-4 text-sm font-semibold text-text-primary outline-none focus:ring-2 focus:ring-action-primary" />
        <button type="submit" className="mt-2 w-full rounded-full bg-action-primary py-4 text-base font-bold tracking-wide text-text-inverse shadow-medium hover:bg-action-primary-hover">{isEdit ? "Update PIC" : "Create PIC"}</button>
      </form>
    </div>
  );
};
