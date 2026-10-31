import type { ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { RichTextEditor } from "@/components/RichTextEditor";

import Layout from "@/app/layout";

import type { NoteCreateProps } from "./Note.type";

const _renderMobileBack = (onBack: () => void): ReactElement => (
  <div className="sticky top-0 z-20 flex items-center gap-3 bg-background-surface px-0 lg:hidden">
    <button type="button" onClick={onBack} aria-label="Back" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-default bg-background-surface text-text-primary transition-colors hover:bg-background-subtle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    </button>
    <h2 className="min-w-0 truncate text-4xl font-semibold leading-tight text-text-primary">New Note</h2>
  </div>
);

const _renderHeader = (onBack: () => void): ReactElement => (
  <>
    <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-2 text-sm font-medium text-text-secondary lg:flex">
      <button type="button" onClick={onBack} className="cursor-pointer hover:text-text-primary">Note</button>
      <span aria-hidden="true">/</span><span className="text-text-primary">New Note</span>
    </nav>
    <div className="my-6 hidden pl-1 lg:block"><h2 className="text-4xl font-semibold leading-tight tracking-tight text-text-primary">New Note</h2><p className="mt-3 text-[14px] font-medium text-text-secondary opacity-70">Write details for your new note below.</p></div>
  </>
);

/**
 * Render note create page.
 * @param {NoteCreateProps} props - Create page props
 * @returns {ReactElement} Note create page
 */
export const NoteCreateComponent = (props: NoteCreateProps): ReactElement => (
  <Layout pageTitle="New Note" mobileWhiteBackground={true}>
    <div className="flex h-full w-full flex-col bg-background-surface pb-6 font-sans lg:bg-background-page">
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      {_renderMobileBack(props.onBack)}
      <div className="mt-10 flex min-h-0 w-full flex-1 flex-col px-0 text-lg lg:mt-0 lg:text-base">
        {_renderHeader(props.onBack)}
        <form noValidate onSubmit={(event): void => { event.preventDefault(); props.onSubmitNote(); }} className="flex min-h-0 flex-1 flex-col justify-between border-0 bg-transparent p-0 shadow-none lg:rounded-4xl lg:border lg:border-brand-gray-light lg:bg-brand-white lg:p-8 lg:shadow-xs">
          <div>
            <label htmlFor="note-content" className="mb-2 block text-base font-semibold text-text-primary lg:text-sm">Content</label>
            <div id="note-content"><RichTextEditor value={props.editorContent} onChange={props.onContentChange} placeholder="Write your note..." /></div>
          </div>
          <div className="mt-8 flex justify-end border-t border-border-default/60 pt-5 lg:mt-6 lg:border-border-default">
            <button type="submit" disabled={props.isCreating} className="h-14 w-full cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto lg:text-sm">{props.isCreating ? "Saving…" : "Create Note"}</button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
);

export default NoteCreateComponent;
