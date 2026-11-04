import type { ReactElement } from "react";

import { AlertComponent } from "@/components/Alert";
import { RichTextEditor } from "@/components/RichTextEditor";
import { SwitchComponent } from "@/components/Switch";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { NoteCreateProps } from "./Note.type";

/**
 * Get note submit button text.
 * @param {NoteCreateProps} props - Create page props
 * @returns {string} Submit button text
 */
const _getSubmitText = (props: NoteCreateProps): string => {
  if (props.isSubmitting) return "Saving…";

  return props.isEditMode ? "Update Note" : "Create Note";
};

/**
 * Render note create page.
 * @param {NoteCreateProps} props - Create page props
 * @returns {ReactElement} Note create page
 */
export const NoteCreateComponent = (props: NoteCreateProps): ReactElement => {
  const title = props.isEditMode ? "Edit Note" : "New Note";
  const subtitle = props.isEditMode ? "Update note details below." : "Write details for your new note below.";

  return (
    <Layout pageTitle={title}>
      {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
      <PageLayout
        title={title}
        subtitle={subtitle}
        mobileHeaderClassName="px-0"
        mobileTitleClassName="text-4xl"
        onBack={props.onBack}
      >
        <form
          noValidate
          onSubmit={(event): void => {
            event.preventDefault();
            props.onSubmitNote();
          }}
          className="flex min-h-0 flex-1 flex-col justify-between rounded-3xl border border-border-default bg-background-surface p-6 shadow-medium lg:p-8"
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="note-content" className="mb-3 block text-xl font-semibold text-text-primary lg:text-lg">Content</label>
              <div id="note-content"><RichTextEditor value={props.editorContent} onChange={props.onContentChange} placeholder="Write your note..." /></div>
            </div>
            {props.isEditMode && (
              <div className="flex items-center justify-between rounded-3xl border border-border-default bg-background-surface px-5 py-4">
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-text-primary lg:text-lg">Status</span>
                  <span className="text-lg text-text-secondary lg:text-base">Toggle active or inactive status</span>
                </div>
                <SwitchComponent label="Note status" checked={props.isActive} onChange={props.onStatusChange} />
              </div>
            )}
          </div>
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border-default pt-6">
            <button
              type="button"
              onClick={props.onBack}
              disabled={props.isSubmitting}
              className="h-14 flex-1 cursor-pointer rounded-3xl border border-border-default bg-background-surface px-6 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-60 sm:flex-initial sm:px-8"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={props.isSubmitting}
              className="h-14 flex-1 cursor-pointer rounded-3xl bg-action-primary px-6 text-lg font-semibold tracking-wide text-text-inverse shadow-xs transition-all hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:flex-initial sm:px-8"
            >
              {_getSubmitText(props)}
            </button>
          </div>
        </form>
      </PageLayout>
    </Layout>
  );
};

export default NoteCreateComponent;
