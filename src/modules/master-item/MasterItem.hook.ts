/**
 * @file MasterItem.hook.ts
 * @description Hook managing state for Master Item.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPaginationHandlers } from "@/utils/pagination.helpers";

import { downloadItemQrImage, downloadItemQrPdf } from "./MasterItem.helper";
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

import {
  mapItem,
  useCreateItemMutation,
  useGetItemsQuery,
} from "@/services/master-item.service";

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
  const [createItemRequest, { isLoading: isCreating }] =
    useCreateItemMutation();

  /**
   * Submit item creation payload.
   * @param {ItemCreatePayload} payload - Item creation payload
   * @returns {Promise<ItemCreateResponse>} Created item response
   */
  const createItem = (
    payload: ItemCreatePayload,
  ): Promise<ItemCreateResponse> => createItemRequest(payload).unwrap();

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
    navigate(`/master-item/edit/${item.id}`, { state: { item } });
  };

  return { goBack, goCreate, goEdit };
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

  const items = itemList.map(mapItem);

  return _createSuccessState(items, response.total_pages, response.total_count);
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
 * @param {string | string[] | null | undefined} messages - API error messages
 * @returns {ItemListApiState} Error state
 */
const _createEnvelopeErrorState = (
  messages: string | string[] | null | undefined,
): ItemListApiState => ({
  isLoading: false,
  errorMessage: typeof messages === "string" ? messages : (messages?.join(" ") ?? "Unable to load items."),
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
export const useMasterItemPagination = (): MasterItemPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryResult = useGetItemsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveItemListState(queryResult);
  const canPaginate = !derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0;
  const handlers = createPaginationHandlers({
    currentPage,
    totalPages: derived.totalPages,
    hasNext: queryResult.data?.has_next,
    hasPrevious: queryResult.data?.has_previous,
    canPaginate,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
  });

  return {
    currentPage,
    pageSize,
    ...derived,
    isEmpty: !derived.isLoading && !derived.errorMessage && !derived.isMissingData && derived.paginatedData.length === 0,
    goToPage: handlers.goToPage,
    nextPage: handlers.nextPage,
    prevPage: handlers.prevPage,
    changePageSize: handlers.changePageSize,
    setSearchTerm: handlers.handleSearchTerm,
  };
};

/**
 * @returns {Pick<MasterItemContainerState, "isMoreOpen" | "toggleMore" | "goDelete" | "handleCloseMore" | "handleConfirm">} Menu state
 */
const useMasterItemMenuState = (): Pick<
  MasterItemContainerState,
  "isMoreOpen" | "toggleMore" | "goDelete" | "handleCloseMore" | "handleConfirm"
> => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  /**
   * Toggle more menu.
   * @returns {void} No return value
   */
  const toggleMore = (): void => setIsMoreOpen((previous) => !previous);
  /**
   * Close more menu.
   * @returns {void} No return value
   */
  const handleCloseMore = (): void => setIsMoreOpen(false);
  /**
   * Close menu before delete flow.
   * @returns {void} No return value
   */
  const goDelete = (): void => handleCloseMore();
  /**
   * Confirm delete action.
   * @returns {void} No return value
   */
  const handleConfirm = (): void => {};

  return { isMoreOpen, toggleMore, handleCloseMore, goDelete, handleConfirm };
};

/**
 * Manage Master Item container state.
 * @returns {MasterItemContainerState} Container state
 */
export const useMasterItemContainerState = (): MasterItemContainerState => {
  const navigation = useMasterItemNavigation();
  const pagination = useMasterItemPagination();
  const menu = useMasterItemMenuState();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isMultiDownloadMode, setIsMultiDownloadMode] = useState(false);

  /**
   * Toggle item selection.
   * @param {ItemData} item - Selected item
   * @returns {void} No return value
   */
  const onToggleItem = (item: ItemData): void => {
    setSelectedItemIds((itemIds) => itemIds.includes(item.id) ? itemIds.filter((id) => id !== item.id) : [...itemIds, item.id]);
  };
  /**
   * Enable multi-download selection mode.
   * @returns {void} No return value
   */
  const onToggleMultiDownload = (): void => {
    setIsMultiDownloadMode(true);
  };
  /**
   * Hide multi-download checkboxes and clear selections.
   * @returns {void} No return value
   */
  const onCancelMultiDownload = (): void => {
    setSelectedItemIds([]);
    setIsMultiDownloadMode(false);
  };
  /**
   * Download one item in selected format.
   * @param {ItemData} item - Item to download
   * @param {"image" | "pdf"} format - Output format
   * @returns {void} No return value
   */
  const onDownload = (item: ItemData, format: "image" | "pdf"): void => {
    if (format === "image") {
      void downloadItemQrImage(item);

      return;
    }

    void downloadItemQrPdf([item]);
  };
  /** Download selected labels. */
  const onDownloadSelected = (): void => {
    const selectedItems = pagination.paginatedData.filter((item) => selectedItemIds.includes(item.id));

    if (selectedItems.length > 0) {
      void downloadItemQrPdf(selectedItems);
    }
  };

  return { ...navigation, pagination, ...menu, selectedItemIds, isMultiDownloadMode, onToggleItem, onToggleMultiDownload, onCancelMultiDownload, onDownload, onDownloadSelected };
};
