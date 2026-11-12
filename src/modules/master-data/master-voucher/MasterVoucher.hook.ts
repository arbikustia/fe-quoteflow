import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_VOUCHER_CONFIG, MASTER_VOUCHER_ROUTE, VOUCHER_DOWNLOAD_FAILED_MESSAGE } from "./MasterVoucher.config";
import type {
  MasterVoucherController,
  VoucherData,
  VoucherListPaging,
  VoucherListParams,
  VoucherNavigation,
} from "./MasterVoucher.type";
import { downloadVoucherImage } from "./MasterVoucher.util";

/**
 * Manage page, page size and search term of the voucher list.
 * @returns {VoucherListPaging} - Query params, paging state and handlers
 */
const useVoucherListPaging = (): VoucherListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_VOUCHER_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_VOUCHER_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): VoucherListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_VOUCHER_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_VOUCHER_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_VOUCHER_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the voucher list.
 * @returns {VoucherNavigation} - Back, create and edit handlers
 */
const useVoucherNavigation = (): VoucherNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_VOUCHER_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create voucher page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_VOUCHER_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of a voucher.
   * @param {VoucherData} voucher - Voucher to edit
   * @returns {void}
   */
  const handleEdit = useCallback((voucher: VoucherData): void => {
    navigate(`${MASTER_VOUCHER_ROUTE.EDIT}/${voucher.id}`);
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Tell the user that the voucher image could not be generated.
 * @returns {void}
 */
const _alertDownloadFailure = (): void => {
  window.alert(VOUCHER_DOWNLOAD_FAILED_MESSAGE);
};

/**
 * Manage voucher list paging, search, navigation and image download.
 * @returns {MasterVoucherController} - List query params, state and handlers
 */
export const useMasterVoucher = (): MasterVoucherController => {
  /**
   * Download the voucher image, alerting on failure.
   * @param {VoucherData} voucher - Voucher to download
   * @returns {void}
   */
  const handleDownload = useCallback((voucher: VoucherData): void => {
    downloadVoucherImage(voucher).catch(_alertDownloadFailure);
  }, []);

  return { ...useVoucherListPaging(), ...useVoucherNavigation(), handleDownload };
};
