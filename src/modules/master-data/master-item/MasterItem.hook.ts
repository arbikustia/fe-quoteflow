import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_ITEM_CONFIG, MASTER_ITEM_ROUTE } from "./MasterItem.config";
import type {
  ItemData,
  ItemDownloadFormat,
  ItemDownloadState,
  ItemListPaging,
  ItemListParams,
  ItemNavigation,
  MasterItemController,
} from "./MasterItem.type";
import { downloadItemLabel, downloadItemQrPdf } from "./MasterItem.util";

/**
 * Manage page, page size and search term of the item list.
 * @returns {ItemListPaging} - Query params, paging state and handlers
 */
const useItemListPaging = (): ItemListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_ITEM_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_ITEM_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): ItemListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_ITEM_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_ITEM_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_ITEM_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the item list.
 * @returns {ItemNavigation} - Back, create and edit handlers
 */
const useItemNavigation = (): ItemNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_ITEM_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create item page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_ITEM_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page, passing the raw item (the backend has no GET-by-id endpoint).
   * @param {ItemData} item - Item to edit
   * @returns {void}
   */
  const handleEdit = useCallback((item: ItemData): void => {
    navigate(`${MASTER_ITEM_ROUTE.EDIT}/${item.id}`, { state: { item: item.source } });
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage QR label downloads: single items and a multi-select batch.
 * @returns {ItemDownloadState} - Selection state and download handlers
 */
const useItemDownload = (): ItemDownloadState => {
  const [selectedItems, setSelectedItems] = useState<ItemData[]>([]);
  const [isMultiDownloadMode, setIsMultiDownloadMode] = useState<boolean>(false);
  const selectedItemIds = useMemo((): string[] => selectedItems.map((item) => item.id), [selectedItems]);

  /**
   * Select or unselect an item for the batch download.
   * @param {ItemData} item - Toggled item
   * @returns {void}
   */
  const handleToggleItem = useCallback((item: ItemData): void => {
    setSelectedItems((items) => (items.some((selected) => selected.id === item.id) ? items.filter((selected) => selected.id !== item.id) : [...items, item]));
  }, []);

  /**
   * Show the selection checkboxes.
   * @returns {void}
   */
  const handleStartMultiDownload = useCallback((): void => {
    setIsMultiDownloadMode(true);
  }, []);

  /**
   * Hide the selection checkboxes and clear the selection.
   * @returns {void}
   */
  const handleCancelMultiDownload = useCallback((): void => {
    setSelectedItems([]);
    setIsMultiDownloadMode(false);
  }, []);

  /**
   * Download one item label.
   * @param {ItemData} item - Item to download
   * @param {ItemDownloadFormat} format - Image or PDF
   * @returns {void}
   */
  const handleDownload = useCallback((item: ItemData, format: ItemDownloadFormat): void => {
    void downloadItemLabel(item, format);
  }, []);

  /**
   * Download the selected item labels as one PDF.
   * @returns {void}
   */
  const handleDownloadSelected = useCallback((): void => {
    if (selectedItems.length === 0) {
      return;
    }

    void downloadItemQrPdf(selectedItems);
  }, [selectedItems]);

  return { selectedItemIds, isMultiDownloadMode, handleToggleItem, handleStartMultiDownload, handleCancelMultiDownload, handleDownload, handleDownloadSelected };
};

/**
 * Manage item list paging, search, navigation and QR downloads.
 * @returns {MasterItemController} - List query params, state and handlers
 */
export const useMasterItem = (): MasterItemController => ({
  ...useItemListPaging(),
  ...useItemNavigation(),
  ...useItemDownload(),
});
