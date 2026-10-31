import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetNotesQuery } from "@/services/note.service";

import type { NoteApiRecord, NoteCard, NoteProps } from "./Note.type";

const _mapNote = (note: NoteApiRecord): NoteCard => ({
  id: note.id,
  content: note.content,
  updatedAt: new Date(note.updated_at || note.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
});

/**
 * Manage note page state.
 * @returns {NoteProps} Note page state
 */
export const useNote = (): NoteProps => {
  const navigate = useNavigate();
  const { data } = useGetNotesQuery();
  const notes = useMemo(() => data?.status && data.data ? data.data.map(_mapNote) : [], [data]);
  const [selectedNote, setSelectedNote] = useState<NoteCard | null>(null);
  const onCreateNote = (): void => { void navigate("/note/create"); };
  const onOpenNote = (note: NoteCard): void => { setSelectedNote(note); };
  const onCloseNote = (): void => { setSelectedNote(null); };

  return { notes, selectedNote, onCreateNote, onOpenNote, onCloseNote };
};
