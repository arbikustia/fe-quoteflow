import * as React from "react";

import { getColumns } from "./Quotation.columns";
import { QuotationComponent } from "./Quotation.component";
import { useQuotationNavigation, useQuotationPagination, useQuotationStatus } from "./Quotation.hook";

/**
 * Render quotation container.
 * @returns {React.ReactElement} Quotation container
 */
const QuotationContainer = (): React.ReactElement => {
  const pagination = useQuotationPagination();
  const navigation = useQuotationNavigation();
  const status = useQuotationStatus();
  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    updatingQuotationId: status.updatingQuotationId,
    onEdit: navigation.onEdit,
    onDetail: navigation.onDetail,
    onStatusChange: status.updateStatus,
  });

  return <QuotationComponent {...pagination} {...navigation} {...status} columns={columns} />;
};

export default QuotationContainer;
