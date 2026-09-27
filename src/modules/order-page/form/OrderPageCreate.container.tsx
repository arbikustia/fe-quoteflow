import * as React from "react";

import OrderPageCreateComponent from "./OrderPageCreate.component";
import { useOrderPageCreate } from "./OrderPageCreate.hook";

/**
 * Order Page Create Container
 * @returns {React.ReactElement} node
 */
const OrderPageCreateContainer = (): React.ReactElement => {
  const state = useOrderPageCreate();
  
  return <OrderPageCreateComponent {...state} />;
};

export default OrderPageCreateContainer;
