import type * as React from "react";

export type MasterServiceTypeCreateFormState = {
  readonly serviceName: string;
  readonly price: string;
  readonly isActive: boolean;
  readonly isEditMode: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly handleServiceNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleStatusChange: () => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  readonly goBack: () => void;
};

export type ServiceTypeSubmissionValues = {
  id: string | undefined;
  isEditMode: boolean;
  serviceName: string;
  price: string;
  isActive: boolean;
};

export type ServiceTypeFormFieldsState = {
  serviceName: string;
  price: string;
  isActive: boolean;
  handleServiceNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
};

