import type { ReactElement } from "react";

import { PaymentDetailComponent } from "./PaymentDetail.component";
import { usePaymentDetail } from "./PaymentDetail.hook";

/**
 * Render payment detail container.
 * @returns {ReactElement} - Payment detail page
 */
const PaymentDetailContainer = (): ReactElement => {
  const detailState = usePaymentDetail();

  return <PaymentDetailComponent {...detailState} />;
};

export default PaymentDetailContainer;
