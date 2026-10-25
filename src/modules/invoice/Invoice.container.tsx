import * as React from "react";

import { getInvoiceColumns } from "./Invoice.columns";
import { InvoiceComponent } from "./Invoice.component";
import { useInvoiceNavigation, useInvoicePagination, useInvoiceStatus } from "./Invoice.hook";

/** Render invoice container. */
const InvoiceContainer = (): React.ReactElement => {
  const pagination = useInvoicePagination();
  const navigation = useInvoiceNavigation();
  const status = useInvoiceStatus();
  const columns = getInvoiceColumns(pagination.currentPage, pagination.pageSize, status.updatingInvoiceId, status.updateStatus, navigation.onDetail);

  return <InvoiceComponent {...pagination} {...navigation} {...status} columns={columns} />;
};

export default InvoiceContainer;