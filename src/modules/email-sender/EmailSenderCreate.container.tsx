import type { ReactElement } from "react";

import Layout from "@/app/layout";

import { EmailSenderCreateComponent } from "./EmailSenderCreate.component";
import { useEmailSenderCreate } from "./EmailSenderCreate.hook";

export default function EmailSenderCreateContainer(): ReactElement {
  return <Layout pageTitle="Email Sender" mobileWhiteBackground={true}><EmailSenderCreateComponent {...useEmailSenderCreate()} /></Layout>;
}
