import type { ReactElement } from "react";

import { EmailSenderCreateComponent } from "./EmailSenderCreate.component";
import { useEmailSenderCreate } from "./EmailSenderCreate.hook";

import Layout from "@/app/layout";

/**
 * @returns {ReactElement} Rendered element
 */
export default function EmailSenderCreateContainer(): ReactElement {
  return <Layout pageTitle="Email Sender"><EmailSenderCreateComponent {...useEmailSenderCreate()} /></Layout>;
}
