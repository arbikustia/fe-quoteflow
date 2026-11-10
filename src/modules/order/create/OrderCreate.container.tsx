import * as React from "react";

import { OrderCreateComponent } from "./OrderCreate.component";
import { useOrderCreateLogic } from "./OrderCreate.hook";
import { usePagePermission } from "@/hooks/usePagePermission";

/**
 * Handle module operation.
 * @returns {React.ReactElement} - Operation result
 */
const OrderCreateContainer = (): React.ReactElement | null => {
  const props = useOrderCreateLogic();
  const { canCreate } = usePagePermission("/order/create");

  if (!canCreate) return null;

  return <OrderCreateComponent {...props} />;
};

export default OrderCreateContainer;
