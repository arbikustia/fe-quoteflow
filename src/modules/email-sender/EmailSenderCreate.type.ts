import type { ChangeEvent, SyntheticEvent } from "react";

import type { EmailSenderFormState } from "./EmailSender.type";

export type EmailSenderCreateProps = EmailSenderFormState & {
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onChange: (key: keyof EmailSenderFormState) => (event: ChangeEvent<HTMLInputElement>) => void;
  onPortChange: (value: number | null) => void;
  onSslChange: (checked: boolean) => void;
  onDefaultChange: (checked: boolean) => void;
  onSubmit: (event: SyntheticEvent) => void;
  onBack: () => void;
};
