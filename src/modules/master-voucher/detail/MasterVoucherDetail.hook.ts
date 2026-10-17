import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { VoucherData, VoucherDetailResponse } from "../MasterVoucher.type";

import type { MasterVoucherDetailMenuState, MasterVoucherDetailState } from "./MasterVoucherDetail.type";

import { mapVoucher, useGetVoucherByIdQuery } from "@/services/master-voucher.service";

/**
 * Manage menu state for master voucher detail.
 * @returns {MasterVoucherDetailMenuState} Menu state and handlers
 */
const useDetailMenuState = (): MasterVoucherDetailMenuState => {
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
 * Resolve detail response into a voucher.
 * @param {VoucherDetailResponse | undefined} response - Detail response
 * @returns {VoucherData | null} Voucher or null
 */
const _resolveVoucher = (response: VoucherDetailResponse | undefined): VoucherData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const item = Array.isArray(response.data) ? response.data[0] : response.data;

  return item ? mapVoucher(item) : null;
};

/**
 * Manage master voucher detail state.
 * @returns {MasterVoucherDetailState} Detail state
 */
export const useMasterVoucherDetail = (): MasterVoucherDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const { data: response } = useGetVoucherByIdQuery(id ?? "", { skip: !id });
  const voucher = _resolveVoucher(response);
  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goEdit = (): void => {
    menuState.closeMore();

    if (voucher) {
      navigate(`/master-voucher/edit/${voucher.id}`, { state: { voucher } });
    }
  };
  /**
   *
   */
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-voucher"); };

  return { voucher, goBack, goEdit, handleDelete, ...menuState };
};
