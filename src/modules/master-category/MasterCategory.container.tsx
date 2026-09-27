import * as React from 'react';
import { MasterCategoryComponent } from './MasterCategory.component';
import { useMasterCategoryState } from './MasterCategory.hook';

/**
 * Render Master Category Container
 * @returns {React.ReactElement} - Master Category Container
 */
const MasterCategoryContainer = (): React.ReactElement => {
  const state = useMasterCategoryState();

  return <MasterCategoryComponent {...state} />;
};

export default MasterCategoryContainer;
