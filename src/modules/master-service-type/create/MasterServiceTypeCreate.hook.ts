/* eslint-disable max-lines-per-function, jsdoc/require-jsdoc */
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { MasterServiceTypeCreateFormState } from "./MasterServiceTypeCreate.type";

import { useCreateServiceTypeMutation, useUpdateServiceTypeMutation } from "@/services/master-service-type.service";

/**
 * Hook for master service type create/edit form.
 * @returns {MasterServiceTypeCreateFormState} Service type create form state
 */
export const useMasterServiceTypeCreateForm = (): MasterServiceTypeCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id: string }>();
  const isEditMode = Boolean(id);
  const routeServiceType = location.state?.serviceType;

  const [serviceName, setServiceName] = useState(routeServiceType?.name ?? "");
  const [price, setPrice] = useState(routeServiceType ? String(routeServiceType.price) : "");
  const [isActive, setIsActive] = useState(routeServiceType ? routeServiceType.status === "active" : true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createServiceType, { isLoading: isCreating }] = useCreateServiceTypeMutation();
  const [updateServiceType, { isLoading: isUpdating }] = useUpdateServiceTypeMutation();
  const isSubmitting = isCreating || isUpdating;

  const handleServiceNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setServiceName(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPrice(event.target.value);
  };

  const handleStatusChange = (): void => {
    setIsActive((currentIsActive) => !currentIsActive);
  };

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const payload = {
        name: serviceName,
        price: Number(price) || 0,
        status: isEditMode ? (isActive ? 1 : 0) : 1,
      };

      let response;

      if (isEditMode && id) {
        response = await updateServiceType({ ...payload, id }).unwrap();
      } else {
        response = await createServiceType(payload).unwrap();
      }

      if (!response.status) {
        const message = Array.isArray(response.messages)
          ? response.messages.join(" ")
          : (response.messages ?? "Failed to save service type.");

        setErrorMessage(message);

        return;
      }

      navigate("/master-service-type");
    } catch {
      setErrorMessage("Unable to save service type. Please try again.");
    }
  };

  const goBack = (): void => {
    navigate(-1);
  };

  return {
    serviceName,
    price,
    isActive,
    isEditMode,
    isSubmitting,
    errorMessage,
    handleServiceNameChange,
    handlePriceChange,
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};
