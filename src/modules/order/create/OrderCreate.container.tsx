import * as React from "react";

import { usePagePermission } from "@/hooks/usePagePermission";

import { OrderCreateComponent } from "./OrderCreate.component";
import { useOrderCreateLogic } from "./OrderCreate.hook";

/**
 * Render the order create form when the user may create orders.
 * @returns {React.ReactElement} - Create form, or null when denied
 */
const OrderCreateContainer = (): React.ReactElement | null => {
  const props = useOrderCreateLogic();
  const { canCreate } = usePagePermission("/order/create");

  if (!canCreate) return null;

  return <OrderCreateComponent {...props} />;
};

export default OrderCreateContainer;
