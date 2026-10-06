import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_USERS } from "../../fixture/master-user";
import { usePagination } from "../../hooks/usePagination";

import type { MasterUserContainerState, MasterUserNavigation, UserData } from "./MasterUser.type";

// Deprecated: modal state moved to page pattern. Kept as stub for backwards compat.
/**
 * Hook for master user state
 * @returns {Record<string, never>} state
 */
export const useMasterUserState = (): Record<string, never> => ({});

/**
 * Navigation hook
 * @returns {MasterUserNavigation} navigation state
 */
export const useMasterUserNavigation = (): MasterUserNavigation => {
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
    navigate("/master-user/create");
  };

  /**
   * Navigate to edit
   * @param {UserData} c - user data
   * @returns {void} void
   */
  const goEdit = (c: UserData): void => {
    navigate(`/master-user/edit/${c.id}`);
  };

  /**
   * Navigate to detail
   * @param {UserData} c - user data
   * @returns {void} void
   */
  const goDetail = (c: UserData): void => {
    navigate(`/master-user/detail/${c.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Container state hook
 * @returns {MasterUserContainerState} container state
 */
export const useMasterUserContainerState = (): MasterUserContainerState => {
  const navigation = useMasterUserNavigation();
  const pagination = usePagination(MOCK_USERS);
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
