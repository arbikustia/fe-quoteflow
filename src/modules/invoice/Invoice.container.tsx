import * as React from "react";

import { InvoiceComponent } from "./Invoice.component";
import { useInvoiceNavigation, useInvoicePagination } from "./Invoice.hook";

/**
 * Render invoice container.
 * @returns {React.ReactElement} Invoice container
 */
const InvoiceContainer = (): React.ReactElement => {
  const pagination = useInvoicePagination();
  const navigation = useInvoiceNavigation();

  return <InvoiceComponent {...pagination} {...navigation} />;
};

export default InvoiceContainer;
