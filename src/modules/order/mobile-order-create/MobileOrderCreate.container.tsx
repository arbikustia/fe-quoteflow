import * as React from 'react';

import type { QuoteData } from '../desktop-order/DesktopOrder.type';

import { MobileOrderCreateComponent } from './MobileOrderCreate.component';
import { useMobileOrderCreateLogic } from './MobileOrderCreate.hook';

/**
 * MobileOrderCreate Container
 * @returns {React.ReactElement} The container component
 */
const MobileOrderCreateContainer = (): React.ReactElement => {
  const logic = useMobileOrderCreateLogic();

  return (
    <MobileOrderCreateComponent
      {...logic}
      existingOrder={logic.existingOrder as QuoteData}
    />
  );
};

export default MobileOrderCreateContainer;
