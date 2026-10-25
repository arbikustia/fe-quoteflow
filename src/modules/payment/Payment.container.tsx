import type { ReactElement } from "react";

import { getPaymentColumns } from "./Payment.columns";
import { PaymentComponent } from "./Payment.component";
import { usePaymentNavigation, usePaymentPagination } from "./Payment.hook";

/** Render payment page container. */
export default function PaymentContainer(): ReactElement {
  const pagination = usePaymentPagination();
  const navigation = usePaymentNavigation();
  const columns = getPaymentColumns(pagination.currentPage, pagination.pageSize, navigation.onEdit);

  return <PaymentComponent {...pagination} {...navigation} columns={columns} />;
}
