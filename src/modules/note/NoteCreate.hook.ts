import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import type { NoteCard, NoteCreateProps, NoteSubmitContext } from "./Note.type";

import { useCreateNoteMutation, useUpdateNoteMutation } from "@/services/note.service";

/**
 * Extract plain text from editor HTML.
 * @param {string} content - Editor HTML
 * @returns {string} Trimmed text
 */
const _getPlainText = (content: string): string =>
  new DOMParser().parseFromString(content, "text/html").body.textContent?.trim() ?? "";

/**
 * Submit a note mutation and log the result.
 * @param {NoteSubmitContext} context - Submission context
 * @returns {Promise<void>} Submission result
 */
const _submitNote = async (context: NoteSubmitContext): Promise<void> => {
  const plainText = _getPlainText(context.editorContent);

  if (!plainText) {
    context.setErrorMessage("Note content is required.");

    return;
  }

  if (context.isEditMode && !context.id) {
    context.setErrorMessage("Note ID is unavailable.");

    return;
  }

  context.setErrorMessage(null);

  try {
    const response = context.isEditMode && context.id
      ? await context.updateNote({ id: context.id, content: context.editorContent, status: context.isActive ? 1 : 0 }).unwrap()
      : await context.createNote({ content: context.editorContent, status: 1 }).unwrap();

    if (!response.status) {
      context.setErrorMessage(response.messages.join(" ") || "Unable to save note.");

      return;
    }

    const noteTitle = plainText.slice(0, 30);

    if (context.isEditMode) {
      await context.logEdit(noteTitle);
    } else {
      await context.logCreate(noteTitle);
    }

    context.navigate("/note");
  } catch {
    context.setErrorMessage("Unable to save note.");
  }
};

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

  /**
   * Navigate back to the note list.
   * @returns {void} No return value
   */
  const onBack = (): void => { void navigate("/note"); };

  /**
   * Update editor content.
   * @param {string} content - Editor HTML
   * @returns {void} No return value
   */
  const onContentChange = (content: string): void => setEditorContent(content);

  /**
   * Update note active status.
   * @param {boolean} checked - Whether the note is active
   * @returns {void} No return value
   */
  const onStatusChange = (checked: boolean): void => setIsActive(checked);

  /**
   * Submit the note form.
   * @returns {Promise<void>} Submission result
   */
  const onSubmitNote = (): Promise<void> => _submitNote({ id, isEditMode, editorContent, isActive, createNote, updateNote, logCreate, logEdit, navigate, setErrorMessage });

  return { editorContent, isActive, isEditMode, isSubmitting: isCreating || isUpdating, errorMessage, onBack, onContentChange, onStatusChange, onSubmitNote };
};
