import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { CustomerData, CustomerDetailResponse } from "../MasterCustomer.type";

import type { MasterCustomerDetailMenuState, MasterCustomerDetailState } from "./MasterCustomerDetail.type";

import { mapCustomer, useGetCustomerByIdQuery } from "@/services/master-customer.service";

/**
 * Resolve customer API response to UI customer data.
 * @param {CustomerDetailResponse | undefined} response - Customer API response
 * @returns {CustomerData | null} Customer data or null
 */
const _getCustomer = (response: CustomerDetailResponse | undefined): CustomerData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  return Array.isArray(response.data) ? mapCustomer(response.data[0]) : mapCustomer(response.data);
};

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
  const { data: customerResponse } = useGetCustomerByIdQuery(id ?? "", { skip: !id });
  const customer = _getCustomer(customerResponse);
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
