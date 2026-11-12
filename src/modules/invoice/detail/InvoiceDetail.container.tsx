import type { ReactElement } from "react";

import { InvoiceDetailComponent } from "./InvoiceDetail.component";
import { useInvoiceDetail } from "./InvoiceDetail.hook";

/**
 * Render invoice detail container.
 * @returns {ReactElement} - Invoice detail page
 */
const InvoiceDetailContainer = (): ReactElement => {
  const detailState = useInvoiceDetail();

  return <InvoiceDetailComponent {...detailState} />;
};

export default InvoiceDetailContainer;
