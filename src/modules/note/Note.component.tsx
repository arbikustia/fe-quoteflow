import DOMPurify from "dompurify";
import type { MouseEvent, ReactElement } from "react";
import { FiEdit2, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";

import { AlertComponent } from "@/components/Alert";
import ConfirmModal from "@/components/ConfirmModal";
import Modal from "@/components/Modal";

import Layout from "@/app/layout";
import { PageLayout } from "@/app/shared/PageLayout";

import type { NoteCard, NoteProps } from "./Note.type";

/**
 * Stop card click propagation.
 * @param {MouseEvent<HTMLElement>} event - Mouse event
 * @returns {void} No return value
 */
const _stopPropagation = (event: MouseEvent<HTMLElement>): void => event.stopPropagation();

/**
 * Render note actions.
 * @param {NoteCard} note - Note data
 * @param {(note: NoteCard) => void} onEdit - Edit handler
 * @param {(note: NoteCard) => void} onDelete - Delete handler
 * @returns {ReactElement} Note actions
 */
const _renderActions = (note: NoteCard, onEdit: (note: NoteCard) => void, onDelete: (note: NoteCard) => void): ReactElement => (
  <details className="relative z-20" onClick={_stopPropagation}>
    <summary aria-label="More options" className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-text-secondary hover:bg-background-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
      <FiMoreHorizontal className="h-5 w-5" aria-hidden="true" />
    </summary>
    <div role="menu" className="absolute right-0 top-10 z-30 w-36 overflow-hidden rounded-3xl border border-border-default bg-background-surface py-1 shadow-medium">
      <button type="button" role="menuitem" onClick={(): void => onEdit(note)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
        <FiEdit2 className="h-4 w-4" aria-hidden="true" />Edit
      </button>
      <button type="button" role="menuitem" onClick={(): void => onDelete(note)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-danger-strong hover:bg-danger-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-default">
        <FiTrash2 className="h-4 w-4" aria-hidden="true" />Delete
      </button>
    </div>
  </details>
);

/**
 * Render note card.
 * @param {NoteCard} note - Note data
 * @param {(note: NoteCard) => void} onOpen - Open handler
 * @param {(note: NoteCard) => void} onEdit - Edit handler
 * @param {(note: NoteCard) => void} onDelete - Delete handler
 * @returns {ReactElement} Note card
 */
const _renderNoteCard = (note: NoteCard, onOpen: (note: NoteCard) => void, onEdit: (note: NoteCard) => void, onDelete: (note: NoteCard) => void): ReactElement => (
  <article
    key={note.id}
    role="button"
    tabIndex={0}
    onClick={(): void => onOpen(note)}
    onKeyDown={(event): void => {
      if (event.key === "Enter" || event.key === " ") onOpen(note);
    }}
    className="group relative flex h-60 min-w-0 cursor-pointer flex-col overflow-visible rounded-3xl border border-border-default bg-background-surface text-left shadow-xs transition-all duration-200 hover:border-action-primary/60 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:h-[296px] lg:rounded-3xl"
  >
    <div className="relative min-h-0 flex-1 overflow-visible px-4 pb-3 pt-4 lg:px-6 lg:pb-4 lg:pt-5">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-border-default pb-3 text-text-tertiary">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${note.status === 1 ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
            {note.status === 1 ? "Active" : "Inactive"}
          </span>
          <span className="truncate text-xs">{note.updatedAt}</span>
        </div>
        {_renderActions(note, onEdit, onDelete)}
      </div>
      <div className="h-[calc(100%-3rem)] overflow-hidden">
        <div className="text-lg leading-relaxed text-text-secondary [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-text-primary [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-text-primary [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_p]:text-text-secondary [&_strong]:font-semibold [&_strong]:text-text-primary [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 lg:text-xs lg:leading-normal lg:[&_h1]:text-base lg:[&_h2]:text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }} />
      </div>
    </div>
  </article>
);

/**
 * Render note page.
 * @param {NoteProps} props - Note page props
 * @returns {ReactElement} Note page
 */
export const NoteComponent = (props: NoteProps): ReactElement => (
  <Layout pageTitle="Note">
    <PageLayout
      title="Note"
      subtitle="Create and manage notes for quick operational reference."
      mobileHeaderClassName="px-0"
      mobileTitleClassName="text-4xl"
      showBackButton={false}
    >
      <div className="relative mb-8 flex flex-col rounded-3xl border border-border-default bg-background-surface p-5 shadow-medium sm:p-6 lg:mb-10 lg:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5">
          <button
            type="button"
            onClick={props.onCreateNote}
            className="group flex h-60 min-w-0 cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border-strong bg-background-surface p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-action-primary hover:bg-action-primary-subtle/15 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:h-[296px] lg:rounded-3xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-action-primary-subtle text-action-primary transition-all duration-200 group-hover:scale-110 group-hover:bg-action-primary group-hover:text-white lg:h-14 lg:w-14">
              <FiPlus className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-bold text-text-primary transition-colors group-hover:text-action-primary lg:text-base">
                New note
              </span>
              <span className="hidden text-xs text-text-tertiary lg:inline">
                Create a quick note
              </span>
            </div>
          </button>
          {props.notes.map((note): ReactElement => _renderNoteCard(note, props.onOpenNote, props.onEditNote, props.onDeleteNote))}
        </div>
      </div>
    </PageLayout>
    {props.errorMessage && <AlertComponent type="error" message={props.errorMessage} toast closable />}
    <Modal
      isOpen={Boolean(props.selectedNote)}
      onClose={props.onCloseNote}
      title={
        props.selectedNote && (
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${props.selectedNote.status === 1 ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong"}`}>
              {props.selectedNote.status === 1 ? "Active" : "Inactive"}
            </span>
            <span className="text-sm font-normal text-text-tertiary">{props.selectedNote.updatedAt}</span>
          </div>
        )
      }
      maxWidth="max-w-4xl"
      dialogClassName="h-[80dvh] lg:h-[80vh]"
      contentClassName="min-h-0 flex-1 p-5 sm:p-6"
    >
      {props.selectedNote && (
        <div
          className="max-w-none break-words text-sm leading-relaxed text-text-primary [&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 lg:text-base lg:[&_h1]:text-2xl lg:[&_h2]:text-xl lg:[&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.selectedNote.content) }}
        />
      )}
    </Modal>
    <ConfirmModal
      isOpen={Boolean(props.deletingNote)}
      onClose={props.onCancelDelete}
      onConfirm={props.onConfirmDelete}
      title="Delete note?"
      message="This note will be permanently deleted. This action cannot be undone."
      confirmText={props.isDeleting ? "Deleting…" : "Delete note"}
    />
  </Layout>
);

export default NoteComponent;
