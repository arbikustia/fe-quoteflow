import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { MobileMasterItemComponent } from './MobileMasterItem.component';
import { MOCK_ITEMS } from '../../../fixture/master-item';

/**
 * Mobile Master Item Container
 * @returns {React.ReactElement} - node
 */
const MobileMasterItemContainer = (): React.ReactElement => {
  const navigate = useNavigate();

  /**
   * Handle navigate
   * @param {string} path - path
   * @returns {void} - void
   */
  const handleNavigate = (path: string): void => {
    navigate(path);
  };

  return (
    <MobileMasterItemComponent
      items={MOCK_ITEMS}
      onNavigate={handleNavigate}
    />
  );
};

export default MobileMasterItemContainer;
