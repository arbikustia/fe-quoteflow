import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateNoteMutation } from "@/services/note.service";

import type { NoteCreateProps } from "./Note.type";

/**
 * Manage note create page state.
 * @returns {NoteCreateProps} Note create state
 */
export const useNoteCreate = (): NoteCreateProps => {
  const navigate = useNavigate();
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [editorContent, setEditorContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onBack = (): void => { void navigate("/note"); };
  const onContentChange = (content: string): void => setEditorContent(content);

  const onSubmitNote = async (): Promise<void> => {
    const plainText = new DOMParser().parseFromString(editorContent, "text/html").body.textContent?.trim();

    if (!plainText) {
      setErrorMessage("Note content is required.");
      return;
    }

    setErrorMessage(null);
    try {
      const response = await createNote({ content: editorContent, status: 1 }).unwrap();
      if (!response.status) {
        setErrorMessage(response.messages.join(" ") || "Unable to save note.");
        return;
      }
      void navigate("/note");
    } catch {
      setErrorMessage("Unable to save note.");
    }
  };

  return { editorContent, isCreating, errorMessage, onBack, onContentChange, onSubmitNote };
};
