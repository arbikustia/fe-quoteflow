import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_SERVICE_TYPES } from "../../fixture/master-service-type";
import { usePagination } from "../../hooks/usePagination";

import type { MasterServiceTypeContainerState, MasterServiceTypeNavigation,ServiceTypeData } from "./MasterServiceType.type";

/**
 * Navigation hook
 * @returns {MasterServiceTypeNavigation} navigation state
 */
export const useMasterServiceTypeNavigation = (): MasterServiceTypeNavigation => {
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
    navigate("/master-service-type/create");
  };

  /**
   * Navigate to edit
   * @param {ServiceTypeData} s - data
   * @returns {void} void
   */
  const goEdit = (s: ServiceTypeData): void => {
    navigate(`/master-service-type/edit/${s.id}`);
  };

  /**
   * Navigate to detail
   * @param {ServiceTypeData} s - data
   * @returns {void} void
   */
  const goDetail = (s: ServiceTypeData): void => {
    navigate(`/master-service-type/detail/${s.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Container state hook
 * @returns {MasterServiceTypeContainerState} container state
 */
export const useMasterServiceTypeContainerState = (): MasterServiceTypeContainerState => {
  const navigation = useMasterServiceTypeNavigation();
  const pagination = usePagination(MOCK_SERVICE_TYPES);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more
   * @returns {void} void
   */
  const toggleMore = (): void => {
    setIsMoreOpen(!isMoreOpen);
  };

  /**
   * Handle delete
   * @returns {void} void
   */
  const goDelete = (): void => {
    setIsMoreOpen(false);
  };

  /**
   * Close more menu
   * @returns {void} void
   */
  const handleCloseMore = (): void => {
    setIsMoreOpen(false);
  };

  return {
    ...navigation,
    pagination,
    isMoreOpen,
    toggleMore,
    goDelete,
    handleCloseMore,
  };
};
