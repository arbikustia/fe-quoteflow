import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type {
  PaymentMethodData,
  PaymentMethodFormFieldsState,
  PaymentMethodSubmissionParams,
  PaymentMethodSubmissionState,
} from "../MasterPaymentMethod.type";

import { validatePaymentMethodFields } from "./MasterPaymentMethodCreate.helpers";
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
 * Hook managing input change handlers.
 * @param {Dispatch<SetStateAction<string>>} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _createInputChangeHandler = (
  setter: Dispatch<SetStateAction<string>>,
): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setter(event.target.value);
  }
);

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
 * Handle form submission logic for create or update.
 * @param {PaymentMethodSubmissionParams} params - Submission parameters
 * @returns {PaymentMethodSubmissionState} Submission state
 */
const usePaymentMethodSubmission = (
  params: PaymentMethodSubmissionParams,
): PaymentMethodSubmissionState => {
  const { id, isEditMode, name, description, isActive } = params;
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

    const validationError = validatePaymentMethodFields(name, description);

    if (validationError) {
      setErrorMessage(validationError);

      return;
    }

    try {
      let response: PaymentMethodCreateResponse;

      if (isEditMode && id) {
        response = await updatePaymentMethod({ id, name, description, status: isActive ? 1 : 0 }).unwrap();
      } else {
        response = await createPaymentMethod({ name, description, status: 1 }).unwrap();
      }

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      setSuccessMessage(isEditMode ? "Payment method updated successfully." : "Payment method created successfully.");
      navigate("/master-payment-method");
    } catch {
      setErrorMessage(isEditMode ? "Unable to update payment method. Please try again." : "Unable to create payment method. Please try again.");
    }
  };

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
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
  const initialIsActive = routePaymentMethod ? routePaymentMethod.status === "active" : (apiItem ? apiItem.status === "active" : true);

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [initializedId, setInitializedId] = useState<string | null>(routePaymentMethod?.id ?? null);

  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setName(apiItem.name ?? "");
    setDescription(apiItem.description ?? "");
    setIsActive(apiItem.status === "active");
  }

  const handleNameChange = _createInputChangeHandler(setName);
  const handleDescriptionChange = _createInputChangeHandler(setDescription);
  /**
   *
   */
  const handleStatusChange = (): void => { setIsActive((currentIsActive) => !currentIsActive); };

  return { name, description, isActive, handleNameChange, handleDescriptionChange, handleStatusChange };
};

/**
 * Hook managing master payment method form state.
 * @returns {MasterPaymentMethodCreateFormState} Form state
 */
export const useMasterPaymentMethodCreate = (): MasterPaymentMethodCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
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
