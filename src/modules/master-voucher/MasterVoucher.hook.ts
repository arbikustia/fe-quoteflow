import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_VOUCHERS } from "../../fixture/master-voucher";
import { usePagination } from "../../hooks/usePagination";

import type { MasterVoucherContainerState, MasterVoucherNavigation,VoucherData } from "./MasterVoucher.type";

/**
 * Navigation hook
 * @returns {MasterVoucherNavigation} navigation state
 */
export const useMasterVoucherNavigation = (): MasterVoucherNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back
   * @returns {void} void
   */
  const goBack = (): void => {
    navigate(-1);
  };

  /**
   * Navigate to create
   * @returns {void} void
   */
  const goCreate = (): void => {
    navigate("/master-voucher/create");
  };

  /**
   * Navigate to edit
   * @param {VoucherData} c - role data
   * @returns {void} void
   */
  const goEdit = (c: VoucherData): void => {
    navigate(`/master-voucher/edit/${c.id}`);
  };

  /**
   * Navigate to detail
   * @param {VoucherData} c - role data
   * @returns {void} void
   */
  const goDetail = (c: VoucherData): void => {
    navigate(`/master-voucher/detail/${c.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Container state hook
 * @returns {MasterVoucherContainerState} container state
 */
export const useMasterVoucherContainerState = (): MasterVoucherContainerState => {
  const navigation = useMasterVoucherNavigation();
  const pagination = usePagination(MOCK_VOUCHERS);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more
   * @returns {void} void
   */
  const toggleMore = (): void => {
    setIsMoreOpen(!isMoreOpen);
  };

  /**
   * Handle delete
   * @returns {void} void
   */
  const goDelete = (): void => {
    setIsMoreOpen(false);
  };

  /**
   * Close more menu
   * @returns {void} void
   */
  const handleCloseMore = (): void => {
    setIsMoreOpen(false);
  };

  return {
    ...navigation,
    pagination,
    isMoreOpen,
    toggleMore,
    goDelete,
    handleCloseMore,
  };
};
