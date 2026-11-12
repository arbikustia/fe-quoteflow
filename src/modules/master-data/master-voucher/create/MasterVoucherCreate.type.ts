import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import { VOUCHER_ACTIVE_STATUS } from "../MasterVoucher.config";
import type { VoucherCreatePayload, VoucherMutationResponse, VoucherUpdatePayload } from "../MasterVoucher.type";
import { ApiVoucherSchema } from "../MasterVoucher.type";

import { VOUCHER_CODE_RULE, VOUCHER_DISCOUNT_RANGE, VOUCHER_FORM_MESSAGE } from "./MasterVoucherCreate.config";

/** How the voucher code is produced. */
export type VoucherCodeMode = "generate" | "type";

/** Typed voucher code: required, 7 to 8 alphanumeric characters. */
const TypedVoucherCodeSchema = z
  .string()
  .trim()
  .min(1, VOUCHER_FORM_MESSAGE.CODE_REQUIRED)
  .regex(VOUCHER_CODE_RULE.PATTERN, VOUCHER_FORM_MESSAGE.CODE_INVALID);

/** Voucher form input; the code is checked only when typed. */
export const VoucherFormSchema = z
  .object({
    name: z.string().trim().min(1, VOUCHER_FORM_MESSAGE.NAME_REQUIRED),
    codeMode: z.enum(["generate", "type"]),
    code: z.string(),
    discountPercent: z
      .number({ error: VOUCHER_FORM_MESSAGE.DISCOUNT_REQUIRED })
      .min(VOUCHER_DISCOUNT_RANGE.MIN, VOUCHER_FORM_MESSAGE.DISCOUNT_RANGE)
      .max(VOUCHER_DISCOUNT_RANGE.MAX, VOUCHER_FORM_MESSAGE.DISCOUNT_RANGE),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.codeMode !== "type") {
      return;
    }

    TypedVoucherCodeSchema.safeParse(values.code).error?.issues.slice(0, 1).forEach((issue) => {
      context.addIssue({ code: "custom", path: ["code"], message: issue.message });
    });
  });

/** Raw form values; the discount is empty until typed. */
export type VoucherFormValues = Omit<z.input<typeof VoucherFormSchema>, "discountPercent"> & {
  discountPercent: number | null;
};

/** Form values after validation. */
export type VoucherValidValues = z.output<typeof VoucherFormSchema>;

/** Form field names. */
export type VoucherFieldName = keyof VoucherFormValues;

/** Form fields edited through a text input. */
export type VoucherTextFieldName = "name" | "code";

/** Validation message per field. */
export type VoucherFieldErrors = Partial<Record<VoucherFieldName, string>>;

/** Voucher returned by the detail endpoint, normalized into form values. */
export const VoucherFormItemSchema = ApiVoucherSchema.transform((voucher): VoucherFormValues => ({
  name: voucher.name,
  codeMode: "type",
  code: voucher.code,
  discountPercent: voucher.discount_percent,
  isActive: voucher.status === VOUCHER_ACTIVE_STATUS,
}));

/** Whether the form creates a new voucher or edits an existing one. */
export type VoucherFormMode = "create" | "edit";

/** Whether the form can be shown. */
export type VoucherFormStatus = "loading" | "error" | "ready";

/** Copy that differs between create and edit mode. */
export type VoucherFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Normalized form source used to seed the form. */
export type VoucherFormSource = {
  formStatus: VoucherFormStatus;
  initialValues: VoucherFormValues;
};

/** Inputs of the form source normalizer. */
export type VoucherFormSourceParams = {
  data?: VoucherMutationResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Result of an RTK Query mutation trigger. */
export type VoucherMutationResult = {
  unwrap: () => Promise<VoucherMutationResponse>;
};

/** Mutation triggers and target of a voucher submit. */
export type VoucherSubmitTarget = {
  id?: string;
  createVoucher: (payload: VoucherCreatePayload) => VoucherMutationResult;
  updateVoucher: (payload: VoucherUpdatePayload) => VoucherMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterVoucherCreateParams = VoucherSubmitTarget & {
  mode: VoucherFormMode;
  initialValues: VoucherFormValues;
};

/** Submit state and handlers of the form. */
export type VoucherSubmission = {
  errorMessage?: string;
  submitVoucher: (values: VoucherValidValues) => Promise<void>;
  handleBack: () => void;
};

/** Field change handlers of the form. */
export type VoucherFieldHandlers = {
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleCodeModeChange: (codeMode: string) => void;
  handleCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDiscountChange: (discountPercent: number | null) => void;
  handleStatusChange: (checked: boolean) => void;
};

/** Form state and handlers owned by the module hook. */
export type MasterVoucherCreateController = VoucherFieldHandlers & {
  values: VoucherFormValues;
  fieldErrors: VoucherFieldErrors;
  errorMessage?: string;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Props of the create / edit form view. */
export type MasterVoucherCreateProps = {
  mode: VoucherFormMode;
  formStatus: VoucherFormStatus;
  values: VoucherFormValues;
  fieldErrors: VoucherFieldErrors;
  isSubmitting: boolean;
  errorMessage?: string;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCodeModeChange: (codeMode: string) => void;
  onCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDiscountChange: (discountPercent: number | null) => void;
  onStatusChange: (checked: boolean) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
