import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import { ORDER_TYPE_ACTIVE_STATUS } from "../MasterOrderType.config";
import type { OrderTypeCreatePayload, OrderTypeMutationResponse, OrderTypeUpdatePayload } from "../MasterOrderType.type";

import { ORDER_TYPE_FORM_MESSAGE } from "./MasterOrderTypeCreate.config";

/** Order type form input. */
export const OrderTypeFormSchema = z.object({
  name: z.string().trim().min(1, ORDER_TYPE_FORM_MESSAGE.NAME_REQUIRED),
  isHandover: z.boolean(),
  isActive: z.boolean(),
});

/** Raw form values. */
export type OrderTypeFormValues = z.input<typeof OrderTypeFormSchema>;

/** Form values after validation. */
export type OrderTypeValidValues = z.output<typeof OrderTypeFormSchema>;

/** Form field names. */
export type OrderTypeFieldName = keyof OrderTypeFormValues;

/** Fields edited through a switch. */
export type OrderTypeToggleField = "isHandover" | "isActive";

/** Validation message per field. */
export type OrderTypeFieldErrors = Partial<Record<OrderTypeFieldName, string>>;

/** Order type from `GET /api/order-type/{id}`, normalized into form values. */
export const OrderTypeDetailSchema = z
  .object({
    name: z.string().nullish().transform((value): string => value ?? ""),
    is_handover: z.boolean().catch(false),
    status: z.number().catch(ORDER_TYPE_ACTIVE_STATUS),
  })
  .transform((orderType): OrderTypeFormValues => ({
    name: orderType.name,
    isHandover: orderType.is_handover,
    isActive: orderType.status === ORDER_TYPE_ACTIVE_STATUS,
  }));

/** Whether the form creates a new order type or edits an existing one. */
export type OrderTypeFormMode = "create" | "edit";

/** Whether the form can be shown yet. */
export type OrderTypeFormStatus = "loading" | "error" | "ready";

/** Copy that differs between create and edit mode. */
export type OrderTypeFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Normalized order type detail query used to seed the form. */
export type OrderTypeFormSource = {
  formStatus: OrderTypeFormStatus;
  initialValues: OrderTypeFormValues;
};

/** Raw RTK Query state consumed by the detail normalizer. */
export type OrderTypeDetailQueryState = {
  data?: OrderTypeMutationResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Result of an RTK Query mutation trigger. */
export type OrderTypeMutationResult = {
  unwrap: () => Promise<OrderTypeMutationResponse>;
};

/** Mutation triggers and target of an order type submit. */
export type OrderTypeSubmitTarget = {
  id?: string;
  createOrderType: (payload: OrderTypeCreatePayload) => OrderTypeMutationResult;
  updateOrderType: (payload: OrderTypeUpdatePayload) => OrderTypeMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterOrderTypeCreateParams = OrderTypeSubmitTarget & {
  mode: OrderTypeFormMode;
  initialValues: OrderTypeFormValues;
};

/** Submit state and handlers of the form. */
export type OrderTypeSubmission = {
  errorMessage?: string;
  submitOrderType: (values: OrderTypeValidValues) => Promise<void>;
  handleBack: () => void;
};

/** Change handler per switch field. */
export type OrderTypeToggleChangeHandlers = Record<OrderTypeToggleField, (checked: boolean) => void>;

/** Form state and handlers owned by the module hook. */
export type MasterOrderTypeCreateController = {
  values: OrderTypeFormValues;
  fieldErrors: OrderTypeFieldErrors;
  errorMessage?: string;
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleToggleChange: OrderTypeToggleChangeHandlers;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Props of the create / edit form view. */
export type MasterOrderTypeCreateProps = {
  mode: OrderTypeFormMode;
  formStatus: OrderTypeFormStatus;
  values: OrderTypeFormValues;
  fieldErrors: OrderTypeFieldErrors;
  isSubmitting: boolean;
  errorMessage?: string;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onToggleChange: OrderTypeToggleChangeHandlers;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
