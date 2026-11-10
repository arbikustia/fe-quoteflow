import * as React from "react";

import { QuotationComponent } from "./Quotation.component";
import { useQuotationNavigation, useQuotationPagination } from "./Quotation.hook";
import { usePagePermission } from "@/hooks/usePagePermission";

/**
 * QuotationContainer.
 * @returns {React.ReactElement} - result.
 */
const QuotationContainer = (): React.ReactElement => {
  const pagination = useQuotationPagination();
  const navigation = useQuotationNavigation();

  const { canCreate, canEdit } = usePagePermission("/document/quotation");

  return <QuotationComponent {...pagination} {...navigation} onEdit={canEdit ? navigation.onEdit : undefined} />;
};

export default QuotationContainer;
