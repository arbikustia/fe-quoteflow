import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ApiMessages } from "../../types/api.type";

import { _mapPaymentMethod, useGetPaymentMethodsQuery } from "./MasterPaymentMethod.api";
import type {
  MasterPaymentMethodContainerState,
  MasterPaymentMethodNavigation,
  MasterPaymentMethodPagination,
  PaymentMethodData,
  PaymentMethodListApiState,
  PaymentMethodListResponse,
} from "./MasterPaymentMethod.type";

/**
 * Hook for master payment method navigation.
 * @returns {MasterPaymentMethodNavigation} Navigation functions
 */
export const useMasterPaymentMethodNavigation = (): MasterPaymentMethodNavigation => {
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
  const goCreate = (): void => { navigate("/master-payment-method/create"); };

  /**
   * Navigate to edit page
   * @param {PaymentMethodData} paymentMethod - The payment method data
   * @returns {void}
   */
  const goEdit = (paymentMethod: PaymentMethodData): void => {
    navigate(`/master-payment-method/edit/${paymentMethod.id}`);
  };

  /**
   * Navigate to detail page
   * @param {PaymentMethodData} paymentMethod - The payment method data
   * @returns {void}
   */
  const goDetail = (paymentMethod: PaymentMethodData): void => {
    navigate(`/master-payment-method/detail/${paymentMethod.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive paginated state from API response envelope.
 * Handles loading, HTTP error, envelope status false, missing data explicitly.
 * @param {ReturnType<typeof useGetPaymentMethodsQuery>} queryResult - RTK Query result
 * @returns {PaymentMethodListApiState} Derived state
 */
const _derivePaymentMethodListState = (
  queryResult: ReturnType<typeof useGetPaymentMethodsQuery>,
): PaymentMethodListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createLoadingState();
  }

  if (error) {
    return _createErrorState();
  }

  const response: PaymentMethodListResponse | undefined = data;

  if (!response) {
    return _createMissingResponseState();
  }

  if (!response.status) {
    return _createEnvelopeErrorState(response.messages);
  }

  const paymentMethodList = response.data;

  if (!paymentMethodList) {
    return _createMissingPayloadState();
  }

  const paymentMethods = paymentMethodList.data.map(_mapPaymentMethod);

  return _createSuccessState(paymentMethods, paymentMethodList.total_pages, paymentMethodList.total_count);
};

/**
 * Create loading state.
 * @returns {PaymentMethodListApiState} Loading state
 */
const _createLoadingState = (): PaymentMethodListApiState => ({
  isLoading: true,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create HTTP error state.
 * @returns {PaymentMethodListApiState} Error state
 */
const _createErrorState = (): PaymentMethodListApiState => ({
  isLoading: false,
  errorMessage: "Unable to load payment methods.",
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create API envelope error state.
 * @param {ApiMessages} messages - API error messages
 * @returns {PaymentMethodListApiState} Envelope error state
 */
const _createEnvelopeErrorState = (messages: ApiMessages): PaymentMethodListApiState => ({
  isLoading: false,
  errorMessage: Array.isArray(messages) ? messages.join(" ") : messages ?? "Unable to load payment methods.",
  isEnvelopeError: true,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {PaymentMethodListApiState} Missing response state
 */
const _createMissingResponseState = (): PaymentMethodListApiState => ({
  isLoading: false,
  errorMessage: "No response received from server.",
  isEnvelopeError: false,
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing payload state.
 * @returns {PaymentMethodListApiState} Missing payload state
 */
const _createMissingPayloadState = (): PaymentMethodListApiState => ({
  isLoading: false,
  errorMessage: "Response is missing data payload.",
  isEnvelopeError: false,
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create success state.
 * @param {PaymentMethodData[]} paymentMethods - Mapped payment method data
 * @param {number} totalPages - Total pages from API
 * @param {number} totalCount - Total count from API
 * @returns {PaymentMethodListApiState} Success state
 */
const _createSuccessState = (
  paymentMethods: PaymentMethodData[],
  totalPages: number,
  totalCount: number,
): PaymentMethodListApiState => ({
  isLoading: false,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: paymentMethods,
  totalPages,
  totalCount,
});

/**
 * Hook for API-backed master payment method pagination.
 * @returns {MasterPaymentMethodPagination} Payment method pagination state and handlers
 */
// eslint-disable-next-line max-lines-per-function
export const useMasterPaymentMethodPagination = (): MasterPaymentMethodPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Fetch payment methods with current pagination and search
   */
  const queryResult = useGetPaymentMethodsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _derivePaymentMethodListState(queryResult);

  /**
   * Handle page change
   * @param {number} page - The new page number
   * @returns {void}
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));

  /**
   * Handle next page
   * @returns {void}
   */
  const nextPage = (): void => {
    if (
      !derived.isLoading &&
      !derived.errorMessage &&
      derived.paginatedData.length > 0 &&
      queryResult.data?.has_next
    ) {
      goToPage(currentPage + 1);
    }
  };

  /**
   * Handle prev page
   * @returns {void}
   */
  const prevPage = (): void => {
    if (
      !derived.isLoading &&
      !derived.errorMessage &&
      derived.paginatedData.length > 0 &&
      queryResult.data?.has_previous
    ) {
      goToPage(currentPage - 1);
    }
  };

  /**
   * Handle page size change
   * @param {number} size - The new page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };

  /**
   * Handle search term change
   * @param {string} value - The search term
   * @returns {void}
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
 * Hook for master payment method container state.
 * @returns {MasterPaymentMethodContainerState} Container state and handlers
 */
export const useMasterPaymentMethodContainerState = (): MasterPaymentMethodContainerState => {
  const pagination = useMasterPaymentMethodPagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more menu
   * @returns {void}
   */
  const toggleMore = (): void => setIsMoreOpen((previous) => !previous);

  /**
   * Close more menu
   * @returns {void}
   */
  const handleCloseMore = (): void => setIsMoreOpen(false);

  /**
   * Handle delete action
   * @returns {void}
   */
  const goDelete = (): void => handleCloseMore();

  return { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete };
};
