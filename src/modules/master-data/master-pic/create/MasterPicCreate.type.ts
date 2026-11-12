import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import type { PicCreatePayload, PicData, PicMutationResponse, PicUpdatePayload } from "../MasterPic.type";

import { PIC_FORM_MESSAGE } from "./MasterPicCreate.config";

/** PIC form input. */
export const PicFormSchema = z.object({
  name: z.string().trim().min(1, PIC_FORM_MESSAGE.NAME_REQUIRED),
  isActive: z.boolean(),
});

/** Raw form values. */
export type PicFormValues = z.input<typeof PicFormSchema>;

/** Form values after validation. */
export type PicValidValues = z.output<typeof PicFormSchema>;

/** Form field names. */
export type PicFieldName = keyof PicFormValues;

/** Validation message per field. */
export type PicFieldErrors = Partial<Record<PicFieldName, string>>;

/** PIC row passed from the list through router state, normalized into form values. */
export const PicRouteItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    status: z.enum(["active", "inactive"]),
  })
  .transform((pic): PicFormValues => ({
    name: pic.name,
    isActive: pic.status === "active",
  }));

/** Whether the form creates a new PIC or edits an existing one. */
export type PicFormMode = "create" | "edit";

/** Whether the form can be shown. */
export type PicFormStatus = "error" | "ready";

/** Copy that differs between create and edit mode. */
export type PicFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Normalized form source used to seed the form. */
export type PicFormSource = {
  formStatus: PicFormStatus;
  initialValues: PicFormValues;
};

/** Inputs of the form source normalizer. */
export type PicFormSourceParams = {
  id?: string;
  routePic?: PicData;
};

/** Result of an RTK Query mutation trigger. */
export type PicMutationResult = {
  unwrap: () => Promise<PicMutationResponse>;
};

/** Mutation triggers and target of a PIC submit. */
export type PicSubmitTarget = {
  id?: string;
  createPic: (payload: PicCreatePayload) => PicMutationResult;
  updatePic: (payload: PicUpdatePayload) => PicMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterPicCreateParams = PicSubmitTarget & {
  mode: PicFormMode;
  initialValues: PicFormValues;
};

/** Submit state and handlers of the form. */
export type PicSubmission = {
  errorMessage?: string;
  submitPic: (values: PicValidValues) => Promise<void>;
  handleBack: () => void;
};

/** Form state and handlers owned by the module hook. */
export type MasterPicCreateController = {
  values: PicFormValues;
  fieldErrors: PicFieldErrors;
  errorMessage?: string;
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (checked: boolean) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Props of the create / edit form view. */
export type MasterPicCreateProps = {
  mode: PicFormMode;
  formStatus: PicFormStatus;
  values: PicFormValues;
  fieldErrors: PicFieldErrors;
  isSubmitting: boolean;
  errorMessage?: string;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (checked: boolean) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
