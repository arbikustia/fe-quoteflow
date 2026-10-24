import * as React from "react";

import { OrderCreateComponent } from "./OrderCreate.component";
import { useOrderCreateLogic } from "./OrderCreate.hook";

const OrderCreateContainer = (): React.ReactElement => {
  const props = useOrderCreateLogic();

  return <OrderCreateComponent {...props} />;
};

export default OrderCreateContainer;
