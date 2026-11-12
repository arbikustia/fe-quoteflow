import * as React from "react";

import { OrderDetailComponent } from "./OrderDetail.component";
import { useOrderDetail } from "./OrderDetail.hook";

/**
 * Render the order detail page.
 * @returns {React.ReactElement} - Order detail page
 */
const OrderDetailContainer = (): React.ReactElement => <OrderDetailComponent {...useOrderDetail()} />;

export default OrderDetailContainer;
