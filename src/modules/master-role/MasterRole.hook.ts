import type * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type {
  MasterRoleContainerState,
  MasterRoleCreateFormState,
  MasterRoleNavigation,
  MasterRolePagination,
  RoleData,
  RoleListApiState,
} from "./MasterRole.type";

import { mapRole, useCreateRoleMutation, useGetRolesQuery, useUpdateRoleMutation } from "@/services/master-role.service";

/**
 * Navigation hook
 * @returns {MasterRoleNavigation} navigation state
 */
export const useMasterRoleNavigation = (): MasterRoleNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back
   * @returns {void} void
   */
  const goBack = (): void => { navigate(-1); };

  /**
   * Navigate to create
   * @returns {void} void
   */
  const goCreate = (): void => { navigate("/master-role/create"); };

  /**
   * Navigate to edit
   * @param {RoleData} role - role data
   * @returns {void} void
   */
  const goEdit = (role: RoleData): void => { navigate(`/master-role/edit/${role.id}`, { state: { role } }); };

  /**
   * Navigate to detail
   * @param {RoleData} role - role data
   * @returns {void} void
   */
  const goDetail = (role: RoleData): void => { navigate(`/master-role/detail/${role.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive role list state from API response.
 * @param {ReturnType<typeof useGetRolesQuery>} queryResult - RTK Query result
 * @returns {RoleListApiState} derived role list state
 */
const _deriveRoleListState = (queryResult: ReturnType<typeof useGetRolesQuery>): RoleListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createLoadingState();
  }

  if (error) {
    return _createErrorState();
  }

  if (!data) {
    return _createMissingResponseState();
  }

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: data.data.map(mapRole),
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Create loading state.
 * @returns {RoleListApiState} loading state
 */
const _createLoadingState = (): RoleListApiState => ({
  isLoading: true,
  errorMessage: null,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create HTTP error state.
 * @returns {RoleListApiState} error state
 */
const _createErrorState = (): RoleListApiState => ({
  isLoading: false,
  errorMessage: "Unable to load roles.",
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {RoleListApiState} missing response state
 */
const _createMissingResponseState = (): RoleListApiState => ({
  isLoading: false,
  errorMessage: "No response received from server.",
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Hook for API-backed master role pagination.
 * @returns {MasterRolePagination} role pagination state and handlers
 */
// Pagination handlers stay together so state transitions remain atomic.
// eslint-disable-next-line max-lines-per-function
export const useMasterRolePagination = (): MasterRolePagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryResult = useGetRolesQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveRoleListState(queryResult);

  /**
   * Handle page change
   * @param {number} page - new page number
   * @returns {void} void
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));

  /**
   * Handle next page
   * @returns {void} void
   */
  const nextPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_next) goToPage(currentPage + 1);
  };

  /**
   * Handle previous page
   * @returns {void} void
   */
  const prevPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_previous) goToPage(currentPage - 1);
  };

  /**
   * Handle page size change
   * @param {number} size - new page size
   * @returns {void} void
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /**
   * Handle search term change
   * @param {string} value - search term
   * @returns {void} void
   */
  const handleSearchTerm = (value: string): void => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

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
 * Hook for master role create form.
 * @returns {MasterRoleCreateFormState} role create form state
 */
export const useMasterRoleCreateForm = (): MasterRoleCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routeRole = location.state?.role;
  const [roleName, setRoleName] = useState(routeRole?.roleName ?? "");
  const [isActive, setIsActive] = useState(routeRole?.status === "active");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const isSubmitting = isCreating || isUpdating;

  /**
   * Handle role name change.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input event
   * @returns {void} void
   */
  const handleRoleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRoleName(event.target.value);
  };

  const handleStatusChange = (): void => {
    setIsActive((currentIsActive) => !currentIsActive);
  };

  /**
   * Submit role creation request.
   * @param {React.SyntheticEvent} event - Form event
   * @returns {Promise<void>} Submission result
   */
  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    if (!roleName.trim()) {
      setErrorMessage("Role name is required.");

      return;
    }

    try {
      const response = isEditMode && id
        ? await updateRole({ id, role: roleName, status: isActive ? 1 : 0 }).unwrap()
        : await createRole({ role: roleName, status: 1 }).unwrap();

      if (!response.status) {
        const message = Array.isArray(response.messages)
          ? response.messages.join(" ")
          : (response.messages ?? "Failed to create role.");

        setErrorMessage(message);

        return;
      }

      navigate("/master-role");
    } catch {
      setErrorMessage("Unable to create role. Please try again.");
    }
  };

  /**
   * Navigate back from role form.
   * @returns {void} void
   */
  const goBack = (): void => {
    navigate(-1);
  };

  return { roleName, isActive, isEditMode, isSubmitting, errorMessage, handleRoleNameChange, handleStatusChange, handleSubmit, goBack };
};

/**
 * Hook for master role create mutation.
 * @returns {ReturnType<typeof useCreateRoleMutation>} role create mutation
 */
export const useMasterRoleCreateRole = (): ReturnType<typeof useCreateRoleMutation> => useCreateRoleMutation();

/**
 * Container state hook
 * @returns {MasterRoleContainerState} container state
 */
export const useMasterRoleContainerState = (): MasterRoleContainerState => {
  const navigation = useMasterRoleNavigation();
  const pagination = useMasterRolePagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more menu.
   * @returns {void} void
   */
  const toggleMore = (): void => setIsMoreOpen((previous) => !previous);

  /**
   * Handle delete action.
   * @returns {void} void
   */
  const goDelete = (): void => setIsMoreOpen(false);

  /**
   * Close more menu.
   * @returns {void} void
   */
  const handleCloseMore = (): void => setIsMoreOpen(false);

  return { ...navigation, pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
