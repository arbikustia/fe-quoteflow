import type { ReactElement } from "react";

import { MasterRoleCreateComponent } from "./MasterRoleCreate.component";
import { useMasterRoleCreateForm } from "./MasterRoleCreate.hook";

import Layout from "@/app/layout";

/**
 * Render Master Role Create Container.
 * @returns {ReactElement} Container
 */
const MasterRoleCreateContainer = (): ReactElement => {
  const formState = useMasterRoleCreateForm();

  return (
    <Layout mobileWhiteBackground={true} showMobileGlobalHeader={true}>
      <MasterRoleCreateComponent {...formState} />
    </Layout>
  );
};

export default MasterRoleCreateContainer;
