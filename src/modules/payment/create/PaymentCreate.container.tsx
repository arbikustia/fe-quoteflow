import type { ReactElement } from "react";

import { PaymentCreateComponent } from "./PaymentCreate.component";
import { usePaymentCreate } from "./PaymentCreate.hook";

import Layout from "@/app/layout";

/**
 * Render payment create container.
 * @returns {ReactElement} - Payment create page
 */
const PaymentCreateContainer = (): ReactElement => {
  const formState = usePaymentCreate();

  return (
    <Layout>
      <PaymentCreateComponent {...formState} />
    </Layout>
  );
};

export default PaymentCreateContainer;
