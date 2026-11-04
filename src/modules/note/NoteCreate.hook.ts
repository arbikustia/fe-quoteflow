import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import { useCreateNoteMutation, useUpdateNoteMutation } from "@/services/note.service";

import type { NoteCard, NoteCreateProps } from "./Note.type";

/**
 * Manage note create page state.
 * @returns {NoteCreateProps} Note create state
 */
export const useNoteCreate = (): NoteCreateProps => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const routeNote: NoteCard | undefined = location.state?.note;
  const isEditMode = Boolean(id);
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const { logCreate, logEdit } = useMasterActivityLog("Note");
  const [editorContent, setEditorContent] = useState(routeNote?.content ?? "");
  const [isActive, setIsActive] = useState(routeNote ? routeNote.status === 1 : true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onBack = (): void => { void navigate("/note"); };
  const onContentChange = (content: string): void => setEditorContent(content);
  const onStatusChange = (checked: boolean): void => setIsActive(checked);

  const onSubmitNote = async (): Promise<void> => {
    const plainText = new DOMParser().parseFromString(editorContent, "text/html").body.textContent?.trim();

    if (!plainText) {
      setErrorMessage("Note content is required.");
      return;
    }

    if (isEditMode && !id) {
      setErrorMessage("Note ID is unavailable.");
      return;
    }

    setErrorMessage(null);
    try {
      const response = isEditMode && id
        ? await updateNote({ id, content: editorContent, status: isActive ? 1 : 0 }).unwrap()
        : await createNote({ content: editorContent, status: 1 }).unwrap();
      if (!response.status) {
        setErrorMessage(response.messages.join(" ") || "Unable to save note.");
        return;
      }
      const noteTitle = plainText.slice(0, 30);
      if (isEditMode) {
        await logEdit(noteTitle);
      } else {
        await logCreate(noteTitle);
      }
      void navigate("/note");
    } catch {
      setErrorMessage("Unable to save note.");
    }
  };

  return { editorContent, isActive, isEditMode, isSubmitting: isCreating || isUpdating, errorMessage, onBack, onContentChange, onStatusChange, onSubmitNote };
};
