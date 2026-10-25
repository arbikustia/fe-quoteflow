import type { ReactElement } from "react";

import { QuotationDetailComponent } from "./QuotationDetail.component";
import { useQuotationDetail } from "./QuotationDetail.hook";

/** Render quotation detail container. */
const QuotationDetailContainer = (): ReactElement => {
  const state = useQuotationDetail();

  return <QuotationDetailComponent {...state} />;
};

export default QuotationDetailContainer;
