import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_PAYMENT_METHODS } from "../../fixture/master-payment-method";
import { usePagination } from "../../hooks/usePagination";

import type { MasterPaymentMethodContainerState, MasterPaymentMethodNavigation, PaymentMethodData } from "./MasterPaymentMethod.type";

/** Hook for payment method navigation. */
export const useMasterPaymentMethodNavigation = (): MasterPaymentMethodNavigation => {
  const navigate = useNavigate();
  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-payment-method/create"); };
  const goEdit = (paymentMethod: PaymentMethodData): void => { navigate(`/master-payment-method/edit/${paymentMethod.id}`); };
  const goDetail = (paymentMethod: PaymentMethodData): void => { navigate(`/master-payment-method/detail/${paymentMethod.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/** Hook for local payment method pagination and search. */
export const useMasterPaymentMethodPagination = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = useMemo(() => MOCK_PAYMENT_METHODS.filter((paymentMethod) => `${paymentMethod.name} ${paymentMethod.description}`.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);
  const pagination = usePagination(filteredData, 10);

  const handleSearchTerm = (value: string): void => { setSearchTerm(value); };

  return { ...pagination, setSearchTerm: handleSearchTerm, isEmpty: filteredData.length === 0 };
};

/** Hook for payment method container state. */
export const useMasterPaymentMethodContainerState = (): MasterPaymentMethodContainerState => {
  const pagination = useMasterPaymentMethodPagination();
  const navigation = useMasterPaymentMethodNavigation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const goDelete = (): void => { setIsMoreOpen(false); };
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return { ...navigation, pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
