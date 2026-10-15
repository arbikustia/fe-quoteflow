/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_SERVICE_TYPES } from "@/fixture/master-service-type";

import type { ServiceTypeData } from "../MasterServiceType.type";

import type { MasterServiceTypeDetailMenuState, MasterServiceTypeDetailState } from "./MasterServiceTypeDetail.type";

const useDetailMenuState = (): MasterServiceTypeDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const closeMore = (): void => { setIsMoreOpen(false); };
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Manage service type detail state.
 * @returns {MasterServiceTypeDetailState} Detail state
 */
export const useMasterServiceTypeDetail = (): MasterServiceTypeDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const serviceType: ServiceTypeData | null = MOCK_SERVICE_TYPES.find((item) => item.id === id) ?? null;
  const goBack = (): void => { navigate(-1); };
  const goEdit = (): void => { menuState.closeMore();

 if (serviceType) navigate(`/master-service-type/edit/${serviceType.id}`); };
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-service-type"); };

  return { serviceType, goBack, goEdit, handleDelete, ...menuState };
};
