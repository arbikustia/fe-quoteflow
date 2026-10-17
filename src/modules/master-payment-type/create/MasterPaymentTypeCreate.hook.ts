import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { validatePaymentTypeFields } from "./MasterPaymentTypeCreate.helpers";
import type { MasterPaymentTypeCreateFormState } from "./MasterPaymentTypeCreate.type";

import type {
  PaymentTypeData,
  PaymentTypeFormFieldsState,
  PaymentTypeSubmissionParams,
  PaymentTypeSubmissionState,
} from "../MasterPaymentType.type";

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
 * Create input change handler.
 * @param {Dispatch<SetStateAction<string>>} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement>) => void} Change handler
 */
const _createInputChangeHandler = (
  setter: Dispatch<SetStateAction<string>>,
): ((event: ChangeEvent<HTMLInputElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement>): void => {
    setter(event.target.value);
  }
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
 * Handle form submission logic for create or update.
 * @param {PaymentTypeSubmissionParams} params - Submission parameters
 * @returns {PaymentTypeSubmissionState} Submission state
 */
const usePaymentTypeSubmission = (
  params: PaymentTypeSubmissionParams,
): PaymentTypeSubmissionState => {
  const { id, isEditMode, name, isActive } = params;
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

    const validationError = validatePaymentTypeFields(name);

    if (validationError) {
      setErrorMessage(validationError);

      return;
    }

    try {
      let response: PaymentTypeCreateResponse;

      if (isEditMode && id) {
        response = await updatePaymentType({ id, name, status: isActive ? 1 : 0 }).unwrap();
      } else {
        response = await createPaymentType({ name, status: 1 }).unwrap();
      }

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      setSuccessMessage(isEditMode ? "Payment type updated successfully." : "Payment type created successfully.");
      navigate("/master-payment-type");
    } catch {
      setErrorMessage(isEditMode ? "Unable to update payment type. Please try again." : "Unable to create payment type. Please try again.");
    }
  };

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
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
  const initialIsActive = routePaymentType ? routePaymentType.status === "active" : (apiItem ? apiItem.status === "active" : true);

  const [name, setName] = useState(initialName);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [initializedId, setInitializedId] = useState<string | null>(routePaymentType?.id ?? null);

  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setName(apiItem.name ?? "");
    setIsActive(apiItem.status === "active");
  }

  const handleNameChange = _createInputChangeHandler(setName);
  const handleStatusChange = (): void => { setIsActive((currentIsActive) => !currentIsActive); };

  return { name, isActive, handleNameChange, handleStatusChange };
};

/**
 * Hook managing master payment type form state.
 * @returns {MasterPaymentTypeCreateFormState} Form state
 */
export const useMasterPaymentTypeCreate = (): MasterPaymentTypeCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
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
