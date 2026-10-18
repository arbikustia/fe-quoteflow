import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPaginationHandlers } from "@/utils/pagination.helpers";

import type {
  MasterServiceTypeContainerState,
  MasterServiceTypeNavigation,
  MasterServiceTypePagination,
  ServiceTypeData,
  ServiceTypeListApiState,
  ServiceTypeListResponse,
} from "./MasterServiceType.type";

import {
  mapServiceType,
  useCreateServiceTypeMutation,
  useGetServiceTypesQuery,
} from "@/services/master-service-type.service";

/**
 * Navigation hook.
 * @returns {MasterServiceTypeNavigation} Navigation handlers
 */
export const useMasterServiceTypeNavigation = (): MasterServiceTypeNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back.
   * @returns {void} No return value
   */
  const goBack = (): void => {
    navigate(-1);
  };

  /**
   * Navigate to create.
   * @returns {void} No return value
   */
  const goCreate = (): void => {
    navigate("/master-service-type/create");
  };

  /**
   * Navigate to edit.
   * @param {ServiceTypeData} serviceType - Service type data
   * @returns {void} No return value
   */
  const goEdit = (serviceType: ServiceTypeData): void => {
    navigate(`/master-service-type/edit/${serviceType.id}`, {
      state: { serviceType },
    });
  };

  /**
   * Navigate to detail.
   * @param {ServiceTypeData} serviceType - Service type data
   * @returns {void} No return value
   */
  const goDetail = (serviceType: ServiceTypeData): void => {
    navigate(`/master-service-type/detail/${serviceType.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Create initial empty state for status conditions.
 * @param {boolean} isLoading - Loading indicator
 * @param {string | null} errorMessage - Error message
 * @param {boolean} isMissingData - Missing data indicator
 * @returns {ServiceTypeListApiState} State
 */
const _createInitialListState = (
  isLoading: boolean,
  errorMessage: string | null,
  isMissingData: boolean,
): ServiceTypeListApiState => ({
  isLoading,
  errorMessage,
  isMissingData,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
  hasNext: false,
  hasPrevious: false,
});

/**
 * Derive list state from RTK Query result.
 * @param {ReturnType<typeof useGetServiceTypesQuery>} queryResult - Query result
 * @returns {ServiceTypeListApiState} List state
 */
const _deriveServiceTypeListState = (
  queryResult: ReturnType<typeof useGetServiceTypesQuery>,
): ServiceTypeListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createInitialListState(true, null, false);
  }

  if (error) {
    return _createInitialListState(false, "Unable to load service types.", false);
  }

  const response: ServiceTypeListResponse | undefined = data;

  if (!response) {
    return _createInitialListState(false, "No response received from server.", true);
  }

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: response.data.map(mapServiceType),
    totalPages: response.total_pages,
    totalCount: response.total_count,
    hasNext: response.has_next,
    hasPrevious: response.has_previous,
  };
};

/**
 * API-backed service type pagination hook.
 * @returns {MasterServiceTypePagination} Pagination state
 */
export const useMasterServiceTypePagination = (): MasterServiceTypePagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryResult = useGetServiceTypesQuery({
    pageNumber: currentPage,
    pageSize,
    searchTerm,
  });
  const derived = _deriveServiceTypeListState(queryResult);

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

  const isEmpty =
    !derived.isLoading &&
    !derived.errorMessage &&
    !derived.isMissingData &&
    derived.paginatedData.length === 0;

  return {
    ...derived,
    ...handlers,
    currentPage,
    pageSize,
    isEmpty,
    setSearchTerm: handlers.handleSearchTerm,
  };
};

/**
 * Container state hook.
 * @returns {MasterServiceTypeContainerState} Container state
 */
export const useMasterServiceTypeContainerState = (): MasterServiceTypeContainerState => {
  const navigation = useMasterServiceTypeNavigation();
  const pagination = useMasterServiceTypePagination();

  useCreateServiceTypeMutation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more menu.
   * @returns {void} No return value
   */
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };

  /**
   * Delete action.
   * @returns {void} No return value
   */
  const goDelete = (): void => { setIsMoreOpen(false); };

  /**
   * Close more menu.
   * @returns {void} No return value
   */
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return {
    ...navigation,
    pagination,
    isMoreOpen,
    toggleMore,
    goDelete,
    handleCloseMore,
  };
};
