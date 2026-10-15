/* eslint-disable jsdoc/require-jsdoc */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  MasterServiceTypeContainerState,
  MasterServiceTypeNavigation,
  MasterServiceTypePagination,
  ServiceTypeData,
  ServiceTypeListApiState,
  ServiceTypeListResponse,
} from "./MasterServiceType.type";

import { mapServiceType, useCreateServiceTypeMutation, useGetServiceTypesQuery } from "@/services/master-service-type.service";

/**
 * Navigation hook.
 * @returns {MasterServiceTypeNavigation} Navigation handlers
 */
export const useMasterServiceTypeNavigation = (): MasterServiceTypeNavigation => {
  const navigate = useNavigate();
  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-service-type/create"); };
  const goEdit = (serviceType: ServiceTypeData): void => { navigate(`/master-service-type/edit/${serviceType.id}`); };
  const goDetail = (serviceType: ServiceTypeData): void => { navigate(`/master-service-type/detail/${serviceType.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive list state from RTK Query result.
 * @param {ReturnType<typeof useGetServiceTypesQuery>} queryResult - Query result
 * @returns {ServiceTypeListApiState} List state
 */
const _deriveServiceTypeListState = (
  queryResult: ReturnType<typeof useGetServiceTypesQuery>,
): ServiceTypeListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) return { isLoading: true, errorMessage: null, isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };

  if (error) return { isLoading: false, errorMessage: "Unable to load service types.", isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };

  const response: ServiceTypeListResponse | undefined = data;

  if (!response) return { isLoading: false, errorMessage: "No response received from server.", isMissingData: true, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };

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
  const queryResult = useGetServiceTypesQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveServiceTypeListState(queryResult);
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
 * Container state hook.
 * @returns {MasterServiceTypeContainerState} Container state
 */
export const useMasterServiceTypeContainerState = (): MasterServiceTypeContainerState => {
  const navigation = useMasterServiceTypeNavigation();
  const pagination = useMasterServiceTypePagination();

  useCreateServiceTypeMutation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const toggleMore = (): void => setIsMoreOpen((previous) => !previous);
  const goDelete = (): void => setIsMoreOpen(false);
  const handleCloseMore = (): void => setIsMoreOpen(false);

  return { ...navigation, pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
