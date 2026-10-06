import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_PAYMENT_METHODS } from "../../fixture/master-payment-method";
import { usePagination } from "../../hooks/usePagination";

import type { 
  MasterPaymentMethodContainerState,
  MasterPaymentMethodNavigation,
  PaymentMethodData
} from "./MasterPaymentMethod.type";

/**
 * Hook for master payment method navigation
 * @returns {MasterPaymentMethodNavigation} navigation functions
 */
export const useMasterPaymentMethodNavigation = (): MasterPaymentMethodNavigation => {
  const navigate = useNavigate();

  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goCreate = (): void => { navigate("/master-payment-method/create"); };
  /**
   * Navigate to edit page
   * @param {PaymentMethodData} p - The payment method data
   * @returns {void}
   */
  const goEdit = (p: PaymentMethodData): void => { navigate(`/master-payment-method/edit/${p.id}`); };
  /**
   * Navigate to detail page
   * @param {PaymentMethodData} p - The payment method data
   * @returns {void}
   */
  const goDetail = (p: PaymentMethodData): void => { navigate(`/master-payment-method/detail/${p.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Hook for master payment method container state
 * @returns {MasterPaymentMethodContainerState} container state
 */
export const useMasterPaymentMethodContainerState = (): MasterPaymentMethodContainerState => {
  const pagination = usePagination(MOCK_PAYMENT_METHODS);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   *
   */
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };
  /**
   *
   */
  const goDelete = (): void => { setIsMoreOpen(false); };
  /**
   *
   */
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
