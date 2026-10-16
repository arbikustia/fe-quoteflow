import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { MasterPaymentTypeCreateFormState } from "./MasterPaymentTypeCreate.type";
import type { PaymentTypeCreateResponse } from "@/services/master-payment-type.service";
import {
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
 * Hook managing input change handlers.
 * @param {Dispatch<SetStateAction<string>>} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement>) => void} Change handler
 */
const _useInputChange = (
  setter: Dispatch<SetStateAction<string>>,
): ((event: ChangeEvent<HTMLInputElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement>): void => {
    setter(event.target.value);
  }
);

/**
 * Handle form submission logic for create or update.
 * @param {string | undefined} id - Payment Type ID
 * @param {boolean} isEditMode - Edit mode flag
 * @param {string} name - Name
 * @param {boolean} isActive - Active status
 * @returns {{ readonly isSubmitting: boolean; readonly errorMessage: string | null; readonly successMessage: string | null; readonly handleSubmit: (event: SyntheticEvent) => Promise<void>; }} Submission state
 */
const _usePaymentTypeSubmission = (
  id: string | undefined,
  isEditMode: boolean,
  name: string,
  isActive: boolean,
): {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleSubmit: (event: SyntheticEvent) => Promise<void>;
} => {
  const navigate = useNavigate();
  const [createPaymentType, { isLoading: isCreating }] = useCreatePaymentTypeMutation();
  const [updatePaymentType, { isLoading: isUpdating }] = useUpdatePaymentTypeMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let response: PaymentTypeCreateResponse;

      if (isEditMode && id) {
        response = await updatePaymentType({
          id,
          name,
          status: isActive ? 1 : 0,
        }).unwrap();
      } else {
        response = await createPaymentType({
          name,
          status: 1,
        }).unwrap();
      }

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      setSuccessMessage(
        isEditMode
          ? "Payment type updated successfully."
          : "Payment type created successfully.",
      );
      navigate("/master-payment-type");
    } catch {
      setErrorMessage(
        isEditMode
          ? "Unable to update payment type. Please try again."
          : "Unable to create payment type. Please try again.",
      );
    }
  };

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
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
  const routePaymentType = location.state?.paymentType;

  const { data: detailData, isLoading: isLoadingDetail } = useGetPaymentTypeByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routePaymentType),
  });

  const apiItem = detailData?.status && detailData.data
    ? (Array.isArray(detailData.data) ? detailData.data[0] : detailData.data)
    : null;

  const initialName = routePaymentType?.name ?? apiItem?.name ?? "";
  const initialIsActive = routePaymentType
    ? routePaymentType.status === "active"
    : (apiItem ? apiItem.status === 1 : true);

  const [name, setName] = useState(initialName);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [initializedId, setInitializedId] = useState<string | null>(routePaymentType?.id ?? null);
  const isLoadingInitialData = isLoadingDetail && !routePaymentType;

  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setName(apiItem.name ?? "");
    setIsActive(apiItem.status === 1);
  }

  const handleNameChange = _useInputChange(setName);
  const handleStatusChange = (): void => {
    setIsActive((currentIsActive) => !currentIsActive);
  };

  const submission = _usePaymentTypeSubmission(id, isEditMode, name, isActive);

  const goBack = (): void => {
    navigate(-1);
  };

  return {
    name,
    isActive,
    isEditMode,
    isLoadingInitialData,
    handleNameChange,
    handleStatusChange,
    goBack,
    ...submission,
  };
};
