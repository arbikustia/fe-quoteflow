import type { ReactElement } from "react";

import { PaymentCreateComponent } from "./PaymentCreate.component";
import { usePaymentCreate } from "./PaymentCreate.hook";

import Layout from "@/app/layout";

/**
 * Render payment create container.
 * @returns {ReactElement} - payment create page
 */
export default function PaymentCreateContainer(): ReactElement {
  return <Layout mobileWhiteBackground={true}><PaymentCreateComponent {...usePaymentCreate()} /></Layout>;
}
