import type * as React from "react";
import type { FieldErrors } from "react-hook-form";

import type { PaymentTypeFormValues } from "../MasterPaymentType.type";

export type MasterPaymentTypeCreateFormState = {
  name: string;
  isActive: boolean;
  isEditMode: boolean;
  isLoadingInitialData: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  errors: FieldErrors<PaymentTypeFormValues>;
  isSubmitted: boolean;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
