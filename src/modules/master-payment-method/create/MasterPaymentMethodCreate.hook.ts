/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_PAYMENT_METHODS } from "@/fixture/master-payment-method";

import type { MasterPaymentMethodCreateState } from "./MasterPaymentMethodCreate.type";

/**
 * Hook for payment method create state.
 * @returns {MasterPaymentMethodCreateState} State and handlers
 */
export const useMasterPaymentMethodCreate = (): MasterPaymentMethodCreateState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const existing = id ? MOCK_PAYMENT_METHODS.find((c) => c.id === id) : null;
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => { setName(e.target.value); };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => { setDescription(e.target.value); };
  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    navigate("/master-payment-method");
  };
  const goBack = (): void => { navigate(-1); };

  return { name, description, isEdit: Boolean(existing), handleNameChange, handleDescriptionChange, handleSubmit, goBack };
};
