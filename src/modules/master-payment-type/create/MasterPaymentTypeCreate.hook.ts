import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import type { FieldError, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type {
  PaymentTypeData,
  PaymentTypeFormFieldsState,
  PaymentTypeFormValues,
  PaymentTypeSubmissionParams,
  PaymentTypeSubmissionState,
} from "../MasterPaymentType.type";

import type { MasterPaymentTypeCreateFormState } from "./MasterPaymentTypeCreate.type";

import type { PaymentTypeCreateResponse, PaymentTypeDetailResponse } from "@/services/master-payment-type.service";
import {
  mapPaymentType,
  useCreatePaymentTypeMutation,
  useGetPaymentTypeByIdQuery,
  useUpdatePaymentTypeMutation,
} from "@/services/master-payment-type.service";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Payment type request failed.";
};

/**
 * Register payment type validation rules.
 * @param {ReturnType<typeof useForm<PaymentTypeFormValues>>["register"]} register - Register function
 * @returns {void} No return value
 */
const _registerPaymentTypeFields = (
  register: ReturnType<typeof useForm<PaymentTypeFormValues>>["register"],
): void => {
  register("name", { required: "Payment type name is required." });
};

/**
 * Create name input change handler.
 * @param {UseFormSetValue<PaymentTypeFormValues>} setValue - Form value setter
 * @param {FieldError | undefined} error - Field error
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _createNameChange = (
  setValue: UseFormSetValue<PaymentTypeFormValues>,
  error: FieldError | undefined,
): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue("name", event.target.value, { shouldValidate: Boolean(error) });
  }
);

/**
 * Create status toggle handler.
 * @param {UseFormSetValue<PaymentTypeFormValues>} setValue - Form value setter
 * @param {boolean} isActive - Current status
 * @returns {() => void} Toggle handler
 */
const _createStatusToggle = (
  setValue: UseFormSetValue<PaymentTypeFormValues>,
  isActive: boolean,
): (() => void) => (
  (): void => {
    setValue("isActive", !isActive, { shouldDirty: true });
  }
);

/**
 * Create form validation trigger.
 * @param {UseFormTrigger<PaymentTypeFormValues>} trigger - Form trigger
 * @returns {() => Promise<boolean>} Validation function
 */
const _createFormValidator = (
  trigger: UseFormTrigger<PaymentTypeFormValues>,
): (() => Promise<boolean>) => (
  async (): Promise<boolean> => await trigger()
);

/**
 * Resolve detail response into single UI payment type.
 * @param {PaymentTypeDetailResponse | undefined} response - Detail response
 * @returns {PaymentTypeData | null} Payment type or null
 */
const _resolvePaymentTypeDetail = (response: PaymentTypeDetailResponse | undefined): PaymentTypeData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const rawItem = Array.isArray(response.data) ? response.data[0] : response.data;

  return rawItem ? mapPaymentType(rawItem) : null;
};

/**
 * Synchronize API item with form values.
 * @param {PaymentTypeData | null} apiItem - API item
 * @param {string | null} initializedId - Current initialized ID
 * @param {(id: string | null) => void} setInitializedId - ID setter
 * @param {UseFormSetValue<PaymentTypeFormValues>} setValue - Value setter
 * @returns {void} No return value
 */
const _syncApiItem = (
  apiItem: PaymentTypeData | null,
  initializedId: string | null,
  setInitializedId: (id: string | null) => void,
  setValue: UseFormSetValue<PaymentTypeFormValues>,
): void => {
  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setValue("name", apiItem.name ?? "");
    setValue("isActive", apiItem.status === "active");
  }
};

/**
 * Send create or update payment type mutation.
 * @param {PaymentTypeSubmissionParams} params - Submission parameters
 * @param {ReturnType<typeof useCreatePaymentTypeMutation>[0]} createPaymentType - Create trigger
 * @param {ReturnType<typeof useUpdatePaymentTypeMutation>[0]} updatePaymentType - Update trigger
 * @returns {Promise<PaymentTypeCreateResponse>} API response
 */
const _sendPaymentTypeMutation = (
  params: PaymentTypeSubmissionParams,
  createPaymentType: ReturnType<typeof useCreatePaymentTypeMutation>[0],
  updatePaymentType: ReturnType<typeof useUpdatePaymentTypeMutation>[0],
): Promise<PaymentTypeCreateResponse> => {
  const { id, isEditMode, isActive, getValues } = params;
  const values = getValues();

  if (isEditMode && id) {
    return updatePaymentType({ id, name: values.name, status: isActive ? 1 : 0 }).unwrap();
  }

  return createPaymentType({ name: values.name, status: 1 }).unwrap();
};

/**
 * Handle form submission logic for create or update.
 * @param {PaymentTypeSubmissionParams} params - Submission parameters
 * @returns {PaymentTypeSubmissionState} Submission state
 */
const usePaymentTypeSubmission = (
  params: PaymentTypeSubmissionParams,
): PaymentTypeSubmissionState => {
  const { isEditMode, validateForm } = params;
  const navigate = useNavigate();
  const [createPaymentType, { isLoading: isCreating }] = useCreatePaymentTypeMutation();
  const [updatePaymentType, { isLoading: isUpdating }] = useUpdatePaymentTypeMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  /**
   * Submit payment type form.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Async result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!(await validateForm())) {
      setErrorMessage("Complete required payment type fields.");

      return;
    }

    try {
      const response = await _sendPaymentTypeMutation(params, createPaymentType, updatePaymentType);

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      const successMsg = isEditMode ? "Payment type updated successfully." : "Payment type created successfully.";

      setSuccessMessage(successMsg);
      navigate("/master-payment-type", { state: { successMessage: successMsg } });
    } catch {
      setErrorMessage(isEditMode ? "Unable to update payment type. Please try again." : "Unable to create payment type. Please try again.");
    }
  };

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
};

/**
 * Resolve initial active state.
 * @param {PaymentTypeData | undefined} routePaymentType - Route item
 * @param {PaymentTypeData | null} apiItem - API item
 * @returns {boolean} Initial active state
 */
const _resolveInitialIsActive = (
  routePaymentType: PaymentTypeData | undefined,
  apiItem: PaymentTypeData | null,
): boolean => {
  if (routePaymentType) {
    return routePaymentType.status === "active";
  }

  if (apiItem) {
    return apiItem.status === "active";
  }

  return true;
};

/**
 * Hook managing form fields and synchronization.
 * @param {PaymentTypeData | undefined} routePaymentType - Route payment type
 * @param {PaymentTypeData | null} apiItem - API fetched payment type
 * @returns {PaymentTypeFormFieldsState} Form fields state
 */
const usePaymentTypeFormFields = (
  routePaymentType: PaymentTypeData | undefined,
  apiItem: PaymentTypeData | null,
): PaymentTypeFormFieldsState => {
  const initialName = routePaymentType?.name ?? apiItem?.name ?? "";
  const initialIsActive = _resolveInitialIsActive(routePaymentType, apiItem);
  const { control, formState: { errors }, getValues, register, setValue, trigger } = useForm<PaymentTypeFormValues>({
    defaultValues: { name: initialName, isActive: initialIsActive },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  _registerPaymentTypeFields(register);

  const [initializedId, setInitializedId] = useState<string | null>(routePaymentType?.id ?? null);
  const name = useWatch({ control, name: "name" });
  const isActive = useWatch({ control, name: "isActive" });

  _syncApiItem(apiItem, initializedId, setInitializedId, setValue);

  return {
    name,
    isActive,
    errors,
    isSubmitted: Boolean(errors.name),
    register,
    getValues,
    validateForm: _createFormValidator(trigger),
    handleNameChange: _createNameChange(setValue, errors.name),
    handleStatusChange: _createStatusToggle(setValue, isActive),
  };
};

/**
 * Hook managing master payment type form state.
 * @returns {MasterPaymentTypeCreateFormState} Form state
 */
export const useMasterPaymentTypeCreate = (): MasterPaymentTypeCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routePaymentType: PaymentTypeData | undefined = location.state?.paymentType;

  const { data: detailData, isLoading: isLoadingDetail } = useGetPaymentTypeByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routePaymentType),
  });

  const apiItem = _resolvePaymentTypeDetail(detailData);
  const formFields = usePaymentTypeFormFields(routePaymentType, apiItem);
  const submission = usePaymentTypeSubmission({ id, isEditMode, ...formFields });
  const isLoadingInitialData = isLoadingDetail && !routePaymentType;

  /**
   * Navigate back.
   * @returns {void} No return value
   */
  const goBack = (): void => {
    navigate(-1);
  };

  return {
    isEditMode,
    isLoadingInitialData,
    goBack,
    ...formFields,
    ...submission,
  };
};
