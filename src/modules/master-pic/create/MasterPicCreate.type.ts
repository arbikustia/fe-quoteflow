import type * as React from "react";

export type PicFormFieldsState = {
  name: string;
  isActive: boolean;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
};

export type PicSubmissionParams = {
  id?: string;
  isEditMode: boolean;
  name: string;
  isActive: boolean;
};

export type MasterPicCreateState = {
  name: string;
  isActive: boolean;
  isEditMode: boolean;
  isLoadingInitialData: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
