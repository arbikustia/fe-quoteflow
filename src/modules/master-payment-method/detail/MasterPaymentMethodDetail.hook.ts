/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_PAYMENT_METHODS } from "@/fixture/master-payment-method";

import type { PaymentMethodData } from "../MasterPaymentMethod.type";

import type { MasterPaymentMethodDetailMenuState, MasterPaymentMethodDetailState } from "./MasterPaymentMethodDetail.type";

const useDetailMenuState = (): MasterPaymentMethodDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((prev) => !prev); };
  const closeMore = (): void => { setIsMoreOpen(false); };
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Hook for master payment method detail state.
 * @returns {MasterPaymentMethodDetailState} State and handlers
 */
export const useMasterPaymentMethodDetail = (): MasterPaymentMethodDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const paymentMethod: PaymentMethodData | null = MOCK_PAYMENT_METHODS.find((item) => item.id === id) ?? null;
  const goBack = (): void => { navigate(-1); };
  const goEdit = (): void => { menuState.closeMore();

 if (paymentMethod) navigate(`/master-payment-method/edit/${paymentMethod.id}`); };
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-payment-method"); };

  return { paymentMethod, goBack, goEdit, handleDelete, ...menuState };
};
