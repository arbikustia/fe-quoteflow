import type { ReactElement } from "react";

import { MasterPaymentTypeCreateForm } from "./MasterPaymentTypeCreate.component";
import { useMasterPaymentTypeCreate } from "./MasterPaymentTypeCreate.hook";

import Layout from "@/app/layout";

/**
 * Render payment type create container.
 * @returns {ReactElement} Container
 */
const MasterPaymentTypeCreateContainer = (): ReactElement => {
  const state = useMasterPaymentTypeCreate();

  return <Layout pageTitle={state.isEdit ? "Edit Payment Type" : "New Payment Type"}><MasterPaymentTypeCreateForm {...state} /></Layout>;
};

export default MasterPaymentTypeCreateContainer;
