import * as React from "react";

import Layout from "@/app/layout";

import { MasterPaymentMethodCreateForm } from "./MasterPaymentMethodCreate.component";
import { useMasterPaymentMethodCreate } from "./MasterPaymentMethodCreate.hook";

/**
 * Master Payment Method Create Container.
 * @returns {React.ReactElement} Container component
 */
const MasterPaymentMethodCreateContainer = (): React.ReactElement => {
  const formState = useMasterPaymentMethodCreate();

  return (
    <Layout>
      <MasterPaymentMethodCreateForm {...formState} />
    </Layout>
  );
};

export default MasterPaymentMethodCreateContainer;
