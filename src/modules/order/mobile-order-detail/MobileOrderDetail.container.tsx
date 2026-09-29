import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MOCK_QUOTES } from '../../../fixture/quotes';
import type { QuoteData } from '../desktop-order/DesktopOrder.type';

import { MobileOrderDetailComponent } from './MobileOrderDetail.component';

/**
 * MobileOrderDetail Container
 * @returns {React.ReactElement} container
 */
const MobileOrderDetailContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const order = MOCK_QUOTES.find((q) => q.id === id) || MOCK_QUOTES[0];

  /**
   * Handle close
   * @returns {void} void
   */
  const handleCloseDeleteModal = (): void => setIsDeleteModalOpen(false);

  /**
   * Handle open
   * @returns {void} void
   */
  const handleOpenDeleteModal = (): void => setIsDeleteModalOpen(true);

  /**
   * Handle navigate back
   * @returns {void} void
   */
  const handleNavigateBack = (): void => {
    navigate(-1);
  };

  /**
   * Handle navigate edit
   * @returns {void} void
   */
  const handleNavigateEdit = (): void => {
    navigate(`/order/create/${order.id}`);
  };

  /**
   * Handle delete
   * @returns {void} void
   */
  const handleDeleteOrder = (): void => {
    setIsDeleteModalOpen(false);
    navigate('/order');
  };

  return (
    <MobileOrderDetailComponent
      order={order as QuoteData}
      isDeleteModalOpen={isDeleteModalOpen}
      onCloseDeleteModal={handleCloseDeleteModal}
      onOpenDeleteModal={handleOpenDeleteModal}
      onNavigateBack={handleNavigateBack}
      onNavigateEdit={handleNavigateEdit}
      onDeleteOrder={handleDeleteOrder}
    />
  );
};

export default MobileOrderDetailContainer;
