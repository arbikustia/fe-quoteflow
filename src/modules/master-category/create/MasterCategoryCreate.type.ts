import type { ChangeEvent, SyntheticEvent } from "react";

export type MasterCategoryCreateFormState = {
  readonly name: string;
  readonly isActive: boolean;
  readonly isEditMode: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleStatusChange: () => void;
  readonly handleSubmit: (event: SyntheticEvent) => void;
  readonly goBack: () => void;
};
