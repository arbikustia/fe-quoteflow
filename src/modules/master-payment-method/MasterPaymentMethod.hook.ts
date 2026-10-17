import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goCreate = (): void => { navigate("/master-payment-method/create"); };
  /**
   *
   * @param paymentMethod
   */
  const goEdit = (paymentMethod: PaymentMethodData): void => {
    navigate(`/master-payment-method/edit/${paymentMethod.id}`, { state: { paymentMethod } });
  };
  /**
   *
   * @param paymentMethod
   */
  const goDetail = (paymentMethod: PaymentMethodData): void => { navigate(`/master-payment-method/detail/${paymentMethod.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
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
  /**
   *
   * @param page
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));
  /**
   *
   */
  const nextPage = (): void => { if (derived.hasNext) goToPage(currentPage + 1); };
  /**
   *
   */
  const prevPage = (): void => { if (derived.hasPrevious) goToPage(currentPage - 1); };
  /**
   *
   * @param size
   */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  /**
   *
   * @param value
   */
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
