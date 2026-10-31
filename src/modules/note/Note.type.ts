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
  updatedAt: string;
};

export type NoteCreatePayload = {
  content: string;
  status: number;
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
  onCreateNote: () => void;
  onOpenNote: (note: NoteCard) => void;
  onCloseNote: () => void;
};

export type NoteCreateProps = {
  editorContent: string;
  isCreating: boolean;
  errorMessage: string | null;
  onBack: () => void;
  onContentChange: (content: string) => void;
  onSubmitNote: () => void;
};
