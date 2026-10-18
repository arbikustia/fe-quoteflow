import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_SERVICE_TYPES } from "@/fixture/master-service-type";

import type { ServiceTypeData } from "../MasterServiceType.type";

import type {
  MasterServiceTypeDetailMenuState,
  MasterServiceTypeDetailState,
} from "./MasterServiceTypeDetail.type";

/**
 * Hook to manage more dropdown and delete modal states.
 * @returns {MasterServiceTypeDetailMenuState} Menu and modal states
 */
const useDetailMenuState = (): MasterServiceTypeDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /**
   * Toggle more menu visibility.
   * @returns {void} No return value
   */
  const toggleMore = (): void => {
    setIsMoreOpen((previous) => !previous);
  };

  /**
   * Close more menu.
   * @returns {void} No return value
   */
  const closeMore = (): void => {
    setIsMoreOpen(false);
  };

  /**
   * Open delete modal and close more menu.
   * @returns {void} No return value
   */
  const openDeleteModal = (): void => {
    closeMore();
    setIsDeleteModalOpen(true);
  };

  /**
   * Close delete modal.
   * @returns {void} No return value
   */
  const closeDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
  };

  return {
    isMoreOpen,
    isDeleteModalOpen,
    toggleMore,
    closeMore,
    openDeleteModal,
    closeDeleteModal,
  };
};

/**
 * Manage service type detail state.
 * @returns {MasterServiceTypeDetailState} Detail state
 */
export const useMasterServiceTypeDetail = (): MasterServiceTypeDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const serviceType: ServiceTypeData | null =
    MOCK_SERVICE_TYPES.find((item) => item.id === id) ?? null;

  /**
   * Navigate back.
   * @returns {void} No return value
   */
  const goBack = (): void => {
    navigate(-1);
  };

  /**
   * Navigate to service type edit screen.
   * @returns {void} No return value
   */
  const goEdit = (): void => {
    menuState.closeMore();

    if (serviceType) {
      navigate(`/master-service-type/edit/${serviceType.id}`, {
        state: { serviceType },
      });
    }
  };

  /**
   * Handle service type deletion and navigate to list.
   * @returns {void} No return value
   */
  const handleDelete = (): void => {
    menuState.closeDeleteModal();
    navigate("/master-service-type");
  };

  return { serviceType, goBack, goEdit, handleDelete, ...menuState };
};
