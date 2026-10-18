import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { PaymentTypeData } from "../MasterPaymentType.type";

import type { MasterPaymentTypeDetailMenuState, MasterPaymentTypeDetailState } from "./MasterPaymentTypeDetail.type";

import type { PaymentTypeDetailResponse } from "@/services/master-payment-type.service";
import { mapPaymentType, useGetPaymentTypeByIdQuery } from "@/services/master-payment-type.service";

/**
 * Manage menu state for master payment type detail.
 * @returns {MasterPaymentTypeDetailMenuState} Menu state and handlers
 */
const useDetailMenuState = (): MasterPaymentTypeDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  /**
   * Toggle more menu visibility.
   * @returns {void} No return value
   */
  const toggleMore = (): void => { setIsMoreOpen((prev) => !prev); };
  /**
   * Close more menu.
   * @returns {void} No return value
   */
  const closeMore = (): void => { setIsMoreOpen(false); };
  /**
   * Open delete modal.
   * @returns {void} No return value
   */
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  /**
   * Close delete modal.
   * @returns {void} No return value
   */
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Resolve payment type detail from query response.
 * @param {PaymentTypeDetailResponse | undefined} response - API response
 * @returns {PaymentTypeData | null} Payment type or null
 */
const _resolvePaymentType = (response: PaymentTypeDetailResponse | undefined): PaymentTypeData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const item = Array.isArray(response.data) ? response.data[0] : response.data;

  return item ? mapPaymentType(item) : null;
};

/**
 * Manage payment type detail state.
 * @returns {MasterPaymentTypeDetailState} Detail state
 */
export const useMasterPaymentTypeDetail = (): MasterPaymentTypeDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const menuState = useDetailMenuState();
  const { data: detailResponse } = useGetPaymentTypeByIdQuery(id ?? "", { skip: !id });
  const paymentType: PaymentTypeData | null = _resolvePaymentType(detailResponse);

  /**
   * Navigate back.
   * @returns {void} No return value
   */
  const goBack = (): void => { navigate(-1); };
  /**
   * Navigate to edit page.
   * @returns {void} No return value
   */
  const goEdit = (): void => {
    menuState.closeMore();

    if (paymentType) {
      navigate(`/master-payment-type/edit/${paymentType.id}`, { state: { paymentType } });
    }
  };
  /**
   * Handle deletion action.
   * @returns {void} No return value
   */
  const handleDelete = (): void => {
    menuState.closeDeleteModal();
    navigate("/master-payment-type");
  };

  return { paymentType, goBack, goEdit, handleDelete, ...menuState };
};
