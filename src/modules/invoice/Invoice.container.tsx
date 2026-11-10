import * as React from "react";

import { InvoiceComponent } from "./Invoice.component";
import { useInvoiceNavigation, useInvoicePagination } from "./Invoice.hook";
import { usePagePermission } from "@/hooks/usePagePermission";

/**
 * Render invoice container.
 * @returns {React.ReactElement} Invoice container
 */
const InvoiceContainer = (): React.ReactElement => {
  const pagination = useInvoicePagination();
  const navigation = useInvoiceNavigation();
  const { canView } = usePagePermission("/document/invoice");

  if (!canView) return null;

  return <InvoiceComponent {...pagination} {...navigation} />;
};

export default InvoiceContainer;
