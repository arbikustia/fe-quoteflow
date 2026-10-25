import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPaginationHandlers } from "@/utils/pagination.helpers";

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
  /**
   * Navigate to previous page.
   * @returns {void} No return value
   */
  const goBack = (): void => { navigate(-1); };
  /**
   * Navigate to create page.
   * @returns {void} No return value
   */
  const goCreate = (): void => { navigate("/master-payment-type/create"); };
  /**
   * Navigate to edit page.
   * @param {PaymentTypeData} paymentType - Payment type to edit
   * @returns {void} No return value
   */
  const goEdit = (paymentType: PaymentTypeData): void => {
    navigate(`/master-payment-type/edit/${paymentType.id}`, { state: { paymentType } });
  };

  return { goBack, goCreate, goEdit };
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
  const handlers = createPaginationHandlers({
    currentPage,
    totalPages: derived.totalPages,
    hasNext: derived.hasNext,
    hasPrevious: derived.hasPrevious,
    canPaginate: !derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
  });

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
    goToPage: handlers.goToPage,
    nextPage: handlers.nextPage,
    prevPage: handlers.prevPage,
    changePageSize: handlers.changePageSize,
    setSearchTerm: handlers.handleSearchTerm,
  };
};

/**
 * Provide master payment type container state.
 * @returns {MasterPaymentTypeContainerState} Container state
 */
export const useMasterPaymentTypeContainerState = (): MasterPaymentTypeContainerState => {
  const pagination = useMasterPaymentTypePagination();
  const navigation = useMasterPaymentTypeNavigation();

  return { ...navigation, pagination };
};
