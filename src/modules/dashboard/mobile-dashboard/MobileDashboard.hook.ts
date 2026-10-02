import { useNavigate } from 'react-router-dom';

import type { MobileDashboardHookReturn } from './MobileDashboard.type';

/**
 * Mobile dashboard effect hook
 * @returns {MobileDashboardHookReturn} - hook returns
 */
export const useMobileDashboardEffect = (): MobileDashboardHookReturn => {
  const navigate = useNavigate();

  /**
   * Handle add order navigation
   * @returns {void} - void
   */
  const handleAddOrder = (): void => {
    navigate('/order/create');
  };

  /**
   * Handle order report navigation
   * @returns {void} - void
   */
  const handleOrderReport = (): void => {
    navigate('/report');
  };

  return { handleAddOrder, handleOrderReport };
};
