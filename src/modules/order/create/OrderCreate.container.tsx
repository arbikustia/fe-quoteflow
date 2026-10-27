import * as React from "react";

import { OrderCreateComponent } from "./OrderCreate.component";
import { useOrderCreateLogic } from "./OrderCreate.hook";

/**
 * Handle module operation.
 * @returns {React.ReactElement} - Operation result
 */
const OrderCreateContainer = (): React.ReactElement => {
  const props = useOrderCreateLogic();

  return <OrderCreateComponent {...props} />;
};

export default OrderCreateContainer;
