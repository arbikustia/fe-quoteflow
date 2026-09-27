import * as React from 'react';

import { ReturnComponent } from './Return.component';
import { useReturnState } from './Return.hook';

/**
 * Render Return Container
 * @returns {React.ReactElement} - Return Container
 */
const ReturnContainer = (): React.ReactElement => {
  const state = useReturnState();

  return <ReturnComponent {...state} />;
};

export default ReturnContainer;
