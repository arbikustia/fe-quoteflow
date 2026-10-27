import * as React from "react";

import { OrderComponent } from "./Order.component";
import { useOrderPagination, useOrderState } from "./Order.hook";

/**
 * Handle module operation.
 * @returns {React.ReactElement} - Operation result
 */
const OrderContainer = (): React.ReactElement => {
  const state = useOrderState();
  const pagination = useOrderPagination();

  return <OrderComponent {...state} {...pagination} />;
};

export default OrderContainer;
