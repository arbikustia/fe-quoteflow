import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import type { DeleteNoteContext, NoteApiRecord, NoteCard, NoteProps } from "./Note.type";

import { useDeleteNoteMutation, useGetNotesQuery } from "@/services/note.service";

/**
 * Map an API note to a note card.
 * @param {NoteApiRecord} note - API note
 * @returns {NoteCard} Note card
 */
const _mapNote = (note: NoteApiRecord): NoteCard => ({
  id: note.id,
  content: note.content,
  status: note.status,
  updatedAt: new Date(note.updated_at || note.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
});

/**
 * Delete the selected note.
 * @param {DeleteNoteContext} context - Deletion context
 * @returns {Promise<void>} Delete result
 */
const _deleteSelectedNote = async (context: DeleteNoteContext): Promise<void> => {
  const { note, deleteNote, logDelete, setDeletingNote, setErrorMessage } = context;

  if (!note) return;

  setErrorMessage(null);

  try {
    const response = await deleteNote({ id: note.id }).unwrap();

    if (!response.status) {
      setErrorMessage(response.messages.join(" ") || "Unable to delete note.");

      return;
    }

    await logDelete(note.content.slice(0, 30));
    setDeletingNote(null);
  } catch {
    setErrorMessage("Unable to delete note.");
  }
};

/**
 * Manage note page state.
 * @returns {NoteProps} Note page state
 */
export const useNote = (): NoteProps => {
  const navigate = useNavigate();
  const { data } = useGetNotesQuery();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const { logView, logDelete } = useMasterActivityLog("Note");
  const [selectedNote, setSelectedNote] = useState<NoteCard | null>(null);
  const [deletingNote, setDeletingNote] = useState<NoteCard | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const notes = useMemo(() => data?.status && data.data ? data.data.map(_mapNote) : [], [data]);

  useEffect(() => {
    void logView();
  }, [logView]);

  /**
   * Navigate to the home page.
   * @returns {void} No return value
   */
  const onBack = (): void => { void navigate("/home"); };

  /**
   * Navigate to the note creation page.
   * @returns {void} No return value
   */
  const onCreateNote = (): void => { void navigate("/note/create"); };

  /**
   * Open the selected note.
   * @param {NoteCard} note - Note to open
   * @returns {void} No return value
   */
  const onOpenNote = (note: NoteCard): void => { setSelectedNote(note); };

  /**
   * Close the selected note.
   * @returns {void} No return value
   */
  const onCloseNote = (): void => { setSelectedNote(null); };

  /**
   * Navigate to edit the selected note.
   * @param {NoteCard} note - Note to edit
   * @returns {void} No return value
   */
  const onEditNote = (note: NoteCard): void => { void navigate(`/note/edit/${note.id}`, { state: { note } }); };

  /**
   * Select a note for deletion.
   * @param {NoteCard} note - Note to delete
   * @returns {void} No return value
   */
  const onDeleteNote = (note: NoteCard): void => { setDeletingNote(note); };

  /**
   * Cancel note deletion.
   * @returns {void} No return value
   */
  const onCancelDelete = (): void => { setDeletingNote(null); };

  /**
   * Confirm deletion of the selected note.
   * @returns {Promise<void>} Delete result
   */
  const onConfirmDelete = (): Promise<void> => _deleteSelectedNote({ note: deletingNote, deleteNote, logDelete, setDeletingNote, setErrorMessage });

  return { notes, selectedNote, deletingNote, isDeleting, errorMessage, onBack, onCreateNote, onOpenNote, onCloseNote, onEditNote, onDeleteNote, onCancelDelete, onConfirmDelete };
};
