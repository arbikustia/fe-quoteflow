import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_PICS } from "../../fixture/master-pic";
import { usePagination } from "../../hooks/usePagination";

import type { 
  MasterPicContainerState,
  MasterPicNavigation,
  PicData
} from "./MasterPic.type";

/**
 * Hook for master pic navigation
 * @returns {MasterPicNavigation} navigation functions
 */
export const useMasterPicNavigation = (): MasterPicNavigation => {
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
  const goCreate = (): void => { navigate("/master-pic/create"); };

  /**
   * Navigate to edit page
   * @param {PicData} p - The PIC data
   * @returns {void}
   */
  const goEdit = (p: PicData): void => { navigate(`/master-pic/edit/${p.id}`); };

  /**
   * Navigate to detail page
   * @param {PicData} p - The PIC data
   * @returns {void}
   */
  const goDetail = (p: PicData): void => { navigate(`/master-pic/detail/${p.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Hook for master pic container state
 * @returns {MasterPicContainerState} container state
 */
export const useMasterPicContainerState = (): MasterPicContainerState => {
  const pagination = usePagination(MOCK_PICS);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more options dropdown
   * @returns {void}
   */
  const toggleMore = (): void => { setIsMoreOpen(!isMoreOpen); };

  /**
   * Handle delete action
   * @returns {void}
   */
  const goDelete = (): void => { setIsMoreOpen(false); };

  /**
   * Close more options dropdown
   * @returns {void}
   */
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
