import type { ReactElement } from "react";

import { InvoiceDetailComponent } from "./InvoiceDetail.component";
import { useInvoiceDetail } from "./InvoiceDetail.hook";

/**
 * Render invoice detail container.
 * @returns {ReactElement} - invoice detail container
 */
export default function InvoiceDetailContainer(): ReactElement {
  return <InvoiceDetailComponent {...useInvoiceDetail()} />;
}
