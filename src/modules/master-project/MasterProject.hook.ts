import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mapProject, useGetProjectsQuery } from "@/services/master-project.service";
import type {
  MasterProjectContainerState,
  MasterProjectNavigation,
  MasterProjectPagination,
  ProjectData,
  ProjectListApiState,
  ProjectListResponse,
} from "./MasterProject.type";

/**
 * Hook for master project navigation.
 * @returns {MasterProjectNavigation} Navigation functions
 */
export const useMasterProjectNavigation = (): MasterProjectNavigation => {
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
  const goCreate = (): void => { navigate("/master-project/create"); };
  /**
   * Navigate to edit page
   * @param {ProjectData} project - The project data
   * @returns {void}
   */
  const goEdit = (project: ProjectData): void => { navigate(`/master-project/edit/${project.id}`); };
  /**
   * Navigate to detail page
   * @param {ProjectData} project - The project data
   * @returns {void}
   */
  const goDetail = (project: ProjectData): void => { navigate(`/master-project/detail/${project.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive paginated state from API response envelope.
 * Handles loading, HTTP error, envelope status false, missing data explicitly.
 * @param {ReturnType<typeof useGetProjectsQuery>} queryResult - RTK Query result
 * @returns {ProjectListApiState} Derived state
 */
const _deriveProjectListState = (queryResult: ReturnType<typeof useGetProjectsQuery>): ProjectListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createLoadingState();
  }

  if (error) {
    return _createErrorState();
  }

  const response: ProjectListResponse | undefined = data;

  if (!response) {
    return _createMissingResponseState();
  }

  const projectList = response.data;

  if (!projectList) {
    return _createMissingPayloadState();
  }

  const projects = projectList.map(mapProject);

  return _createSuccessState(projects, response.total_pages, response.total_count);
};

/**
 * Create loading state.
 * @returns {ProjectListApiState} Loading state
 */
const _createLoadingState = (): ProjectListApiState => ({
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
 * @returns {ProjectListApiState} Error state
 */
const _createErrorState = (): ProjectListApiState => ({
  isLoading: false,
  errorMessage: "Unable to load projects.",
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {ProjectListApiState} Missing response state
 */
const _createMissingResponseState = (): ProjectListApiState => ({
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
 * @returns {ProjectListApiState} Missing payload state
 */
const _createMissingPayloadState = (): ProjectListApiState => ({
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
 * @param {ProjectData[]} projects - Mapped project data
 * @param {number} totalPages - Total pages from API
 * @param {number} totalCount - Total count from API
 * @returns {ProjectListApiState} Success state
 */
const _createSuccessState = (projects: ProjectData[], totalPages: number, totalCount: number): ProjectListApiState => ({
  isLoading: false,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: projects,
  totalPages,
  totalCount,
});

/**
 * Hook for API-backed master project pagination.
 * @returns {MasterProjectPagination} Project pagination state and handlers
 */
export const useMasterProjectPagination = (): MasterProjectPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Fetch projects with current pagination and search
   */
  const queryResult = useGetProjectsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveProjectListState(queryResult);

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
  const nextPage = (): void => { if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_next) goToPage(currentPage + 1); };
  /**
   * Handle prev page
   * @returns {void}
   */
  const prevPage = (): void => { if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_previous) goToPage(currentPage - 1); };
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
 * Hook for master project container state.
 * @returns {MasterProjectContainerState} Container state and handlers
 */
export const useMasterProjectContainerState = (): MasterProjectContainerState => {
  const pagination = useMasterProjectPagination();
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

  const navigation = useMasterProjectNavigation();

  return { ...navigation, pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete };
};
