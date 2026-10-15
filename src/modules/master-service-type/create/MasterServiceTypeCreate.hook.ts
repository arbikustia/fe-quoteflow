/* eslint-disable max-lines-per-function, jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_SERVICE_TYPES } from "@/fixture/master-service-type";

import type { MasterServiceTypeCreateFormState } from "./MasterServiceTypeCreate.type";

import { useCreateServiceTypeMutation } from "@/services/master-service-type.service";

/**
 * Hook for master service type create/edit form.
 * @returns {MasterServiceTypeCreateFormState} Service type create form state
 */
export const useMasterServiceTypeCreateForm = (): MasterServiceTypeCreateFormState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const existing = id ? (MOCK_SERVICE_TYPES.find((c) => c.id === id) ?? null) : null;
  const isEdit = existing !== null;

  const [serviceName, setServiceName] = useState(existing?.name ?? "");
  const [price, setPrice] = useState(existing ? String(existing.price) : "");
  const [isActive, setIsActive] = useState(existing ? existing.isActive : true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createServiceType, { isLoading: isSubmitting }] = useCreateServiceTypeMutation();

  const handleServiceNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setServiceName(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPrice(event.target.value);
  };

  const handleIsActiveChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsActive(event.target.checked);
  };

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await createServiceType({
        name: serviceName,
        price: Number(price) || 0,
        is_active: isActive,
      }).unwrap();

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
    isSubmitting,
    isEdit,
    errorMessage,
    handleServiceNameChange,
    handlePriceChange,
    handleIsActiveChange,
    handleSubmit,
    goBack,
  };
};
