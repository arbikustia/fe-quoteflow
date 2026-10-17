import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { validatePaymentMethodFields } from "./MasterPaymentMethodCreate.helpers";
import type { MasterPaymentMethodCreateFormState } from "./MasterPaymentMethodCreate.type";
import type { PaymentMethodCreateResponse } from "@/services/master-payment-method.service";
import {
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
const _useInputChange = (
  setter: Dispatch<SetStateAction<string>>,
): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setter(event.target.value);
  }
);

/**
 * Handle form submission logic for create or update.
 * @param {string | undefined} id - Payment Method ID
 * @param {boolean} isEditMode - Edit mode flag
 * @param {string} name - Name
 * @param {string} description - Description
 * @param {boolean} isActive - Active status
 * @returns {{ readonly isSubmitting: boolean; readonly errorMessage: string | null; readonly successMessage: string | null; readonly handleSubmit: (event: SyntheticEvent) => Promise<void>; }} Submission state
 */
const _usePaymentMethodSubmission = (
  id: string | undefined,
  isEditMode: boolean,
  name: string,
  description: string,
  isActive: boolean,
): {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleSubmit: (event: SyntheticEvent) => Promise<void>;
} => {
  const navigate = useNavigate();
  const [createPaymentMethod, { isLoading: isCreating }] = useCreatePaymentMethodMutation();
  const [updatePaymentMethod, { isLoading: isUpdating }] = useUpdatePaymentMethodMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

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
        response = await updatePaymentMethod({
          id,
          name,
          description,
          status: isActive ? 1 : 0,
        }).unwrap();
      } else {
        response = await createPaymentMethod({
          name,
          description,
          status: 1,
        }).unwrap();
      }

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      setSuccessMessage(
        isEditMode
          ? "Payment method updated successfully."
          : "Payment method created successfully.",
      );
      navigate("/master-payment-method");
    } catch {
      setErrorMessage(
        isEditMode
          ? "Unable to update payment method. Please try again."
          : "Unable to create payment method. Please try again.",
      );
    }
  };

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
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
  const routePaymentMethod = location.state?.paymentMethod;

  const { data: detailData, isLoading: isLoadingDetail } = useGetPaymentMethodByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routePaymentMethod),
  });

  const apiItem = detailData?.status && detailData.data
    ? (Array.isArray(detailData.data) ? detailData.data[0] : detailData.data)
    : null;

  const initialName = routePaymentMethod?.name ?? apiItem?.name ?? "";
  const initialDescription = routePaymentMethod?.description ?? apiItem?.description ?? "";
  const initialIsActive = routePaymentMethod
    ? routePaymentMethod.status === "active"
    : (apiItem ? apiItem.status === 1 : true);

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [initializedId, setInitializedId] = useState<string | null>(routePaymentMethod?.id ?? null);
  const isLoadingInitialData = isLoadingDetail && !routePaymentMethod;

  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setName(apiItem.name ?? "");
    setDescription(apiItem.description ?? "");
    setIsActive(apiItem.status === 1);
  }

  const handleNameChange = _useInputChange(setName);
  const handleDescriptionChange = _useInputChange(setDescription);
  const handleStatusChange = (): void => {
    setIsActive((currentIsActive) => !currentIsActive);
  };

  const submission = _usePaymentMethodSubmission(id, isEditMode, name, description, isActive);

  const goBack = (): void => {
    navigate(-1);
  };

  return {
    name,
    description,
    isActive,
    isEditMode,
    isLoadingInitialData,
    handleNameChange,
    handleDescriptionChange,
    handleStatusChange,
    goBack,
    ...submission,
  };
};
