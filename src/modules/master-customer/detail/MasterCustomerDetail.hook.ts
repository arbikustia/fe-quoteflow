import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_CUSTOMERS } from "@/fixture/master-customer";

import type { CustomerData } from "../MasterCustomer.type";

import type { MasterCustomerDetailMenuState, MasterCustomerDetailState } from "./MasterCustomerDetail.type";

/**
 * Resolve a customer from the current route ID.
 * @param {string | undefined} id - Route customer ID
 * @returns {CustomerData | null} Matching customer or null
 */
const _getCustomer = (id: string | undefined): CustomerData | null => (
  MOCK_CUSTOMERS.find((item) => item.id === id) ?? null
);

/**
 * Hook to manage detail action menu state.
 * @returns {MasterCustomerDetailMenuState} Menu state and handlers
 */
const useDetailMenuState = (): MasterCustomerDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /** Toggle the more actions menu. @returns {void} */
  const toggleMore = (): void => { setIsMoreOpen((prev) => !prev); };
  /** Close the more actions menu. @returns {void} */
  const closeMore = (): void => { setIsMoreOpen(false); };
  /** Open delete confirmation. @returns {void} */
  const openDeleteModal = (): void => {
    setIsMoreOpen(false);
    setIsDeleteModalOpen(true);
  };
  /** Close delete confirmation. @returns {void} */
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Hook to manage Master Customer Detail state and actions.
 * @returns {MasterCustomerDetailState} Detail state and handlers
 */
export const useMasterCustomerDetail = (): MasterCustomerDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const customer = _getCustomer(id);
  const menuState = useDetailMenuState();
  const { closeMore, closeDeleteModal } = menuState;

  /** Navigate to prior page. @returns {void} */
  const goBack = (): void => { navigate(-1); };
  /** Navigate to selected customer edit page. @returns {void} */
  const goEdit = (): void => {
    closeMore();

    if (customer) {
      navigate(`/master-customer/edit/${customer.id}`);
    }
  };
  /** Close modal and return to customers. @returns {void} */
  const handleDelete = (): void => {
    closeDeleteModal();
    navigate("/master-customer");
  };

  return { customer, goBack, goEdit, handleDelete, ...menuState };
};
