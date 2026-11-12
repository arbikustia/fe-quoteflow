import type { ReactElement } from "react";

import { PaymentComponent } from "./Payment.component";
import { usePaymentNavigation, usePaymentPagination } from "./Payment.hook";
import { usePagePermission } from "@/hooks/usePagePermission";

/**
 * Render payment page container.
 * @returns {ReactElement} - payment page
 */
export default function PaymentContainer(): ReactElement {
  const pagination = usePaymentPagination();
  const navigation = usePaymentNavigation();
  const { canCreate } = usePagePermission("/document/payment");

  return <PaymentComponent {...pagination} {...navigation} onCreate={canCreate ? navigation.onCreate : undefined} />;
}
