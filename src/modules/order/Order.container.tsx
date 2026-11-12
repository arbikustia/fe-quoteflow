import * as React from "react";

import { OrderComponent } from "./Order.component";
import { useOrderPagination, useOrderState } from "./Order.hook";

/**
 * Render the order list page.
 * @returns {React.ReactElement} - Order list page
 */
const OrderContainer = (): React.ReactElement => {
  const state = useOrderState();
  const pagination = useOrderPagination();

  return <OrderComponent {...state} {...pagination} />;
};

export default OrderContainer;
