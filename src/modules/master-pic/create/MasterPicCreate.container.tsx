import type { ReactElement } from "react";

import { MasterPicCreateForm } from "./MasterPicCreate.component";
import { useMasterPicCreate } from "./MasterPicCreate.hook";

import Layout from "@/app/layout";

/**
 * Render PIC create container.
 * @returns {ReactElement} Container
 */
const MasterPicCreateContainer = (): ReactElement => {
  const state = useMasterPicCreate();

  return <Layout pageTitle={state.isEdit ? "Edit PIC" : "New PIC"}><MasterPicCreateForm {...state} /></Layout>;
};

export default MasterPicCreateContainer;
