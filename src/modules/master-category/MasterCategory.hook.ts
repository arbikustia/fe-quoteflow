import type * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { _mapCategory, useCreateCategoryMutation, useGetCategoriesQuery } from "./MasterCategory.api";
import type {
  BaseCategoryState,
  CategoryData,
  CategoryListApiState,
  CategoryListResponse,
  ConfirmModalState,
  MasterCategoryContainerState,
  MasterCategoryCreateFormState,
  MasterCategoryNavigation,
  MasterCategoryPagination,
  ModalState,
} from "./MasterCategory.type";

/**
 * Hook for master category navigation.
 * @returns {MasterCategoryNavigation} Navigation functions
 */
export const useMasterCategoryNavigation = (): MasterCategoryNavigation => {
  const navigate = useNavigate();
  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-category/create"); };
  const goEdit = (category: CategoryData): void => { navigate(`/master-category/edit/${category.id}`); };
  const goDetail = (category: CategoryData): void => { navigate(`/master-category/detail/${category.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive category state from API response.
 * @param {ReturnType<typeof useGetCategoriesQuery>} queryResult - RTK Query result
 * @returns {CategoryListApiState} Derived category list state
 */
const _deriveCategoryListState = (queryResult: ReturnType<typeof useGetCategoriesQuery>): CategoryListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) return _createLoadingState();

  if (error) return _createErrorState();

  const response: CategoryListResponse | undefined = data;

  if (!response) return _createMissingResponseState();

  if (!response.status) {
    return _createEnvelopeErrorState(response.messages);
  }

  const paginatedResponse = response.data;

  if (!paginatedResponse) return _createMissingPayloadState();

  const categoryList = paginatedResponse.data;

  if (!categoryList) return _createMissingPayloadState();

  return _createSuccessState(categoryList.map(_mapCategory), paginatedResponse.total_pages, paginatedResponse.total_count);
};

/**
 * Create envelope error state.
 * @param {ApiMessages} messages - Backend messages
 * @returns {CategoryListApiState} Envelope error state
 */
const _createEnvelopeErrorState = (messages: string[] | string | null): CategoryListApiState => ({
  isLoading: false,
  errorMessage: Array.isArray(messages) ? messages.join(" ") : (messages ?? "Category request failed."),
  isEnvelopeError: true,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create loading state.
 * @returns {CategoryListApiState} Loading state
 */
const _createLoadingState = (): CategoryListApiState => ({
  isLoading: true,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create transport error state.
 * @returns {CategoryListApiState} Error state
 */
const _createErrorState = (): CategoryListApiState => ({
  isLoading: false,
  errorMessage: "Unable to load categories.",
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {CategoryListApiState} Missing response state
 */
const _createMissingResponseState = (): CategoryListApiState => ({
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
 * @returns {CategoryListApiState} Missing payload state
 */
const _createMissingPayloadState = (): CategoryListApiState => ({
  isLoading: false,
  errorMessage: "Response is missing data payload.",
  isEnvelopeError: false,
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create successful state.
 * @param {CategoryData[]} categories - Mapped categories
 * @param {number} totalPages - Total pages from API
 * @param {number} totalCount - Total count from API
 * @returns {CategoryListApiState} Success state
 */
const _createSuccessState = (categories: CategoryData[], totalPages: number, totalCount: number): CategoryListApiState => ({
  isLoading: false,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: categories,
  totalPages,
  totalCount,
});

/**
 * Hook for API-backed master category pagination.
 * @returns {MasterCategoryPagination} Category pagination state and handlers
 */
export const useMasterCategoryPagination = (): MasterCategoryPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryResult = useGetCategoriesQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveCategoryListState(queryResult);

  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));
  const nextPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && queryResult.data?.data?.has_next) goToPage(currentPage + 1);
  };
  const prevPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && queryResult.data?.data?.has_previous) goToPage(currentPage - 1);
  };
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
 * Hook for master category container state.
 * @returns {MasterCategoryContainerState} Container state and handlers
 */
export const useMasterCategoryContainerState = (): MasterCategoryContainerState => {
  const pagination = useMasterCategoryPagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const toggleMore = (): void => setIsMoreOpen((previous) => !previous);
  const handleCloseMore = (): void => setIsMoreOpen(false);
  const goDelete = (): void => handleCloseMore();

  return { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete };
};

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const openCreateModal = (): void => { setEditingCategory(null); setIsModalOpen(true); };
  const openEditModal = (data: CategoryData): void => { setEditingCategory(data); setIsModalOpen(true); };
  const closeModal = (): void => { setIsModalOpen(false); setTimeout(() => setEditingCategory(null), 200); };

  return { isModalOpen, editingCategory, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryData | null>(null);
  const openConfirmModal = (data: CategoryData): void => { setDeletingCategory(data); setIsConfirmModalOpen(true); };
  const closeConfirmModal = (): void => { setIsConfirmModalOpen(false); setTimeout(() => setDeletingCategory(null), 200); };
  const onConfirmDelete = (): void => { closeConfirmModal(); };

  return { isConfirmModalOpen, deletingCategory, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

/**
 * Hook managing category creation form and API submission.
 * @returns {MasterCategoryCreateFormState} Form state and handlers
 */
export const useMasterCategoryCreate = (): MasterCategoryCreateFormState => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [createCategory, { isLoading: isSubmitting }] = useCreateCategoryMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setName(event.target.value);
  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await createCategory({ name }).unwrap();

      if (!response.status) {
        setErrorMessage(Array.isArray(response.messages) ? response.messages.join(" ") : (response.messages ?? "Category request failed."));

        return;
      }

      setSuccessMessage("Category created successfully.");
      navigate("/master-category");
    } catch {
      setErrorMessage("Unable to create category. Please try again.");
    }
  };
  const goBack = (): void => { navigate(-1); };

  return { name, isSubmitting, errorMessage, successMessage, handleNameChange, handleSubmit, goBack };
};

/**
 * Master Category modal state hook.
 * @returns {BaseCategoryState} Modal state
 */
export const useMasterCategoryState = (): BaseCategoryState => ({ ...useModalState(), ...useConfirmModalState() });
