import type { ReactElement } from "react";

import Layout from "@/app/layout";

import { MailCreateForm } from "./MailCreate.component";
import { useMailCreate } from "./MailCreate.hook";

/**
 * Mail create page container.
 * @returns {ReactElement} Create page element
 */
const MailCreateContainer = (): ReactElement => {
  const formState = useMailCreate();

  return (
    <Layout>
      <MailCreateForm {...formState} />
    </Layout>
  );
};

export default MailCreateContainer;
