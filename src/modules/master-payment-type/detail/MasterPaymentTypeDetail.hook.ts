/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_PAYMENT_TYPES } from "@/fixture/master-payment-type";

import type { PaymentTypeData } from "../MasterPaymentType.type";

import type { MasterPaymentTypeDetailMenuState, MasterPaymentTypeDetailState } from "./MasterPaymentTypeDetail.type";

const useDetailMenuState = (): MasterPaymentTypeDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((prev) => !prev); };
  const closeMore = (): void => { setIsMoreOpen(false); };
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Manage payment type detail state.
 * @returns {MasterPaymentTypeDetailState} Detail state
 */
export const useMasterPaymentTypeDetail = (): MasterPaymentTypeDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const paymentType: PaymentTypeData | null = MOCK_PAYMENT_TYPES.find((item) => item.id === id) ?? null;
  const goBack = (): void => { navigate(-1); };
  const goEdit = (): void => { menuState.closeMore();

 if (paymentType) navigate(`/master-payment-type/edit/${paymentType.id}`); };
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-payment-type"); };

  return { paymentType, goBack, goEdit, handleDelete, ...menuState };
};
