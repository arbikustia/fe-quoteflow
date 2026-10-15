import type { ReactElement } from "react";

import { MasterPaymentMethodCreateForm } from "./MasterPaymentMethodCreate.component";
import { useMasterPaymentMethodCreate } from "./MasterPaymentMethodCreate.hook";

import Layout from "@/app/layout";

/**
 * Render create container.
 * @returns {ReactElement} container
 */
const MasterPaymentMethodCreateContainer = (): ReactElement => {
  const state = useMasterPaymentMethodCreate();

  return <Layout pageTitle={state.isEdit ? "Edit Payment Method" : "New Payment Method"}><MasterPaymentMethodCreateForm {...state} /></Layout>;
};

export default MasterPaymentMethodCreateContainer;
