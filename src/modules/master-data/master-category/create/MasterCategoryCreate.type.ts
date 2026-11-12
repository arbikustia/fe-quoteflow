import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import type { CategoryCreatePayload, CategoryData, CategoryMutationResponse, CategoryUpdatePayload } from "../MasterCategory.type";

import { CATEGORY_FORM_MESSAGE } from "./MasterCategoryCreate.config";

/** Category form input, validated on submit. */
export const CategoryFormSchema = z.object({
  name: z.string().trim().min(1, CATEGORY_FORM_MESSAGE.NAME_REQUIRED),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

/** Category list row passed through router state, normalized into form values. */
export const CategoryRouteItemSchema = z
  .object({
    id: z.string(),
    categoryName: z.string(),
    status: z.enum(["active", "inactive"]),
  })
  .transform((category): CategoryFormValues => ({
    name: category.categoryName,
    isActive: category.status === "active",
  }));

/** Whether the form creates a new category or edits an existing one. */
export type CategoryFormMode = "create" | "edit";

/** Whether the form can be shown yet. */
export type CategoryFormStatus = "error" | "ready";

/** Copy that differs between create and edit mode. */
export type CategoryFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Normalized router state used to seed the form. */
export type CategoryFormSource = {
  formStatus: CategoryFormStatus;
  initialValues: CategoryFormValues;
};

/** Inputs of the form source normalizer. */
export type CategoryFormSourceParams = {
  id?: string;
  routeCategory?: CategoryData;
};

/** Result of an RTK Query mutation trigger. */
export type CategoryMutationResult = {
  unwrap: () => Promise<CategoryMutationResponse>;
};

/** Mutation triggers and target of a category submit. */
export type CategorySubmitTarget = {
  id?: string;
  createCategory: (payload: CategoryCreatePayload) => CategoryMutationResult;
  updateCategory: (payload: CategoryUpdatePayload) => CategoryMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterCategoryCreateParams = CategorySubmitTarget & {
  mode: CategoryFormMode;
  initialValues: CategoryFormValues;
};

/** Submit state and handlers of the form. */
export type CategorySubmission = {
  errorMessage?: string;
  submitCategory: (values: CategoryFormValues) => Promise<void>;
  handleBack: () => void;
};

/** Form state and handlers owned by the module hook. */
export type MasterCategoryCreateController = {
  values: CategoryFormValues;
  nameError?: string;
  errorMessage?: string;
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (isActive: boolean) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Props of the create / edit form view. */
export type MasterCategoryCreateProps = {
  mode: CategoryFormMode;
  formStatus: CategoryFormStatus;
  values: CategoryFormValues;
  nameError?: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (isActive: boolean) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
