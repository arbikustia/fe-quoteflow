import { useNavigate } from 'react-router-dom';

import type { DesktopDashboardHookReturn } from './DesktopDashboard.type';

/**
 * Desktop Dashboard Effect Hook
 * @returns {DesktopDashboardHookReturn} - hook returns
 */
export const useDesktopDashboardEffect = (): DesktopDashboardHookReturn => {
  const navigate = useNavigate();

  /**
   * Handle new order navigation
   * @returns {void} - void
   */
  const handleNewOrder = (): void => {
    navigate('/order/create');
  };

  /**
   * Handle return navigation
   * @returns {void} - void
   */
  const handleReturn = (): void => {
    navigate('/return');
  };

  return { handleNewOrder, handleReturn };
};
