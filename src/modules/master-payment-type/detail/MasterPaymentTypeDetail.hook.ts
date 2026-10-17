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
  const toggleMore = (): void => { setIsMoreOpen((prev) => !prev); };
  const closeMore = (): void => { setIsMoreOpen(false); };
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
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
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const { data: detailResponse } = useGetPaymentTypeByIdQuery(id ?? "", { skip: !id });
  const paymentType: PaymentTypeData | null = _resolvePaymentType(detailResponse);

  const goBack = (): void => { navigate(-1); };
  const goEdit = (): void => {
    menuState.closeMore();

    if (paymentType) {
      navigate(`/master-payment-type/edit/${paymentType.id}`, { state: { paymentType } });
    }
  };
  const handleDelete = (): void => {
    menuState.closeDeleteModal();
    navigate("/master-payment-type");
  };

  return { paymentType, goBack, goEdit, handleDelete, ...menuState };
};
