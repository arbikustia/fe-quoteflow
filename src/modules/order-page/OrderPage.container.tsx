import * as React from 'react';
import { OrderPageComponent } from './OrderPage.component';
import { useOrderPageState } from './OrderPage.hook';

/**
 * Render Order Page Container
 * @returns {React.ReactElement} - Order Page Container
 */
const OrderPageContainer = (): React.ReactElement => {
  const state = useOrderPageState();

  return <OrderPageComponent {...state} />;
};

export default OrderPageContainer;
