import * as React from 'react';

import { DesktopReturnComponent } from './DesktopReturn.component';
import { useDesktopReturnState } from './DesktopReturn.hook';

/**
 * Render Return Container
 * @returns {React.ReactElement} - Return Container
 */
const DesktopReturnContainer = (): React.ReactElement => {
  const state = useDesktopReturnState();

  return <DesktopReturnComponent {...state} />;
};

export default DesktopReturnContainer;
