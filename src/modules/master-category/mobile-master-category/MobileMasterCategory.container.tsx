import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { MobileMasterCategoryComponent } from './MobileMasterCategory.component';
import { MOCK_CATEGORIES } from '../../../fixture/master-category';

/**
 * Mobile Master Category Container
 * @returns {React.ReactElement} node
 */
const MobileMasterCategoryContainer = (): React.ReactElement => {
  const navigate = useNavigate();

  /**
   * Handle navigate
   * @param {string} path - path to navigate
   * @returns {void} void
   */
  const handleNavigate = (path: string): void => {
    navigate(path);
  };

  return (
    <MobileMasterCategoryComponent
      categories={MOCK_CATEGORIES}
      onNavigate={handleNavigate}
    />
  );
};

export default MobileMasterCategoryContainer;
