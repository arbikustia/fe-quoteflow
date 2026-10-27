import type { ReactElement } from "react";

import { QuotationStatusForm } from "./QuotationStatus.component";
import { useQuotationStatusForm } from "./QuotationStatus.hook";

import Layout from "@/app/layout";

/**
 * Render quotation status form container.
 * @returns {ReactElement} Status form page
 */
const QuotationStatusContainer = (): ReactElement => {
  const formState = useQuotationStatusForm();

  return (
    <Layout mobileWhiteBackground={true} showMobileGlobalHeader={true}>
      <QuotationStatusForm {...formState} />
    </Layout>
  );
};

export default QuotationStatusContainer;
