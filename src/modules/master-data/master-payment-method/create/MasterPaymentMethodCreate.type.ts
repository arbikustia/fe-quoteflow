import type * as React from "react";
import type { FieldErrors } from "react-hook-form";

import type { PaymentMethodFormValues } from "../MasterPaymentMethod.type";

export type MasterPaymentMethodCreateFormState = {
  name: string;
  description: string;
  isActive: boolean;
  isEditMode: boolean;
  isLoadingInitialData: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  errors: FieldErrors<PaymentMethodFormValues>;
  isSubmitted: boolean;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleDescriptionChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
