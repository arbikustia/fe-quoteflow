import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { PaymentMethodData } from "../MasterPaymentMethod.type";

import type { MasterPaymentMethodDetailMenuState, MasterPaymentMethodDetailState } from "./MasterPaymentMethodDetail.type";

import type { PaymentMethodDetailResponse } from "@/services/master-payment-method.service";
import { mapPaymentMethod, useGetPaymentMethodByIdQuery } from "@/services/master-payment-method.service";

/**
 * Manage menu state for master payment method detail.
 * @returns {MasterPaymentMethodDetailMenuState} Menu state and handlers
 */
const useDetailMenuState = (): MasterPaymentMethodDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  /**
   *
   */
  const toggleMore = (): void => { setIsMoreOpen((prev) => !prev); };
  /**
   *
   */
  const closeMore = (): void => { setIsMoreOpen(false); };
  /**
   *
   */
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  /**
   *
   */
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Resolve payment method detail from query response.
 * @param {PaymentMethodDetailResponse | undefined} response - API response
 * @returns {PaymentMethodData | null} Payment method or null
 */
const _resolvePaymentMethod = (response: PaymentMethodDetailResponse | undefined): PaymentMethodData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const item = Array.isArray(response.data) ? response.data[0] : response.data;

  return item ? mapPaymentMethod(item) : null;
};

/**
 * Hook for master payment method detail state.
 * @returns {MasterPaymentMethodDetailState} State and handlers
 */
export const useMasterPaymentMethodDetail = (): MasterPaymentMethodDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const { data: detailResponse } = useGetPaymentMethodByIdQuery(id ?? "", { skip: !id });
  const paymentMethod: PaymentMethodData | null = _resolvePaymentMethod(detailResponse);

  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goEdit = (): void => {
    menuState.closeMore();

    if (paymentMethod) {
      navigate(`/master-payment-method/edit/${paymentMethod.id}`, { state: { paymentMethod } });
    }
  };
  /**
   *
   */
  const handleDelete = (): void => {
    menuState.closeDeleteModal();
    navigate("/master-payment-method");
  };

  return { paymentMethod, goBack, goEdit, handleDelete, ...menuState };
};
