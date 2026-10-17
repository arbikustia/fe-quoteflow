import type { ChangeEvent, SyntheticEvent } from "react";

export type CustomerSubmissionParams = {
  readonly id: string | undefined;
  readonly isEditMode: boolean;
  readonly name: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly isActive: boolean;
};

export type CustomerSubmissionState = {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleSubmit: (event: SyntheticEvent) => Promise<void>;
};

export type CustomerFormFields = {
  readonly name: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly isActive: boolean;
  readonly handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handlePhoneNumberChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleAddressChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleStatusChange: () => void;
};

export type MasterCustomerCreateFormState = {
  readonly name: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly isActive: boolean;
  readonly isEditMode: boolean;
  readonly handleStatusChange: () => void;
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
