import type { ReactElement } from "react";

import Layout from "@/app/layout";

import { PaymentCreateComponent } from "./PaymentCreate.component";
import { usePaymentCreate } from "./PaymentCreate.hook";

/** Render payment create container. */
export default function PaymentCreateContainer(): ReactElement {
  return <Layout mobileWhiteBackground={true}><PaymentCreateComponent {...usePaymentCreate()} /></Layout>;
}
