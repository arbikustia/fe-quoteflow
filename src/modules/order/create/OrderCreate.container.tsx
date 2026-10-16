import * as React from 'react';

import { OrderCreateComponent } from './OrderCreate.component';
import { useOrderCreateLogic } from './OrderCreate.hook';
import type { QuoteData } from '../Order.type';

/**
 * OrderCreate Container
 * @returns {React.ReactElement} The container component
 */
const OrderCreateContainer = (): React.ReactElement => {
  const logic = useOrderCreateLogic();

  return (
    <OrderCreateComponent
      {...logic}
      existingOrder={logic.existingOrder as QuoteData}
    />
  );
};

export default OrderCreateContainer;
