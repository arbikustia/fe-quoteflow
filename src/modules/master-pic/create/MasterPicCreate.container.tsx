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

  return (
    <Layout pageTitle={state.isEditMode ? "Edit PIC" : "New PIC"} mobileWhiteBackground={true} showMobileGlobalHeader={true}>
      <MasterPicCreateForm {...state} />
    </Layout>
  );
};

export default MasterPicCreateContainer;
