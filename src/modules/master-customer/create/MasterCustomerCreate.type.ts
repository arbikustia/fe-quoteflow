import type { ChangeEvent, SyntheticEvent } from "react";

export type MasterCustomerCreateFormState = {
  readonly name: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly isEditMode: boolean;
  readonly isLoadingInitialData: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handlePhoneNumberChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleAddressChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleSubmit: (event: SyntheticEvent) => void;
  readonly goBack: () => void;
};
