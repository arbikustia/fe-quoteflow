import DOMPurify from "dompurify";
import type { ReactElement } from "react";
import { FiPlus } from "react-icons/fi";

import Modal from "@/components/Modal";

import Layout from "@/app/layout";

import type { NoteCard, NoteProps } from "./Note.type";

/**
 * Render note card.
 * @param {NoteCard} note - Note data
 * @returns {ReactElement} Note card
 */
const _renderNoteCard = (note: NoteCard, onOpen: (note: NoteCard) => void): ReactElement => (
  <article role="button" tabIndex={0} onClick={(): void => onOpen(note)} onKeyDown={(event): void => { if (event.key === "Enter" || event.key === " ") onOpen(note); }} className="relative flex h-48 min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-border-default bg-background-surface shadow-xs lg:h-[296px] lg:rounded-[14px]">
    <div className="relative min-h-0 flex-1 overflow-hidden px-3 pb-2 pt-3 lg:px-6 lg:pb-3 lg:pt-5">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-background-surface via-background-surface/90 to-transparent" aria-hidden="true" />
      <div className="relative z-0 text-xs leading-4 text-text-primary [&_h1]:mb-3 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:leading-6 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:leading-6 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }} />
    </div>
    <footer className="flex h-10 shrink-0 items-center border-t border-border-default/60 bg-background-subtle px-3 text-xs text-text-tertiary lg:h-[52px] lg:px-6 lg:text-sm">
      <span>{note.updatedAt}</span>
    </footer>
  </article>
);

/**
 * Render note page.
 * @param {NoteProps} props - Note page props
 * @returns {ReactElement} Note page
 */
export const NoteComponent = (props: NoteProps): ReactElement => (
  <Layout pageTitle="Note">
    <main className="flex flex-col text-text-primary">
      <h1 className="mb-6 shrink-0 text-3xl font-semibold tracking-tight text-text-primary lg:text-4xl">Note</h1>
      <div className="rounded-2xl bg-background-surface p-3 lg:p-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <button type="button" onClick={props.onCreateNote} className="grid h-48 min-w-0 cursor-pointer place-items-center rounded-xl border border-dashed border-border-strong bg-background-surface text-text-secondary transition-colors hover:border-action-primary hover:text-action-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:h-[296px] lg:rounded-[14px]"><span className="flex flex-col items-center gap-2 text-sm lg:flex-row lg:gap-3 lg:text-base"><FiPlus className="h-4 w-4" aria-hidden="true" /><span>New note</span></span></button>
          {props.notes.map((note): ReactElement => _renderNoteCard(note, props.onOpenNote))}
        </div>
      </div>
    </main>
    <Modal isOpen={Boolean(props.selectedNote)} onClose={props.onCloseNote} title="Note" maxWidth="max-w-4xl" dialogClassName="h-[80dvh] lg:h-[80vh]" contentClassName="min-h-0 flex-1 p-5 sm:p-6">
      {props.selectedNote && <div className="max-w-none break-words text-sm leading-relaxed text-text-primary [&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 lg:text-base lg:[&_h1]:text-2xl lg:[&_h2]:text-xl lg:[&_ul]:pl-6" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.selectedNote.content) }} />}
    </Modal>
  </Layout>
);

export default NoteComponent;
