import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_ROLES } from "../../fixture/master-role";
import { usePagination } from "../../hooks/usePagination";

import type { MasterRoleContainerState, MasterRoleNavigation,RoleData } from "./MasterRole.type";

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
  const goBack = (): void => {
    navigate(-1);
  };

  /**
   * Navigate to create
   * @returns {void} void
   */
  const goCreate = (): void => {
    navigate("/master-role/create");
  };

  /**
   * Navigate to edit
   * @param {RoleData} c - role data
   * @returns {void} void
   */
  const goEdit = (c: RoleData): void => {
    navigate(`/master-role/edit/${c.id}`);
  };

  /**
   * Navigate to detail
   * @param {RoleData} c - role data
   * @returns {void} void
   */
  const goDetail = (c: RoleData): void => {
    navigate(`/master-role/detail/${c.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Container state hook
 * @returns {MasterRoleContainerState} container state
 */
export const useMasterRoleContainerState = (): MasterRoleContainerState => {
  const navigation = useMasterRoleNavigation();
  const pagination = usePagination(MOCK_ROLES);
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
