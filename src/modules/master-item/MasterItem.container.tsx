import * as React from 'react';
import { MasterItemComponent } from './MasterItem.component';
import { useMasterItemState } from './MasterItem.hook';

/**
 * Render Master Item Container
 * @returns {React.ReactElement} - Master Item Container
 */
const MasterItemContainer = (): React.ReactElement => {
  const state = useMasterItemState();

  return <MasterItemComponent {...state} />;
};

export default MasterItemContainer;
