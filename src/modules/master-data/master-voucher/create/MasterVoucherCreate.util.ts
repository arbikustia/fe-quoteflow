import type { FieldErrors, ResolverResult } from "react-hook-form";

import type { ApiMessages } from "@/types/api.type";

import { VOUCHER_ACTIVE_STATUS, VOUCHER_INACTIVE_STATUS } from "../MasterVoucher.config";
import type { VoucherCreatePayload, VoucherMutationResponse } from "../MasterVoucher.type";

import { VOUCHER_CODE_RULE, VOUCHER_FORM_DEFAULT_VALUES, VOUCHER_FORM_MESSAGE } from "./MasterVoucherCreate.config";
import type {
  VoucherFieldErrors,
  VoucherFieldName,
  VoucherFormSource,
  VoucherFormSourceParams,
  VoucherFormValues,
  VoucherSubmitTarget,
  VoucherValidValues,
} from "./MasterVoucherCreate.type";
import { VoucherFormItemSchema, VoucherFormSchema } from "./MasterVoucherCreate.type";

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || VOUCHER_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the voucher detail query into the form source (single upstream fallback).
 * Create mode skips the query, so no data and no flags yield an empty ready form.
 * @param {VoucherFormSourceParams} params - Detail query data and flags
 * @returns {VoucherFormSource} - Form status and initial values
 */
export const normalizeVoucherFormSource = (params: VoucherFormSourceParams): VoucherFormSource => {
  const { data, isLoading, isError } = params;

  if (isLoading) {
    return { formStatus: "loading", initialValues: VOUCHER_FORM_DEFAULT_VALUES };
  }

  if (isError) {
    return { formStatus: "error", initialValues: VOUCHER_FORM_DEFAULT_VALUES };
  }

  if (!data) {
    return { formStatus: "ready", initialValues: VOUCHER_FORM_DEFAULT_VALUES };
  }

  const parsedVoucher = VoucherFormItemSchema.safeParse(data.data);

  if (!data.status || !parsedVoucher.success) {
    return { formStatus: "error", initialValues: VOUCHER_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedVoucher.data };
};

/**
 * Validate form values with the voucher schema; react-hook-form resolver.
 * @param {VoucherFormValues} values - Current form values
 * @returns {ResolverResult<VoucherFormValues, VoucherValidValues>} - Parsed values, or the first error per field
 */
export const resolveVoucherForm = (values: VoucherFormValues): ResolverResult<VoucherFormValues, VoucherValidValues> => {
  const result = VoucherFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<VoucherFormValues> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as VoucherFieldName;

    errors[field] = errors[field] ?? { type: issue.code, message: issue.message };
  });

  return { values: {}, errors };
};

/**
 * Pick the message of every field error.
 * @param {FieldErrors<VoucherFormValues>} errors - react-hook-form errors
 * @returns {VoucherFieldErrors} - Message per field
 */
export const getVoucherFieldErrors = (errors: FieldErrors<VoucherFormValues>): VoucherFieldErrors => {
  const fieldErrors: VoucherFieldErrors = {};

  (Object.keys(errors) as VoucherFieldName[]).forEach((field) => {
    fieldErrors[field] = errors[field]?.message;
  });

  return fieldErrors;
};

/**
 * Generate a voucher code: the `SL` prefix plus unbiased random characters.
 * @returns {string} - Generated voucher code
 * @throws {Error} - When secure randomness is unavailable
 */
export const generateSecureVoucherCode = (): string => {
  if (typeof crypto === "undefined" || !crypto.getRandomValues) {
    throw new Error("Secure random generator is unavailable.");
  }

  const { CHARSET, PREFIX, RANDOM_LENGTH } = VOUCHER_CODE_RULE;
  const maxUnbiasedByte = Math.floor(256 / CHARSET.length) * CHARSET.length;
  let randomPart = "";

  while (randomPart.length < RANDOM_LENGTH) {
    crypto.getRandomValues(new Uint8Array(RANDOM_LENGTH)).forEach((byte) => {
      if (byte < maxUnbiasedByte && randomPart.length < RANDOM_LENGTH) {
        randomPart += CHARSET[byte % CHARSET.length];
      }
    });
  }

  return `${PREFIX}${randomPart}`;
};

/**
 * Build the create / update request body from validated form values.
 * A generated code is created here; a typed code is trimmed and uppercased.
 * @param {VoucherValidValues} values - Valid form values
 * @returns {VoucherCreatePayload} - Request body
 */
export const buildVoucherPayload = (values: VoucherValidValues): VoucherCreatePayload => ({
  name: values.name,
  code: values.codeMode === "generate" ? generateSecureVoucherCode() : values.code.trim().toUpperCase(),
  discount_percent: values.discountPercent,
  status: values.isActive ? VOUCHER_ACTIVE_STATUS : VOUCHER_INACTIVE_STATUS,
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {VoucherValidValues} values - Valid form values
 * @param {VoucherSubmitTarget} target - Mutation triggers and voucher id
 * @returns {Promise<VoucherMutationResponse>} - Mutation response
 */
export const sendVoucherMutation = (values: VoucherValidValues, target: VoucherSubmitTarget): Promise<VoucherMutationResponse> => {
  const payload = buildVoucherPayload(values);

  if (target.id) {
    return target.updateVoucher({ ...payload, id: target.id }).unwrap();
  }

  return target.createVoucher(payload).unwrap();
};
