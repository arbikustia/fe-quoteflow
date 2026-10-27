import * as React from "react";

import { QuotationComponent } from "./Quotation.component";
import { useQuotationNavigation, useQuotationPagination } from "./Quotation.hook";

/**
 * QuotationContainer.
 * @returns {React.ReactElement} - result.
 */
const QuotationContainer = (): React.ReactElement => {
  const pagination = useQuotationPagination();
  const navigation = useQuotationNavigation();

  return <QuotationComponent {...pagination} {...navigation} />;
};

export default QuotationContainer;
