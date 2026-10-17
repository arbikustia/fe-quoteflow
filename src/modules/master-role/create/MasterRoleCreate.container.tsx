import type { ReactElement } from "react";

import { useMasterRoleCreateForm } from "./MasterRoleCreate.hook";

import Layout from "@/app/layout";

import { MasterRoleCreateComponent } from "./MasterRoleCreate.component";

/**
 * Render Master Role Create Container.
 * @returns {ReactElement} Container
 */
const MasterRoleCreateContainer = (): ReactElement => {
  const formState = useMasterRoleCreateForm();

  return (
    <Layout mobileWhiteBackground={true}>
      <MasterRoleCreateComponent {...formState} />
    </Layout>
  );
};

export default MasterRoleCreateContainer;
