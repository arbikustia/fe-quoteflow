import { useNavigate } from 'react-router-dom';

/**
 * Desktop Dashboard Effect Hook
 * @returns {{ handleNewOrder: () => void; handleReturn: () => void }} - hook returns
 */
export const useDesktopDashboardEffect = (): { handleNewOrder: () => void; handleReturn: () => void } => {
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
