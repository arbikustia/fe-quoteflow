import type { ReactElement } from "react";

import { PaymentComponent } from "./Payment.component";
import { usePaymentNavigation, usePaymentPagination } from "./Payment.hook";

/**
 * Render payment page container.
 * @returns {ReactElement} - payment page
 */
export default function PaymentContainer(): ReactElement {
  const pagination = usePaymentPagination();
  const navigation = usePaymentNavigation();

  return <PaymentComponent {...pagination} {...navigation} />;
}
