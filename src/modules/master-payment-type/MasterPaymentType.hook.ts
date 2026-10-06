import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_PAYMENT_TYPES } from "../../fixture/master-payment-type";
import { usePagination } from "../../hooks/usePagination";

import type { 
  MasterPaymentTypeContainerState,
  MasterPaymentTypeNavigation,
  PaymentTypeData
} from "./MasterPaymentType.type";

/**
 * Hook for master payment type navigation
 * @returns {MasterPaymentTypeNavigation} navigation functions
 */
export const useMasterPaymentTypeNavigation = (): MasterPaymentTypeNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back
   * @returns {void}
   */
  const goBack = (): void => { navigate(-1); };

  /**
   * Navigate to create page
   * @returns {void}
   */
  const goCreate = (): void => { navigate("/master-payment-type/create"); };

  /**
   * Navigate to edit page
   * @param {PaymentTypeData} p - The payment type data
   * @returns {void}
   */
  const goEdit = (p: PaymentTypeData): void => { navigate(`/master-payment-type/edit/${p.id}`); };

  /**
   * Navigate to detail page
   * @param {PaymentTypeData} p - The payment type data
   * @returns {void}
   */
  const goDetail = (p: PaymentTypeData): void => { navigate(`/master-payment-type/detail/${p.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Hook for master payment type container state
 * @returns {MasterPaymentTypeContainerState} container state
 */
export const useMasterPaymentTypeContainerState = (): MasterPaymentTypeContainerState => {
  const pagination = usePagination(MOCK_PAYMENT_TYPES);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more options dropdown
   * @returns {void}
   */
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };

  /**
   * Handle delete action
   * @returns {void}
   */
  const goDelete = (): void => { setIsMoreOpen(false); };

  /**
   * Close more options dropdown
   * @returns {void}
   */
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
