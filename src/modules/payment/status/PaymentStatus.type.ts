import type { SyntheticEvent } from "react";

import type { PaymentCreatePayload } from "../Payment.type";

export type PaymentStatusFormProps = {
  referenceNo: string | null;
  isActive: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleStatusChange: (checked: boolean) => void;
  handleSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  goBack: () => void;
};

export type PaymentStatusSubmitState = {
  isSubmitting: boolean;
  submissionError: string | null;
  submit: (isActive: boolean) => Promise<string | null>;
};

export type PaymentStatusUpdatePayload = PaymentCreatePayload & { id: string };
