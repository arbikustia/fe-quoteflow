/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_PAYMENT_TYPES } from "@/fixture/master-payment-type";

import type { MasterPaymentTypeCreateState } from "./MasterPaymentTypeCreate.type";

/**
 * Manage payment type create state.
 * @returns {MasterPaymentTypeCreateState} Form state
 */
export const useMasterPaymentTypeCreate = (): MasterPaymentTypeCreateState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const existing = id ? MOCK_PAYMENT_TYPES.find((item) => item.id === id) : null;
  const [name, setName] = useState(existing?.name ?? "");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };
  const handleSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    navigate("/master-payment-type");
  };
  const goBack = (): void => {
    navigate(-1);
  };

  return { name, isEdit: Boolean(existing), handleNameChange, handleSubmit, goBack };
};
