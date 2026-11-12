import type { ChangeEvent, SubmitEvent } from "react";
import type { FieldErrors, UseFormGetValues, UseFormHandleSubmit, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { z } from "zod";

import { PROJECT_ACTIVE_STATUS } from "../MasterProject.config";
import type { ProjectCreatePayload, ProjectDetailResponse, ProjectUpdatePayload } from "../MasterProject.type";
import { ApiProjectSchema } from "../MasterProject.type";

import { PROJECT_FORM_MESSAGE, PROJECT_ITEM_MIN_QTY } from "./MasterProjectCreate.config";

import type { ItemAllResponse } from "@/modules/master-data/master-item/MasterItem.type";

/** Item from `GET /api/item`, reduced to what the project form shows. */
export const ProjectItemOptionSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullish(),
    price: z.number().nullish(),
    stock: z.number().nullish(),
  })
  .transform((item) => ({
    id: item.id,
    name: item.name,
    image: item.image ?? "",
    price: item.price ?? 0,
    stock: item.stock ?? 0,
  }));

/** Item that can be added to a project. */
export type ProjectItemOption = z.output<typeof ProjectItemOptionSchema>;

/** Item selected for the project with its quantity. */
export const ProjectSelectedItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.number(),
  stock: z.number(),
  qty: z.number().int().min(PROJECT_ITEM_MIN_QTY),
});

/** Item selected for the project with its quantity. */
export type ProjectSelectedItem = z.output<typeof ProjectSelectedItemSchema>;

/** Project form input. */
export const ProjectFormSchema = z.object({
  selectedItems: z.array(ProjectSelectedItemSchema).min(1, PROJECT_FORM_MESSAGE.ITEMS_REQUIRED),
  name: z.string().trim().min(1, PROJECT_FORM_MESSAGE.NAME_REQUIRED),
  price: z.number().nullable().pipe(z.number({ error: PROJECT_FORM_MESSAGE.PRICE_REQUIRED }).min(0, PROJECT_FORM_MESSAGE.PRICE_INVALID)),
  remark: z.string().trim(),
  isActive: z.boolean(),
});

/** Raw form values. */
export type ProjectFormValues = z.input<typeof ProjectFormSchema>;

/** Form values after validation. */
export type ProjectValidValues = z.output<typeof ProjectFormSchema>;

/** Form field names. */
export type ProjectFieldName = keyof ProjectFormValues;

/** Validation message per field. */
export type ProjectFieldErrors = Partial<Record<ProjectFieldName, string>>;

/** Loaded project normalized into form values; selected items are resolved against the item options later. */
export const ProjectFormDetailSchema = ApiProjectSchema.transform((project) => ({
  name: project.name,
  price: project.price,
  remark: project.remark ?? "",
  isActive: project.status === PROJECT_ACTIVE_STATUS,
  items: project.items ?? [],
}));

/** Loaded project normalized for the form. */
export type ProjectFormDetail = z.output<typeof ProjectFormDetailSchema>;

/** Whether the form creates a new project or edits an existing one. */
export type ProjectFormMode = "create" | "edit";

/** Whether the form can be shown. */
export type ProjectFormStatus = "loading" | "error" | "ready";

/** Which part of the item step is rendered. */
export type ProjectItemsStatus = "loading" | "error" | "empty" | "ready";

/** Wizard step of the project form. */
export type ProjectFormStep = "items" | "information" | "preview";

/** Direction to move through the wizard. */
export type ProjectFormStepDirection = 1 | -1;

/** Copy that differs between create and edit mode. */
export type ProjectFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Raw RTK Query state of the item options. */
export type ProjectItemsQueryState = {
  data?: ItemAllResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Normalized item options. */
export type ProjectItemsView = {
  itemsStatus: ProjectItemsStatus;
  itemOptions: ProjectItemOption[];
};

/** Inputs of the form source normalizer; data is undefined in create mode. */
export type ProjectFormSourceParams = {
  data?: ProjectDetailResponse;
  isLoading: boolean;
  isError: boolean;
  itemsView: ProjectItemsView;
};

/** Normalized form source used to seed the form. */
export type ProjectFormSource = {
  formStatus: ProjectFormStatus;
  initialValues: ProjectFormValues;
};

/** Result of an RTK Query mutation trigger. */
export type ProjectMutationResult = {
  unwrap: () => Promise<ProjectDetailResponse>;
};

/** Mutation triggers and target of a project submit. */
export type ProjectSubmitTarget = {
  id?: string;
  createProject: (payload: ProjectCreatePayload) => ProjectMutationResult;
  updateProject: (payload: ProjectUpdatePayload) => ProjectMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterProjectCreateParams = ProjectSubmitTarget & {
  mode: ProjectFormMode;
  initialValues: ProjectFormValues;
};

/** Submit state and handlers of the form. */
export type ProjectSubmission = {
  errorMessage?: string;
  submitProject: (values: ProjectValidValues) => Promise<void>;
  handleBack: () => void;
};

/** Inputs of the wizard hook. */
export type ProjectWizardParams = {
  handleSubmit: UseFormHandleSubmit<ProjectFormValues, ProjectValidValues>;
  trigger: UseFormTrigger<ProjectFormValues>;
  submission: ProjectSubmission;
};

/** Current step and wizard handlers. */
export type ProjectWizard = {
  step: ProjectFormStep;
  handleFormSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleStepBack: () => void;
};

/** Inputs of the field handlers hook. */
export type ProjectFieldHandlersParams = {
  errors: FieldErrors<ProjectFormValues>;
  isSubmitted: boolean;
  getValues: UseFormGetValues<ProjectFormValues>;
  setValue: UseFormSetValue<ProjectFormValues>;
};

/** Field change handlers of the form. */
export type ProjectFieldHandlers = {
  handleItemToggle: (item: ProjectItemOption) => void;
  handleItemQuantityChange: (itemId: string, quantity: number) => void;
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePriceChange: (price: number | null) => void;
  handleRemarkChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleStatusChange: (checked: boolean) => void;
};

/** Form state and handlers owned by the module hook. */
export type MasterProjectCreateController = ProjectFieldHandlers & {
  step: ProjectFormStep;
  values: ProjectFormValues;
  fieldErrors: ProjectFieldErrors;
  errorMessage?: string;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleStepBack: () => void;
  handleBack: () => void;
};

/** Props of an item option card. */
export type ProjectItemCardProps = {
  item: ProjectItemOption;
  selectedItem?: ProjectSelectedItem;
  onItemToggle: (item: ProjectItemOption) => void;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
};

/** Props of the quantity input of a selected item. */
export type ProjectItemQuantityProps = {
  item: ProjectItemOption;
  selectedItem: ProjectSelectedItem;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
};

/** Props of the create / edit form view. */
export type MasterProjectCreateProps = ProjectItemsView & {
  mode: ProjectFormMode;
  formStatus: ProjectFormStatus;
  step: ProjectFormStep;
  values: ProjectFormValues;
  fieldErrors: ProjectFieldErrors;
  isSubmitting: boolean;
  errorMessage?: string;
  onItemToggle: (item: ProjectItemOption) => void;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (price: number | null) => void;
  onRemarkChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onStatusChange: (checked: boolean) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onStepBack: () => void;
  onBack: () => void;
};
