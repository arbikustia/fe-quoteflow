/* eslint-disable jsdoc/require-param-type, jsdoc/require-param-description, jsdoc/require-returns */
import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import type { FieldError, UseFormSetError, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type {
  VoucherCreatePayload,
  VoucherCreateResponse,
  VoucherData,
  VoucherDetailResponse,
  VoucherFormFieldsState,
  VoucherFormValues,
  VoucherRouteState,
  VoucherSubmissionParams,
  VoucherSubmissionState,
  VoucherUpdatePayload,
} from "../MasterVoucher.type";

import { generateSecureVoucherCode, validateTypedVoucherCode } from "./MasterVoucherCreate.helpers";
import type { MasterVoucherCreateFormState } from "./MasterVoucherCreate.type";

import {
  mapVoucher,
  useCreateVoucherMutation,
  useGetVoucherByIdQuery,
  useUpdateVoucherMutation,
} from "@/services/master-voucher.service";

/**
 * Format backend messages for display.
 * @param messages
 */
const _formatMessages = (messages: string[] | string | null): string => Array.isArray(messages) ? messages.join(" ") : (messages ?? "Voucher request failed.");

/**
 * Resolve response to voucher data.
 * @param response
 */
const _resolveVoucherDetail = (response: VoucherDetailResponse | undefined): VoucherData | null => {
  if (!response?.status || !response.data) return null;

  const rawItem = Array.isArray(response.data) ? response.data[0] : response.data;

  return rawItem ? mapVoucher(rawItem) : null;
};

/**
 * Register voucher validation rules.
 * @param register
 */
const _registerVoucherFields = (register: ReturnType<typeof useForm<VoucherFormValues>>["register"]): void => {
  register("name", { required: "Voucher name is required." });
  register("discountPercent", {
    required: "Discount percentage is required.",
    /**
     *
     * @param value
     */
    validate: (value: string): string | boolean => Number(value) >= 0 && Number(value) <= 100 || "Discount must be between 0 and 100.",
  });
};

/**
 * Create text field change handler.
 * @param field
 * @param setValue
 * @param error
 */
const _createTextChange = (field: "name" | "code", setValue: UseFormSetValue<VoucherFormValues>, error: FieldError | undefined): ((event: ChangeEvent<HTMLInputElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement>): void => setValue(field, event.target.value, { shouldValidate: Boolean(error) })
);

/**
 * Create discount field change handler.
 * @param setValue
 * @param error
 */
const _createDiscountChange = (setValue: UseFormSetValue<VoucherFormValues>, error: FieldError | undefined): ((value: number | null) => void) => (
  (value: number | null): void => setValue("discountPercent", value === null ? "" : String(value), { shouldValidate: Boolean(error) })
);

/**
 * Create code mode change handler.
 * @param setValue
 */
const _createCodeModeChange = (setValue: UseFormSetValue<VoucherFormValues>): ((value: string) => void) => (
  (value: string): void => {
    const codeMode = value === "type" ? "type" : "generate";

    setValue("codeMode", codeMode);
    setValue("code", codeMode === "generate" ? generateSecureVoucherCode() : "");
  }
);

/**
 * Create status toggle handler.
 * @param setValue
 * @param isActive
 */
const _createStatusToggle = (setValue: UseFormSetValue<VoucherFormValues>, isActive: boolean): (() => void) => (
  (): void => setValue("isActive", !isActive, { shouldDirty: true })
);

/**
 * Create form validator including conditional code rule.
 * @param trigger
 * @param getValues
 * @param setError
 */
const _createFormValidator = (trigger: UseFormTrigger<VoucherFormValues>, getValues: () => VoucherFormValues, setError: UseFormSetError<VoucherFormValues>): (() => Promise<boolean>) => (
  async (): Promise<boolean> => {
    const isValid = await trigger(["name", "discountPercent"]);
    const values = getValues();
    const codeError = values.codeMode === "type" ? validateTypedVoucherCode(values.code.trim().toUpperCase()) : null;

    if (codeError) setError("code", { type: "validate", message: codeError });

    return isValid && !codeError;
  }
);

/**
 * Synchronize fetched voucher into form.
 * @param apiItem
 * @param initializedId
 * @param setInitializedId
 * @param setValue
 */
const _syncApiVoucher = (apiItem: VoucherData | null, initializedId: string | null, setInitializedId: (id: string | null) => void, setValue: UseFormSetValue<VoucherFormValues>): void => {
  if (!apiItem || apiItem.id === initializedId) return;

  setInitializedId(apiItem.id);
  setValue("name", apiItem.name);
  setValue("code", apiItem.code);
  setValue("codeMode", "type");
  setValue("discountPercent", apiItem.discountPercent.toString());
  setValue("isActive", apiItem.status === "active");
};

/**
 * Send create or update mutation.
 * @param params
 * @param finalCode
 * @param createVoucher
 * @param updateVoucher
 */
const _sendVoucherMutation = (params: VoucherSubmissionParams, finalCode: string, createVoucher: (payload: VoucherCreatePayload) => { unwrap: () => Promise<VoucherCreateResponse> }, updateVoucher: (payload: VoucherUpdatePayload) => { unwrap: () => Promise<VoucherCreateResponse> }): Promise<VoucherCreateResponse> => {
  const values = params.getValues();
  const payload = { name: values.name, code: finalCode, discount_percent: Number(values.discountPercent), status: 1 };

  return params.isEditMode && params.id
    ? updateVoucher({ ...payload, status: params.isActive ? 1 : 0, id: params.id }).unwrap()
    : createVoucher(payload).unwrap();
};

/**
 * Manage voucher submission.
 * @param params
 */
const useVoucherSubmission = (params: VoucherSubmissionParams): VoucherSubmissionState => {
  const navigate = useNavigate();
  const [createVoucher, { isLoading: isCreating }] = useCreateVoucherMutation();
  const [updateVoucher, { isLoading: isUpdating }] = useUpdateVoucherMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Submit voucher form.
   * @param event
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    if (!(await params.validateForm())) {
      setErrorMessage("Complete required voucher fields.");

      return;
    }

    const values = params.getValues();
    const finalCode = (values.codeMode === "generate" ? values.code || generateSecureVoucherCode() : values.code).trim().toUpperCase();

    try {
      const response = await _sendVoucherMutation(params, finalCode, createVoucher, updateVoucher);

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      const successMessage = params.isEditMode ? "Voucher updated successfully." : "Voucher created successfully.";

      navigate("/master-voucher", { state: { successMessage } });
    } catch {
      setErrorMessage("Unable to save voucher. Please try again.");
    }
  };

  return { isSubmitting: isCreating || isUpdating, errorMessage, handleSubmit };
};

/**
 * Manage voucher form fields.
 * @param routeVoucher
 * @param apiItem
 * @param isEditMode
 */
const useVoucherFormFields = (routeVoucher: VoucherData | undefined, apiItem: VoucherData | null, isEditMode: boolean): VoucherFormFieldsState => {
  const initialMode = isEditMode ? "type" : "generate";
  const { control, formState: { errors, isSubmitted }, getValues, register, setError, setValue, trigger } = useForm<VoucherFormValues>({
    defaultValues: { name: routeVoucher?.name ?? "", code: routeVoucher?.code ?? (initialMode === "generate" ? generateSecureVoucherCode() : ""), codeMode: initialMode, discountPercent: routeVoucher?.discountPercent.toString() ?? "", isActive: routeVoucher?.status !== "inactive" },
    mode: "onSubmit", reValidateMode: "onChange",
  });

  _registerVoucherFields(register);
  const [initializedId, setInitializedId] = useState<string | null>(routeVoucher?.id ?? null);
  const name = useWatch({ control, name: "name" });
  const code = useWatch({ control, name: "code" });
  const codeMode = useWatch({ control, name: "codeMode" });
  const discountPercent = useWatch({ control, name: "discountPercent" });
  const isActive = useWatch({ control, name: "isActive" });

  _syncApiVoucher(apiItem, initializedId, setInitializedId, setValue);

  return { name, code, codeMode, discountPercent, isActive, errors, isSubmitted, getValues, validateForm: _createFormValidator(trigger, getValues, setError), handleNameChange: _createTextChange("name", setValue, errors.name), handleCodeChange: _createTextChange("code", setValue, errors.code), handleCodeModeChange: _createCodeModeChange(setValue), handleDiscountChange: _createDiscountChange(setValue, errors.discountPercent), handleStatusChange: _createStatusToggle(setValue, isActive) };
};

/** Provide voucher create/edit form state. */
export const useMasterVoucherCreateForm = (): MasterVoucherCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeState: VoucherRouteState | null = location.state;
  const routeVoucher = routeState?.voucher;
  const { data: detailData } = useGetVoucherByIdQuery(id ?? "", { skip: !isEditMode || !id || Boolean(routeVoucher) });
  const formFields = useVoucherFormFields(routeVoucher, _resolveVoucherDetail(detailData), isEditMode);
  const submission = useVoucherSubmission({ id, isEditMode, ...formFields });

  /** Navigate back. */
  const goBack = (): void => { navigate(-1); };

  return { isEditMode, goBack, ...formFields, ...submission };
};
