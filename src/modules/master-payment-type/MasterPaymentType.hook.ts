import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { _mapPaymentType, useCreatePaymentTypeMutation, useGetPaymentTypesQuery } from "./MasterPaymentType.api";
import type {
  MasterPaymentTypeContainerState,
  MasterPaymentTypeCreateFormState,
  MasterPaymentTypeNavigation,
  MasterPaymentTypePagination,
  PaymentTypeData,
  PaymentTypeListApiState,
  PaymentTypeListResponse,
} from "./MasterPaymentType.type";

/**
 * Hook for master payment type navigation.
 * @returns {MasterPaymentTypeNavigation} Navigation functions
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
   * @param {PaymentTypeData} paymentType - The payment type data
   * @returns {void}
   */
  const goEdit = (paymentType: PaymentTypeData): void => { navigate(`/master-payment-type/edit/${paymentType.id}`); };
  /**
   * Navigate to detail page
   * @param {PaymentTypeData} paymentType - The payment type data
   * @returns {void}
   */
  const goDetail = (paymentType: PaymentTypeData): void => { navigate(`/master-payment-type/detail/${paymentType.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive paginated state from API response envelope.
 * Handles loading, HTTP error, envelope status false, missing data explicitly.
 * @param {ReturnType<typeof useGetPaymentTypesQuery>} queryResult - RTK Query result
 * @returns {PaymentTypeListApiState} Derived state
 */
const _derivePaymentTypeListState = (queryResult: ReturnType<typeof useGetPaymentTypesQuery>): PaymentTypeListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createLoadingState();
  }

  if (error) {
    return _createErrorState();
  }

  const response: PaymentTypeListResponse | undefined = data;

  if (!response) {
    return _createMissingResponseState();
  }

  if (!response.status) {
    return _createEnvelopeErrorState(response.messages);
  }

  const paymentTypePage = response.data;

  if (!paymentTypePage) {
    return _createMissingPayloadState();
  }

  const paymentTypes = paymentTypePage.data.map(_mapPaymentType);

  return _createSuccessState(paymentTypes, paymentTypePage.total_pages, paymentTypePage.total_count);
};

/**
 * Create loading state.
 * @returns {PaymentTypeListApiState} Loading state
 */
const _createLoadingState = (): PaymentTypeListApiState => ({
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
 * @returns {PaymentTypeListApiState} Error state
 */
const _createErrorState = (): PaymentTypeListApiState => ({
  isLoading: false,
  errorMessage: "Unable to load payment types.",
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {PaymentTypeListApiState} Missing response state
 */
const _createMissingResponseState = (): PaymentTypeListApiState => ({
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
 * @returns {PaymentTypeListApiState} Missing payload state
 */
const _createMissingPayloadState = (): PaymentTypeListApiState => ({
  isLoading: false,
  errorMessage: "Response is missing data payload.",
  isEnvelopeError: false,
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create API envelope error state.
 * @param {ApiMessages} messages - API error messages
 * @returns {PaymentTypeListApiState} Envelope error state
 */
const _createEnvelopeErrorState = (messages: PaymentTypeListResponse["messages"]): PaymentTypeListApiState => ({
  isLoading: false,
  errorMessage: typeof messages === "string" ? messages : messages?.[0] ?? "Unable to load payment types.",
  isEnvelopeError: true,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create success state.
 * @param {PaymentTypeData[]} paymentTypes - Mapped payment type data
 * @param {number} totalPages - Total pages from API
 * @param {number} totalCount - Total count from API
 * @returns {PaymentTypeListApiState} Success state
 */
const _createSuccessState = (paymentTypes: PaymentTypeData[], totalPages: number, totalCount: number): PaymentTypeListApiState => ({
  isLoading: false,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: paymentTypes,
  totalPages,
  totalCount,
});

/**
 * Hook for API-backed master payment type pagination.
 * @returns {MasterPaymentTypePagination} Payment type pagination state and handlers
 */
export const useMasterPaymentTypePagination = (): MasterPaymentTypePagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Fetch payment types with current pagination and search
   */
  const queryResult = useGetPaymentTypesQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _derivePaymentTypeListState(queryResult);

  /**
   * Handle page change
   * @param {number} page - The new page number
   * @returns {void}
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, Math.max(1, derived.totalPages))));
  /**
   * Handle next page
   * @returns {void}
   */
  const nextPage = (): void => { if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && currentPage < derived.totalPages) goToPage(currentPage + 1); };
  /**
   * Handle prev page
   * @returns {void}
   */
  const prevPage = (): void => { if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && currentPage > 1) goToPage(currentPage - 1); };
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
 * Hook for creating payment type.
 * @returns {MasterPaymentTypeCreateFormState} Create form state and handlers
 */
export const useMasterPaymentTypeCreate = (): MasterPaymentTypeCreateFormState => {
  const [name, setName] = useState("");
  const [createPaymentType, { isLoading: isSubmitting }] = useCreatePaymentTypeMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Submit new payment type to API.
   * @returns {Promise<void>} Resolves after submission handling
   */
  const handleSubmit = async (): Promise<void> => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await createPaymentType({ name }).unwrap();

      if (!response.status) {
        setErrorMessage("Payment type request failed.");

        return;
      }

      setSuccessMessage("Payment type created successfully.");
    } catch {
      setErrorMessage("Unable to create payment type. Please try again.");
    }
  };

  return { name, isSubmitting, errorMessage, successMessage, handleNameChange: setName, handleSubmit };
};

/**
 * Hook for master payment type container state.
 * @returns {MasterPaymentTypeContainerState} Container state and handlers
 */
export const useMasterPaymentTypeContainerState = (): MasterPaymentTypeContainerState => {
  const pagination = useMasterPaymentTypePagination();
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
