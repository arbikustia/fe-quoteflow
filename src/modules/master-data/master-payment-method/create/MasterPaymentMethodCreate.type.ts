import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import { PAYMENT_METHOD_ACTIVE_STATUS } from "../MasterPaymentMethod.config";
import type { ApiPaymentMethod, PaymentMethodCreatePayload, PaymentMethodMutationResponse, PaymentMethodUpdatePayload } from "../MasterPaymentMethod.type";
import { ApiPaymentMethodSchema } from "../MasterPaymentMethod.type";

import { PAYMENT_METHOD_FORM_MESSAGE } from "./MasterPaymentMethodCreate.config";

/** Payment method form input. */
export const PaymentMethodFormSchema = z.object({
  name: z.string().trim().min(1, PAYMENT_METHOD_FORM_MESSAGE.NAME_REQUIRED),
  description: z.string().trim().min(1, PAYMENT_METHOD_FORM_MESSAGE.DESCRIPTION_REQUIRED),
  isActive: z.boolean(),
});

/** Raw form values. */
export type PaymentMethodFormValues = z.input<typeof PaymentMethodFormSchema>;

/** Form values after validation. */
export type PaymentMethodValidValues = z.output<typeof PaymentMethodFormSchema>;

/** Form field names. */
export type PaymentMethodFieldName = keyof PaymentMethodFormValues;

/** Validation message per field. */
export type PaymentMethodFieldErrors = Partial<Record<PaymentMethodFieldName, string>>;

/** Raw payment method passed from the list through router state, normalized into form values. */
export const PaymentMethodRouteItemSchema = ApiPaymentMethodSchema.transform((paymentMethod): PaymentMethodFormValues => ({
  name: paymentMethod.name ?? "",
  description: paymentMethod.description ?? "",
  isActive: paymentMethod.status === PAYMENT_METHOD_ACTIVE_STATUS,
}));

/** Whether the form creates a new payment method or edits an existing one. */
export type PaymentMethodFormMode = "create" | "edit";

/** Whether the form can be shown. */
export type PaymentMethodFormStatus = "error" | "ready";

/** Copy that differs between create and edit mode. */
export type PaymentMethodFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Normalized form source used to seed the form. */
export type PaymentMethodFormSource = {
  formStatus: PaymentMethodFormStatus;
  initialValues: PaymentMethodFormValues;
};

/** Inputs of the form source normalizer. */
export type PaymentMethodFormSourceParams = {
  id?: string;
  routePaymentMethod?: ApiPaymentMethod;
};

/** Result of an RTK Query mutation trigger. */
export type PaymentMethodMutationResult = {
  unwrap: () => Promise<PaymentMethodMutationResponse>;
};

/** Mutation triggers and target of a payment method submit. */
export type PaymentMethodSubmitTarget = {
  id?: string;
  createPaymentMethod: (payload: PaymentMethodCreatePayload) => PaymentMethodMutationResult;
  updatePaymentMethod: (payload: PaymentMethodUpdatePayload) => PaymentMethodMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterPaymentMethodCreateParams = PaymentMethodSubmitTarget & {
  mode: PaymentMethodFormMode;
  initialValues: PaymentMethodFormValues;
};

/** Submit state and handlers of the form. */
export type PaymentMethodSubmission = {
  errorMessage?: string;
  submitPaymentMethod: (values: PaymentMethodValidValues) => Promise<void>;
  handleBack: () => void;
};

/** Form state and handlers owned by the module hook. */
export type MasterPaymentMethodCreateController = {
  values: PaymentMethodFormValues;
  fieldErrors: PaymentMethodFieldErrors;
  errorMessage?: string;
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleStatusChange: (checked: boolean) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Props of the create / edit form view. */
export type MasterPaymentMethodCreateProps = {
  mode: PaymentMethodFormMode;
  formStatus: PaymentMethodFormStatus;
  values: PaymentMethodFormValues;
  fieldErrors: PaymentMethodFieldErrors;
  isSubmitting: boolean;
  errorMessage?: string;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onStatusChange: (checked: boolean) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
