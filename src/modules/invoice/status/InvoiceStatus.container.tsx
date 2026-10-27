import type { ReactElement } from "react";

import { InvoiceStatusForm } from "./InvoiceStatus.component";
import { useInvoiceStatusForm } from "./InvoiceStatus.hook";

import Layout from "@/app/layout";

/**
 * Render invoice status form container.
 * @returns {ReactElement} Status form page
 */
const InvoiceStatusContainer = (): ReactElement => {
  const formState = useInvoiceStatusForm();

  return (
    <Layout mobileWhiteBackground={true} showMobileGlobalHeader={true}>
      <InvoiceStatusForm {...formState} />
    </Layout>
  );
};

export default InvoiceStatusContainer;
