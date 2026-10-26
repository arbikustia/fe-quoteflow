import * as React from "react";

import { MasterPaymentMethodCreateForm } from "./MasterPaymentMethodCreate.component";
import { useMasterPaymentMethodCreate } from "./MasterPaymentMethodCreate.hook";

import Layout from "@/app/layout";

/**
 * Master Payment Method Create Container.
 * @returns {React.ReactElement} Container component
 */
const MasterPaymentMethodCreateContainer = (): React.ReactElement => {
  const formState = useMasterPaymentMethodCreate();

  return (
    <Layout mobileWhiteBackground={true} showMobileGlobalHeader={true}>
      <MasterPaymentMethodCreateForm {...formState} />
    </Layout>
  );
};

export default MasterPaymentMethodCreateContainer;
