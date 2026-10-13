/**
 * @file MasterItem.hook.ts
 * @description Hook managing state for Master Item.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  _mapItem,
  useCreateItemMutation,
  useGetItemsQuery,
} from "./MasterItem.api";
import type {
  ConfirmModalState,
  ItemCreatePayload,
  ItemCreateResponse,
  ItemData,
  ItemListApiState,
  ItemListResponse,
  MasterItemContainerState,
  MasterItemCreateState,
  MasterItemNavigation,
  MasterItemPagination,
  ModalState,
} from "./MasterItem.type";

/**
 * Modal state hook
 * @returns {ModalState} Modal state
 */
const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);

  /**
   * Open create modal
   * @returns {void} void
   */
  const openCreateModal = (): void => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  /**
   * Open edit modal
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const openEditModal = (item: ItemData): void => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  /**
   * Close modal
   * @returns {void} void
   */
  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingItem(null), 200);
  };

  return {
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};

/**
 * Confirm modal state hook
 * @returns {ConfirmModalState} Confirm modal state
 */
const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ItemData | null>(null);

  /**
   * Open confirm modal
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const openConfirmModal = (item: ItemData): void => {
    setDeletingItem(item);
    setIsConfirmModalOpen(true);
  };

  /**
   * Close confirm modal
   * @returns {void} void
   */
  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingItem(null), 200);
  };

  /**
   * Handle confirm delete
   * @returns {void} void
   */
  const onConfirmDelete = (): void => {
    closeConfirmModal();
  };

  return {
    isConfirmModalOpen,
    deletingItem,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};

/**
 * Main Master Item state hook
 * @returns {ModalState & ConfirmModalState} base state
 */
export const useMasterItemState = (): ModalState & ConfirmModalState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();

  return { ...modalState, ...confirmModalState };
};

/**
 * Hook for creating master items.
 * @returns {MasterItemCreateState} Create action and loading state
 */
export const useMasterItemCreate = (): MasterItemCreateState => {
  const [createItemRequest, { isLoading: isCreating }] = useCreateItemMutation();

  /**
   * Submit item creation payload.
   * @param {ItemCreatePayload} payload - Item creation payload
   * @returns {Promise<ItemCreateResponse>} Created item response
   */
  const createItem = (payload: ItemCreatePayload): Promise<ItemCreateResponse> =>
    createItemRequest(payload).unwrap();

  return { createItem, isCreating };
};

/**
 * Navigation hook
 * @returns {MasterItemNavigation} navigation state
 */
export const useMasterItemNavigation = (): MasterItemNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back
   * @returns {void} void
   */
  const goBack = (): void => {
    navigate(-1);
  };

  /**
   * Navigate to create
   * @returns {void} void
   */
  const goCreate = (): void => {
    navigate("/master-item/create");
  };

  /**
   * Navigate to edit
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const goEdit = (item: ItemData): void => {
    navigate(`/master-item/edit/${item.id}`);
  };

  /**
   * Navigate to detail
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const goDetail = (item: ItemData): void => {
    navigate(`/master-item/detail/${item.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive paginated state from API response envelope.
 * Handles loading, HTTP error, envelope status false, missing data explicitly.
 * @param {ReturnType<typeof useGetItemsQuery>} queryResult - RTK Query result
 * @returns {ItemListApiState} Derived state
 */
const _deriveItemListState = (
  queryResult: ReturnType<typeof useGetItemsQuery>,
): ItemListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createLoadingState();
  }

  if (error) {
    return _createErrorState();
  }

  const response: ItemListResponse | undefined = data;

  if (!response) {
    return _createMissingResponseState();
  }

  if (!response.status) {
    return _createEnvelopeErrorState(response.messages);
  }

  const itemList = response.data;

  if (!itemList) {
    return _createMissingPayloadState();
  }

  const items = itemList.data.map(_mapItem);

  return _createSuccessState(items, itemList.total_pages, itemList.total_count);
};

/**
 * Create loading state.
 * @returns {ItemListApiState} Loading state
 */
const _createLoadingState = (): ItemListApiState => ({
  isLoading: true,
  errorMessage: null,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create HTTP error state.
 * @returns {ItemListApiState} Error state
 */
const _createErrorState = (): ItemListApiState => ({
  isLoading: false,
  errorMessage: "Unable to load items.",
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create API envelope error state.
 * @param {string[] | string | null} messages - API error messages
 * @returns {ItemListApiState} Envelope error state
 */
const _createEnvelopeErrorState = (
  messages: string[] | string | null,
): ItemListApiState => ({
  isLoading: false,
  errorMessage: Array.isArray(messages)
    ? messages.join(" ")
    : messages ?? "Unable to load items.",
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {ItemListApiState} Missing response state
 */
const _createMissingResponseState = (): ItemListApiState => ({
  isLoading: false,
  errorMessage: "No response received from server.",
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing payload state.
 * @returns {ItemListApiState} Missing payload state
 */
const _createMissingPayloadState = (): ItemListApiState => ({
  isLoading: false,
  errorMessage: "Response is missing data payload.",
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create success state.
 * @param {ItemData[]} items - Mapped item data
 * @param {number} totalPages - Total pages from API
 * @param {number} totalCount - Total count from API
 * @returns {ItemListApiState} Success state
 */
const _createSuccessState = (
  items: ItemData[],
  totalPages: number,
  totalCount: number,
): ItemListApiState => ({
  isLoading: false,
  errorMessage: null,
  isMissingData: false,
  paginatedData: items,
  totalPages,
  totalCount,
});

/**
 * Hook for API-backed master item pagination.
 * @returns {ItemListApiState & { goToPage, nextPage, prevPage, changePageSize, setSearchTerm, isEmpty }} Pagination state and handlers
 */
// eslint-disable-next-line max-lines-per-function
export const useMasterItemPagination = (): MasterItemPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Fetch items with current pagination and search
   */
  const queryResult = useGetItemsQuery({
    pageNumber: currentPage,
    pageSize,
    searchTerm,
  });
  const derived = _deriveItemListState(queryResult);

  /**
   * Handle page change
   * @param {number} page - The new page number
   * @returns {void}
   */
  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));
  };

  /**
   * Handle next page
   * @returns {void}
   */
  const nextPage = (): void => {
    if (
      !derived.isLoading &&
      !derived.errorMessage &&
      derived.paginatedData.length > 0 &&
      queryResult.data?.data?.has_next
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
      queryResult.data?.data?.has_previous
    ) {
      goToPage(currentPage - 1);
    }
  };

  /**
   * Handle page size change
   * @param {number} size - The new page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /**
   * Handle search term change
   * @param {string} value - The search term
   * @returns {void}
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
    isMissingData: derived.isMissingData,
    isEmpty:
      !derived.isLoading &&
      !derived.errorMessage &&
      !derived.isMissingData &&
      derived.paginatedData.length === 0,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    setSearchTerm: handleSearchTerm,
  };
};

/**
 * Handle more menu state.
 * @returns {Pick<MasterItemContainerState, "isMoreOpen" | "toggleMore" | "goDelete" | "handleCloseMore" | "handleConfirm">} Menu state
 */
const useMasterItemMenuState = (): Pick<
  MasterItemContainerState,
  "isMoreOpen" | "toggleMore" | "goDelete" | "handleCloseMore" | "handleConfirm"
> => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more menu.
   * @returns {void}
   */
  const toggleMore = (): void => setIsMoreOpen((previous) => !previous);

  /**
   * Close more menu.
   * @returns {void}
   */
  const handleCloseMore = (): void => setIsMoreOpen(false);

  /**
   * Handle delete action.
   * @returns {void}
   */
  const goDelete = (): void => handleCloseMore();

  /**
   * Handle confirm action.
   * @returns {void}
   */
  const handleConfirm = (): void => {};

  return { isMoreOpen, toggleMore, handleCloseMore, goDelete, handleConfirm };
};

/**
 * Hook for master item container state.
 * @returns {MasterItemContainerState} Container state and handlers
 */
export const useMasterItemContainerState = (): MasterItemContainerState => {
  const navigation = useMasterItemNavigation();
  const pagination = useMasterItemPagination();
  const menu = useMasterItemMenuState();

  return { ...navigation, pagination, ...menu };
};
