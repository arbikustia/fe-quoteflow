import type { ReactElement } from "react";

import { PaymentDetailComponent } from "./PaymentDetail.component";
import { usePaymentDetail } from "./PaymentDetail.hook";

/**
 * Render payment detail container.
 * @returns {ReactElement} - payment detail container
 */
export default function PaymentDetailContainer(): ReactElement {
  return <PaymentDetailComponent {...usePaymentDetail()} />;
}
