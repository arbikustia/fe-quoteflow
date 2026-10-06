import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { MobileOrderComponent } from './MobileOrder.component';
import { MOCK_QUOTES } from '../../../fixture/quotes';

/**
 * MobileOrder Container
 * @returns {React.ReactElement} container
 */
const MobileOrderContainer = (): React.ReactElement => {
  const navigate = useNavigate();

  /**
   * Handle navigate
   * @param {string} path - path to navigate to
   * @returns {void} void
   */
  const handleNavigate = (path: string): void => {
    navigate(path);
  };

  return (
    <MobileOrderComponent 
      quotes={MOCK_QUOTES} 
      onNavigate={handleNavigate} 
    />
  );
};

export default MobileOrderContainer;
