import type * as React from "react";

export type MasterServiceTypeCreateFormState = {
  serviceName: string;
  price: string;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleServiceNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
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

