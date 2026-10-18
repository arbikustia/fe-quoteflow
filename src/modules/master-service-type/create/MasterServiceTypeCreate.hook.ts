import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { ServiceTypeData } from "../MasterServiceType.type";

import {
  formatServiceTypeMessages,
  parseRupiahInput,
  resolveServiceTypeStatus,
} from "./MasterServiceTypeCreate.helpers";
import type {
  MasterServiceTypeCreateFormState,
  ServiceTypeFormFieldsState,
  ServiceTypeSubmissionValues,
} from "./MasterServiceTypeCreate.type";

import {
  useCreateServiceTypeMutation,
  useUpdateServiceTypeMutation,
} from "@/services/master-service-type.service";

/**
 * Send create or update mutation for service type.
 * @param {ServiceTypeSubmissionValues} params - Submission params
 * @param {ReturnType<typeof useCreateServiceTypeMutation>[0]} createServiceType - Create trigger
 * @param {ReturnType<typeof useUpdateServiceTypeMutation>[0]} updateServiceType - Update trigger
 * @returns {Promise<{ status: boolean; messages: string[] | string | null }>} Mutation response
 */
const _sendServiceTypeMutation = (
  params: ServiceTypeSubmissionValues,
  createServiceType: ReturnType<typeof useCreateServiceTypeMutation>[0],
  updateServiceType: ReturnType<typeof useUpdateServiceTypeMutation>[0],
): Promise<{ status: boolean; messages: string[] | string | null }> => {
  const { id, isEditMode, serviceName, price, isActive } = params;
  const payload = {
    name: serviceName,
    price: Number(price) || 0,
    status: resolveServiceTypeStatus(isEditMode, isActive),
  };

  return isEditMode && id
    ? updateServiceType({ ...payload, id }).unwrap()
    : createServiceType(payload).unwrap();
};

/**
 * Execute form submission.
 * @param {ServiceTypeSubmissionValues} params - Submission values
 * @param {ReturnType<typeof useCreateServiceTypeMutation>[0]} createServiceType - Create trigger
 * @param {ReturnType<typeof useUpdateServiceTypeMutation>[0]} updateServiceType - Update trigger
 * @param {object} handlers - Handlers
 * @param {(msg: string | null) => void} handlers.setErrorMessage - Error setter
 * @param {(path: string) => void} handlers.navigate - Navigator
 * @returns {Promise<void>} Async result
 */
const _executeSubmit = async (
  params: ServiceTypeSubmissionValues,
  createServiceType: ReturnType<typeof useCreateServiceTypeMutation>[0],
  updateServiceType: ReturnType<typeof useUpdateServiceTypeMutation>[0],
  handlers: {
    setErrorMessage: (msg: string | null) => void;
    navigate: (path: string) => void;
  },
): Promise<void> => {
  try {
    const response = await _sendServiceTypeMutation(
      params,
      createServiceType,
      updateServiceType,
    );

    if (!response.status) {
      handlers.setErrorMessage(formatServiceTypeMessages(response.messages));

      return;
    }

    handlers.navigate("/master-service-type");
  } catch {
    handlers.setErrorMessage("Unable to save service type. Please try again.");
  }
};

/**
 * Manage service type form field states.
 * @param {ServiceTypeData | undefined} routeServiceType - Route state item
 * @returns {ServiceTypeFormFieldsState} Field states and handlers
 */
const useServiceTypeFields = (
  routeServiceType: ServiceTypeData | undefined,
): ServiceTypeFormFieldsState => {
  const [serviceName, setServiceName] = useState(routeServiceType?.name ?? "");
  const [price, setPrice] = useState(routeServiceType ? String(routeServiceType.price) : "");
  const [isActive, setIsActive] = useState(routeServiceType ? routeServiceType.status === "active" : true);

  /**
   * Handle service name change.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void} No return value
   */
  const handleServiceNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setServiceName(event.target.value);
  };

  /**
   * Handle service price change.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void} No return value
   */
  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPrice(parseRupiahInput(event.target.value));
  };

  /**
   * Handle active status toggle.
   * @returns {void} No return value
   */
  const handleStatusChange = (): void => {
    setIsActive((currentIsActive) => !currentIsActive);
  };

  return {
    serviceName,
    price,
    isActive,
    handleServiceNameChange,
    handlePriceChange,
    handleStatusChange,
  };
};

/**
 * Hook for master service type create/edit form.
 * @returns {MasterServiceTypeCreateFormState} Service type create form state
 */
export const useMasterServiceTypeCreateForm = (): MasterServiceTypeCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id: string }>();
  const isEditMode = Boolean(id);
  const routeServiceType: ServiceTypeData | undefined = location.state?.serviceType;

  const fields = useServiceTypeFields(routeServiceType);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createServiceType, { isLoading: isCreating }] = useCreateServiceTypeMutation();
  const [updateServiceType, { isLoading: isUpdating }] = useUpdateServiceTypeMutation();

  /**
   * Handle form submission.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Async result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    await _executeSubmit(
      { id, isEditMode, ...fields },
      createServiceType,
      updateServiceType,
      { setErrorMessage, navigate },
    );
  };

  /**
   * Navigate back.
   * @returns {void} No return value
   */
  const goBack = (): void => {
    navigate(-1);
  };

  return {
    ...fields,
    isEditMode,
    isSubmitting: isCreating || isUpdating,
    errorMessage,
    handleSubmit,
    goBack,
  };
};
