import type { ReactElement } from "react";

import { PaymentStatusForm } from "./PaymentStatus.component";
import { usePaymentStatusForm } from "./PaymentStatus.hook";

import Layout from "@/app/layout";

/**
 * Render payment status form container.
 * @returns {ReactElement} Status form page
 */
const PaymentStatusContainer = (): ReactElement => {
  const formState = usePaymentStatusForm();

  return (
    <Layout mobileWhiteBackground={true} showMobileGlobalHeader={true}>
      <PaymentStatusForm {...formState} />
    </Layout>
  );
};

export default PaymentStatusContainer;
