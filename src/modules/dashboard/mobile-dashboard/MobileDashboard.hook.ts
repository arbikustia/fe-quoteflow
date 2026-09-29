import { useNavigate } from 'react-router-dom';

/**
 * Mobile dashboard effect hook
 * @returns {{ handleAddOrder: () => void; handleOrderReport: () => void }} - hook returns
 */
export const useMobileDashboardEffect = (): { handleAddOrder: () => void; handleOrderReport: () => void } => {
  const navigate = useNavigate();

  /**
   * Handle add order navigation
   * @returns {void} - void
   */
  const handleAddOrder = (): void => {
    navigate('/order-mobile/create');
  };

  /**
   * Handle order report navigation
   * @returns {void} - void
   */
  const handleOrderReport = (): void => {
    navigate('/report-order-mobile');
  };

  return { handleAddOrder, handleOrderReport };
};
