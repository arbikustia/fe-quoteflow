import type { ChangeEvent, SyntheticEvent } from "react";

import type { EmailSenderFormState } from "./EmailSender.type";

import type {
  useCreateEmailSenderMutation,
  useUpdateEmailSenderMutation,
} from "@/services/email-sender.service";

export type EmailSenderFieldErrors = {
  name?: string;
  email?: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_username?: string;
  smtp_password?: string;
};

export type EmailSenderSubmitContext = {
  id?: string;
  form: EmailSenderFormState;
  isEditMode: boolean;
  create: ReturnType<typeof useCreateEmailSenderMutation>[0];
  update: ReturnType<typeof useUpdateEmailSenderMutation>[0];
  navigate: (path: string, options: { state: { successMessage: string } }) => void;
  setErrorMessage: (message: string | null) => void;
  setFieldErrors: (next: EmailSenderFieldErrors) => void;
};

export type EmailSenderCreateProps = EmailSenderFormState & {
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  fieldErrors: EmailSenderFieldErrors;
  onChange: (key: keyof EmailSenderFormState) => (event: ChangeEvent<HTMLInputElement>) => void;
  onPortChange: (value: number | null) => void;
  onSslChange: (checked: boolean) => void;
  onDefaultChange: (checked: boolean) => void;
  onStatusChange: (checked: boolean) => void;
  onSubmit: (event: SyntheticEvent) => void;
  onBack: () => void;
};
