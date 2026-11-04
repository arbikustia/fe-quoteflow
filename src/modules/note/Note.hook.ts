import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import { useDeleteNoteMutation, useGetNotesQuery } from "@/services/note.service";

import type { NoteApiRecord, NoteCard, NoteProps } from "./Note.type";

/**
 * Map API note to note card.
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
 * Manage note page state.
 * @returns {NoteProps} Note page state
 */
export const useNote = (): NoteProps => {
  const navigate = useNavigate();
  const { data } = useGetNotesQuery();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const { logView, logDelete } = useMasterActivityLog("Note");

  useEffect(() => {
    let active = true;
    void logView().then(() => {
      if (!active) return;
    });

    return () => {
      active = false;
    };
  }, [logView]);

  const notes = useMemo(() => data?.status && data.data ? data.data.map(_mapNote) : [], [data]);
  const [selectedNote, setSelectedNote] = useState<NoteCard | null>(null);
  const [deletingNote, setDeletingNote] = useState<NoteCard | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onBack = (): void => { void navigate("/home"); };
  const onCreateNote = (): void => { void navigate("/note/create"); };
  const onOpenNote = (note: NoteCard): void => { setSelectedNote(note); };
  const onCloseNote = (): void => { setSelectedNote(null); };
  const onEditNote = (note: NoteCard): void => { void navigate(`/note/edit/${note.id}`, { state: { note } }); };
  const onDeleteNote = (note: NoteCard): void => { setDeletingNote(note); };
  const onCancelDelete = (): void => { setDeletingNote(null); };
  const onConfirmDelete = async (): Promise<void> => {
    if (!deletingNote) return;

    setErrorMessage(null);
    try {
      const response = await deleteNote({ id: deletingNote.id }).unwrap();
      if (!response.status) {
        setErrorMessage(response.messages.join(" ") || "Unable to delete note.");
        return;
      }
      await logDelete(deletingNote.content.slice(0, 30));
      setDeletingNote(null);
    } catch {
      setErrorMessage("Unable to delete note.");
    }
  };

  return { notes, selectedNote, deletingNote, isDeleting, errorMessage, onBack, onCreateNote, onOpenNote, onCloseNote, onEditNote, onDeleteNote, onCancelDelete, onConfirmDelete };
};
