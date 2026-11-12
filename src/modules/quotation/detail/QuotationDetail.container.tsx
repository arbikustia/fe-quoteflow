import type { ReactElement } from "react";

import { QuotationDetailComponent } from "./QuotationDetail.component";
import { useQuotationDetail } from "./QuotationDetail.hook";

/**
 * Render the quotation detail page.
 * @returns {ReactElement} - Quotation detail page
 */
const QuotationDetailContainer = (): ReactElement => {
  const state = useQuotationDetail();

  return <QuotationDetailComponent {...state} />;
};

export default QuotationDetailContainer;
