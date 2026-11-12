import type { ReactElement } from "react";

import { usePagePermission } from "@/hooks/usePagePermission";

import { PaymentComponent } from "./Payment.component";
import { usePaymentNavigation, usePaymentPagination } from "./Payment.hook";

/**
 * Render payment page container; the create action needs create permission.
 * @returns {ReactElement} - Payment list page
 */
const PaymentContainer = (): ReactElement => {
  const pagination = usePaymentPagination();
  const navigation = usePaymentNavigation();
  const { canCreate } = usePagePermission("/document/payment");

  return <PaymentComponent {...pagination} {...navigation} onCreate={canCreate ? navigation.onCreate : undefined} />;
};

export default PaymentContainer;
