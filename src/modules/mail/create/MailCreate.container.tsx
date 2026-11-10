import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import Layout from "@/app/layout";
import { usePagePermission } from "@/hooks/usePagePermission";

import { MailCreateForm } from "./MailCreate.component";
import { useMailCreate } from "./MailCreate.hook";

/**
 * Mail create page container.
 * @returns {ReactElement} Create page element
 */
const MailCreateContainer = (): ReactElement => {
  const formState = useMailCreate();
  const { canCreate } = usePagePermission("/mail");

  if (!canCreate) return <Navigate to="/mail" replace />;

  return (
    <Layout>
      <MailCreateForm {...formState} />
    </Layout>
  );
};

export default MailCreateContainer;
