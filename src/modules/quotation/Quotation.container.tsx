import * as React from "react";

import { usePagePermission } from "@/hooks/usePagePermission";

import { QuotationComponent } from "./Quotation.component";
import { useQuotationNavigation, useQuotationPagination } from "./Quotation.hook";

/**
 * Render the quotation list; editing needs the edit permission.
 * @returns {React.ReactElement} - Quotation list page
 */
const QuotationContainer = (): React.ReactElement => {
  const pagination = useQuotationPagination();
  const navigation = useQuotationNavigation();
  const { canEdit } = usePagePermission("/document/quotation");

  return <QuotationComponent {...pagination} {...navigation} onEdit={canEdit ? navigation.onEdit : undefined} />;
};

export default QuotationContainer;
