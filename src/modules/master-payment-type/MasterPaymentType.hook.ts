import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  MasterPaymentTypeContainerState,
  MasterPaymentTypeNavigation,
  MasterPaymentTypePagination,
  PaymentTypeData,
  PaymentTypeListApiState,
} from "./MasterPaymentType.type";

import { mapPaymentType, useGetPaymentTypesQuery } from "@/services/master-payment-type.service";

/**
 * Provide payment type navigation.
 * @returns {MasterPaymentTypeNavigation} Navigation handlers
 */
export const useMasterPaymentTypeNavigation = (): MasterPaymentTypeNavigation => {
  const navigate = useNavigate();
  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-payment-type/create"); };
  const goEdit = (paymentType: PaymentTypeData): void => {
    navigate(`/master-payment-type/edit/${paymentType.id}`, { state: { paymentType } });
  };
  const goDetail = (paymentType: PaymentTypeData): void => { navigate(`/master-payment-type/detail/${paymentType.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive API payment type list state.
 * @param {ReturnType<typeof useGetPaymentTypesQuery>} queryResult - Query result
 * @returns {PaymentTypeListApiState} List state
 */
const _derivePaymentTypeListState = (
  queryResult: ReturnType<typeof useGetPaymentTypesQuery>,
): PaymentTypeListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) return { isLoading: true, errorMessage: null, isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };
  if (error) return { isLoading: false, errorMessage: "Unable to load payment types.", isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };
  if (!data) return { isLoading: false, errorMessage: "No response received from server.", isMissingData: true, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: data.data.map(mapPaymentType),
    totalPages: data.total_pages,
    totalCount: data.total_count,
    hasNext: data.has_next,
    hasPrevious: data.has_previous,
  };
};

/**
 * Provide API-backed payment type pagination.
 * @returns {MasterPaymentTypePagination} Pagination state
 */
export const useMasterPaymentTypePagination = (): MasterPaymentTypePagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryResult = useGetPaymentTypesQuery({ PageNumber: currentPage, PageSize: pageSize, SearchTerm: searchTerm });
  const derived = _derivePaymentTypeListState(queryResult);
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));
  const nextPage = (): void => { if (derived.hasNext) goToPage(currentPage + 1); };
  const prevPage = (): void => { if (derived.hasPrevious) goToPage(currentPage - 1); };
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  const handleSearchTerm = (value: string): void => { setSearchTerm(value); setCurrentPage(1); };

  return {
    currentPage,
    totalPages: derived.totalPages,
    pageSize,
    paginatedData: derived.paginatedData,
    totalCount: derived.totalCount,
    isLoading: derived.isLoading,
    errorMessage: derived.errorMessage,
    isEmpty: !derived.isLoading && !derived.errorMessage && !derived.isMissingData && derived.paginatedData.length === 0,
    isMissingData: derived.isMissingData,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    setSearchTerm: handleSearchTerm,
  };
};

/**
 * Provide master payment type container state.
 * @returns {MasterPaymentTypeContainerState} Container state
 */
export const useMasterPaymentTypeContainerState = (): MasterPaymentTypeContainerState => {
  const pagination = useMasterPaymentTypePagination();
  const navigation = useMasterPaymentTypeNavigation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const goDelete = (): void => { setIsMoreOpen(false); };
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return { ...navigation, pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
