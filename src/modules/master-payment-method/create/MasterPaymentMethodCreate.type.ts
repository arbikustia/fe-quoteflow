import type * as React from "react";

export type MasterPaymentMethodCreateFormState = {
  readonly name: string;
  readonly description: string;
  readonly isActive: boolean;
  readonly isEditMode: boolean;
  readonly isLoadingInitialData: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readonly handleStatusChange: () => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  readonly goBack: () => void;
};
