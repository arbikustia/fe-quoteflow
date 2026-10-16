import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_PAYMENT_TYPES } from "../../fixture/master-payment-type";
import { usePagination } from "../../hooks/usePagination";

import type { MasterPaymentTypeContainerState, MasterPaymentTypeNavigation, MasterPaymentTypePagination, PaymentTypeData } from "./MasterPaymentType.type";

/** Hook for master payment type navigation. */
export const useMasterPaymentTypeNavigation = (): MasterPaymentTypeNavigation => {
  const navigate = useNavigate();
  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-payment-type/create"); };
  const goEdit = (paymentType: PaymentTypeData): void => { navigate(`/master-payment-type/edit/${paymentType.id}`); };
  const goDetail = (paymentType: PaymentTypeData): void => { navigate(`/master-payment-type/detail/${paymentType.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/** Hook for local payment type search and pagination. */
export const useMasterPaymentTypePagination = (): MasterPaymentTypePagination => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = useMemo(() => MOCK_PAYMENT_TYPES.filter((paymentType) => paymentType.name.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);
  const pagination = usePagination(filteredData, 10);
  const handleSearchTerm = (value: string): void => { setSearchTerm(value); };

  return { ...pagination, setSearchTerm: handleSearchTerm, isEmpty: filteredData.length === 0 };
};

/** Hook for master payment type container state. */
export const useMasterPaymentTypeContainerState = (): MasterPaymentTypeContainerState => {
  const pagination = useMasterPaymentTypePagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const goDelete = (): void => { setIsMoreOpen(false); };
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
