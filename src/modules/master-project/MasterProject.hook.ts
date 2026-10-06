import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_PROJECTS } from "../../fixture/master-project";
import { usePagination } from "../../hooks/usePagination";

import type { MasterProjectContainerState, MasterProjectNavigation,ProjectData } from "./MasterProject.type";

/**
 * Navigation hook
 * @returns {MasterProjectNavigation} navigation state
 */
export const useMasterProjectNavigation = (): MasterProjectNavigation => {
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
    navigate("/master-project/create");
  };

  /**
   * Navigate to edit
   * @param {ProjectData} p - data
   * @returns {void} void
   */
  const goEdit = (p: ProjectData): void => {
    navigate(`/master-project/edit/${p.id}`);
  };

  /**
   * Navigate to detail
   * @param {ProjectData} p - data
   * @returns {void} void
   */
  const goDetail = (p: ProjectData): void => {
    navigate(`/master-project/detail/${p.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Container state hook
 * @returns {MasterProjectContainerState} container state
 */
export const useMasterProjectContainerState = (): MasterProjectContainerState => {
  const navigation = useMasterProjectNavigation();
  const pagination = usePagination(MOCK_PROJECTS);
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
