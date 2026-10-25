import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPaginationHandlers } from "@/utils/pagination.helpers";

import type {
  MasterPaymentMethodContainerState,
  MasterPaymentMethodNavigation,
  MasterPaymentMethodPagination,
  PaymentMethodData,
  PaymentMethodListApiState,
} from "./MasterPaymentMethod.type";

import { mapPaymentMethod, useGetPaymentMethodsQuery } from "@/services/master-payment-method.service";

/**
 * Provide payment method navigation.
 * @returns {MasterPaymentMethodNavigation} Navigation handlers
 */
export const useMasterPaymentMethodNavigation = (): MasterPaymentMethodNavigation => {
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
  const goCreate = (): void => { navigate("/master-payment-method/create"); };
  /**
   * Navigate to edit page.
   * @param {PaymentMethodData} paymentMethod - Payment method to edit
   * @returns {void} No return value
   */
  const goEdit = (paymentMethod: PaymentMethodData): void => {
    navigate(`/master-payment-method/edit/${paymentMethod.id}`, { state: { paymentMethod } });
  };


  return { goBack, goCreate, goEdit };
};

/**
 * Derive API payment method list state.
 * @param {ReturnType<typeof useGetPaymentMethodsQuery>} queryResult - Query result
 * @returns {PaymentMethodListApiState} List state
 */
const _derivePaymentMethodListState = (
  queryResult: ReturnType<typeof useGetPaymentMethodsQuery>,
): PaymentMethodListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) return { isLoading: true, errorMessage: null, isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };

  if (error) return { isLoading: false, errorMessage: "Unable to load payment methods.", isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };

  if (!data) return { isLoading: false, errorMessage: "No response received from server.", isMissingData: true, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: data.data.map(mapPaymentMethod),
    totalPages: data.total_pages,
    totalCount: data.total_count,
    hasNext: data.has_next,
    hasPrevious: data.has_previous,
  };
};

/**
 * Provide API-backed payment method pagination.
 * @returns {MasterPaymentMethodPagination} Pagination state
 */
export const useMasterPaymentMethodPagination = (): MasterPaymentMethodPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryResult = useGetPaymentMethodsQuery({ PageNumber: currentPage, PageSize: pageSize, SearchTerm: searchTerm });
  const derived = _derivePaymentMethodListState(queryResult);
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
 * Provide payment method container state.
 * @returns {MasterPaymentMethodContainerState} Container state
 */
export const useMasterPaymentMethodContainerState = (): MasterPaymentMethodContainerState => {
  const pagination = useMasterPaymentMethodPagination();
  const navigation = useMasterPaymentMethodNavigation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  /**
   *
   */
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  /**
   *
   */
  const goDelete = (): void => { setIsMoreOpen(false); };
  /**
   *
   */
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return { ...navigation, pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
