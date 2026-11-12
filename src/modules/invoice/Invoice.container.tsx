import * as React from "react";

import { usePagePermission } from "@/hooks/usePagePermission";

import { InvoiceComponent } from "./Invoice.component";
import { useInvoiceNavigation, useInvoicePagination } from "./Invoice.hook";

/**
 * Render invoice container; renders nothing without view permission.
 * @returns {React.ReactElement | null} - Invoice list page
 */
const InvoiceContainer = (): React.ReactElement | null => {
  const pagination = useInvoicePagination();
  const navigation = useInvoiceNavigation();
  const { canView } = usePagePermission("/document/invoice");

  if (!canView) {
    return null;
  }

  return <InvoiceComponent {...pagination} {...navigation} />;
};

export default InvoiceContainer;
