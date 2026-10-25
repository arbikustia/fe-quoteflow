import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import type { FieldError, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type {
  PaymentMethodData,
  PaymentMethodFormFieldsState,
  PaymentMethodFormValues,
  PaymentMethodSubmissionParams,
  PaymentMethodSubmissionState,
} from "../MasterPaymentMethod.type";

import type { MasterPaymentMethodCreateFormState } from "./MasterPaymentMethodCreate.type";

import type { PaymentMethodCreateResponse, PaymentMethodDetailResponse } from "@/services/master-payment-method.service";
import {
  mapPaymentMethod,
  useCreatePaymentMethodMutation,
  useGetPaymentMethodByIdQuery,
  useUpdatePaymentMethodMutation,
} from "@/services/master-payment-method.service";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Payment method request failed.";
};

/**
 * Register payment method validation rules.
 * @param {ReturnType<typeof useForm<PaymentMethodFormValues>>["register"]} register - Register function
 * @returns {void} No return value
 */
const _registerPaymentMethodFields = (
  register: ReturnType<typeof useForm<PaymentMethodFormValues>>["register"],
): void => {
  register("name", { required: "Payment method name is required." });
  register("description", { required: "Description is required." });
};

/**
 * Resolve detail response into single UI payment method.
 * @param {PaymentMethodDetailResponse | undefined} response - Detail response
 * @returns {PaymentMethodData | null} Payment method or null
 */
const _resolvePaymentMethodDetail = (response: PaymentMethodDetailResponse | undefined): PaymentMethodData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const rawItem = Array.isArray(response.data) ? response.data[0] : response.data;

  return rawItem ? mapPaymentMethod(rawItem) : null;
};

/**
 * Send create or update mutation to API.
 * @param {PaymentMethodSubmissionParams} params - Submission parameters
 * @param {ReturnType<typeof useCreatePaymentMethodMutation>[0]} createPaymentMethod - Create mutation trigger
 * @param {ReturnType<typeof useUpdatePaymentMethodMutation>[0]} updatePaymentMethod - Update mutation trigger
 * @returns {Promise<PaymentMethodCreateResponse>} API response
 */
const _sendPaymentMethodMutation = (
  params: PaymentMethodSubmissionParams,
  createPaymentMethod: ReturnType<typeof useCreatePaymentMethodMutation>[0],
  updatePaymentMethod: ReturnType<typeof useUpdatePaymentMethodMutation>[0],
): Promise<PaymentMethodCreateResponse> => {
  const { id, isEditMode, isActive, getValues } = params;
  const values = getValues();

  if (isEditMode && id) {
    return updatePaymentMethod({ id, name: values.name, description: values.description, status: isActive ? 1 : 0 }).unwrap();
  }

  return createPaymentMethod({ name: values.name, description: values.description, status: 1 }).unwrap();
};

/**
 * Handle form submission logic for create or update.
 * @param {PaymentMethodSubmissionParams} params - Submission parameters
 * @returns {PaymentMethodSubmissionState} Submission state
 */
const usePaymentMethodSubmission = (
  params: PaymentMethodSubmissionParams,
): PaymentMethodSubmissionState => {
  const { isEditMode, validateForm } = params;
  const navigate = useNavigate();
  const [createPaymentMethod, { isLoading: isCreating }] = useCreatePaymentMethodMutation();
  const [updatePaymentMethod, { isLoading: isUpdating }] = useUpdatePaymentMethodMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  /**
   * Submit payment method form.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Async result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!(await validateForm())) {
      setErrorMessage("Complete required payment method fields.");

      return;
    }

    try {
      const response = await _sendPaymentMethodMutation(params, createPaymentMethod, updatePaymentMethod);

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      const successMsg = isEditMode ? "Payment method updated successfully." : "Payment method created successfully.";

      setSuccessMessage(successMsg);
      navigate("/master-payment-method", { state: { successMessage: successMsg } });
    } catch {
      setErrorMessage(isEditMode ? "Unable to update payment method. Please try again." : "Unable to create payment method. Please try again.");
    }
  };

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
};

/**
 * Resolve initial active toggle state.
 * @param {PaymentMethodData | undefined} routePaymentMethod - Route item
 * @param {PaymentMethodData | null} apiItem - API item
 * @returns {boolean} Initial active state
 */
const _resolveInitialIsActive = (
  routePaymentMethod: PaymentMethodData | undefined,
  apiItem: PaymentMethodData | null,
): boolean => {
  if (routePaymentMethod) {
    return routePaymentMethod.status === "active";
  }

  if (apiItem) {
    return apiItem.status === "active";
  }

  return true;
};

/**
 * Create text input change handler.
 * @param {UseFormSetValue<PaymentMethodFormValues>} setValue - Form value setter
 * @param {"name" | "description"} fieldName - Target field
 * @param {FieldError | undefined} error - Field error
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _createFieldChange = (
  setValue: UseFormSetValue<PaymentMethodFormValues>,
  fieldName: "name" | "description",
  error: FieldError | undefined,
): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue(fieldName, event.target.value, { shouldValidate: Boolean(error) });
  }
);

/**
 * Create status toggle handler.
 * @param {UseFormSetValue<PaymentMethodFormValues>} setValue - Form value setter
 * @param {boolean} isActive - Current status
 * @returns {() => void} Toggle handler
 */
const _createStatusToggle = (
  setValue: UseFormSetValue<PaymentMethodFormValues>,
  isActive: boolean,
): (() => void) => (
  (): void => {
    setValue("isActive", !isActive, { shouldDirty: true });
  }
);

/**
 * Create form validation trigger.
 * @param {UseFormTrigger<PaymentMethodFormValues>} trigger - Form trigger
 * @returns {() => Promise<boolean>} Validation function
 */
const _createFormValidator = (
  trigger: UseFormTrigger<PaymentMethodFormValues>,
): (() => Promise<boolean>) => (
  async (): Promise<boolean> => await trigger()
);

/**
 * Synchronize API item with form values.
 * @param {PaymentMethodData | null} apiItem - API item
 * @param {string | null} initializedId - Current initialized ID
 * @param {(id: string | null) => void} setInitializedId - ID setter
 * @param {UseFormSetValue<PaymentMethodFormValues>} setValue - Value setter
 * @returns {void} No return value
 */
const _syncApiItem = (
  apiItem: PaymentMethodData | null,
  initializedId: string | null,
  setInitializedId: (id: string | null) => void,
  setValue: UseFormSetValue<PaymentMethodFormValues>,
): void => {
  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setValue("name", apiItem.name ?? "");
    setValue("description", apiItem.description ?? "");
    setValue("isActive", apiItem.status === "active");
  }
};

/**
 * Hook managing form fields and synchronization.
 * @param {PaymentMethodData | undefined} routePaymentMethod - Route payment method
 * @param {PaymentMethodData | null} apiItem - API fetched payment method
 * @returns {PaymentMethodFormFieldsState} Form fields state
 */
const usePaymentMethodFormFields = (
  routePaymentMethod: PaymentMethodData | undefined,
  apiItem: PaymentMethodData | null,
): PaymentMethodFormFieldsState => {
  const initialName = routePaymentMethod?.name ?? apiItem?.name ?? "";
  const initialDescription = routePaymentMethod?.description ?? apiItem?.description ?? "";
  const initialIsActive = _resolveInitialIsActive(routePaymentMethod, apiItem);
  const { control, formState: { errors }, getValues, register, setValue, trigger } = useForm<PaymentMethodFormValues>({
    defaultValues: { name: initialName, description: initialDescription, isActive: initialIsActive },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  _registerPaymentMethodFields(register);

  const [initializedId, setInitializedId] = useState<string | null>(routePaymentMethod?.id ?? null);
  const name = useWatch({ control, name: "name" });
  const description = useWatch({ control, name: "description" });
  const isActive = useWatch({ control, name: "isActive" });

  _syncApiItem(apiItem, initializedId, setInitializedId, setValue);

  return {
    name,
    description,
    isActive,
    errors,
    isSubmitted: Boolean(errors.name || errors.description),
    register,
    getValues,
    validateForm: _createFormValidator(trigger),
    handleNameChange: _createFieldChange(setValue, "name", errors.name),
    handleDescriptionChange: _createFieldChange(setValue, "description", errors.description),
    handleStatusChange: _createStatusToggle(setValue, isActive),
  };
};

/**
 * Hook managing master payment method form state.
 * @returns {MasterPaymentMethodCreateFormState} Form state
 */
export const useMasterPaymentMethodCreate = (): MasterPaymentMethodCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routePaymentMethod: PaymentMethodData | undefined = location.state?.paymentMethod;

  const { data: detailData, isLoading: isLoadingDetail } = useGetPaymentMethodByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routePaymentMethod),
  });

  const apiItem = _resolvePaymentMethodDetail(detailData);
  const formFields = usePaymentMethodFormFields(routePaymentMethod, apiItem);
  const submission = usePaymentMethodSubmission({ id, isEditMode, ...formFields });
  const isLoadingInitialData = isLoadingDetail && !routePaymentMethod;

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
