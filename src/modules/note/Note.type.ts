export type NoteApiRecord = {
  id: string;
  content: string;
  status: number;
  created_at: string;
  updated_at: string;
};

export type NoteCard = {
  id: string;
  content: string;
  status: number;
  updatedAt: string;
};

export type NoteCreatePayload = {
  content: string;
  status: number;
};

export type NoteUpdatePayload = NoteCreatePayload & {
  id: string;
};

export type NoteDeletePayload = {
  id: string;
};

export type NoteResponse = {
  status: boolean;
  data: NoteApiRecord | null;
  messages: string[];
};

export type NoteListResponse = {
  status: boolean;
  data: NoteApiRecord[];
  messages: string[];
};

export type NoteProps = {
  notes: NoteCard[];
  selectedNote: NoteCard | null;
  deletingNote: NoteCard | null;
  isDeleting: boolean;
  errorMessage: string | null;
  onBack: () => void;
  onCreateNote: () => void;
  onOpenNote: (note: NoteCard) => void;
  onCloseNote: () => void;
  onEditNote: (note: NoteCard) => void;
  onDeleteNote: (note: NoteCard) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
};

export type NoteCreateProps = {
  editorContent: string;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onBack: () => void;
  onContentChange: (content: string) => void;
  onStatusChange: (checked: boolean) => void;
  onSubmitNote: () => void;
};
