import type { ReactElement } from "react";

import { MasterCustomerCreateForm } from "./MasterCustomerCreate.component";
import { useMasterCustomerCreate } from "./MasterCustomerCreate.hook";

import Layout from "@/app/layout";

/**
 * Master Customer Create page container.
 * @returns {ReactElement} create page element
 */
const MasterCustomerCreateContainer = (): ReactElement => {
  const formState = useMasterCustomerCreate();

  return (
    <Layout mobileWhiteBackground={true}>
      <MasterCustomerCreateForm {...formState} />
    </Layout>
  );
};

export default MasterCustomerCreateContainer;
