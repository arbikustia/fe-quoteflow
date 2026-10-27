import type { ReactElement } from "react";

import { QuotationDetailComponent } from "./QuotationDetail.component";
import { useQuotationDetail } from "./QuotationDetail.hook";

/**
 * QuotationDetailContainer.
 * @returns {ReactElement} - result.
 */
const QuotationDetailContainer = (): ReactElement => {
  const state = useQuotationDetail();

  return <QuotationDetailComponent {...state} />;
};

export default QuotationDetailContainer;
