import type { ReactElement } from "react";

import { useMasterRoleCreateForm } from "../MasterRole.hook";

import Layout from "@/app/layout";

import { MasterRoleCreateComponent } from "./MasterRoleCreate.component";

/**
 * Render Master Role Create Container.
 * @returns {ReactElement} Container
 */
const MasterRoleCreateContainer = (): ReactElement => {
  const formState = useMasterRoleCreateForm();

  return (
    <Layout>
      <MasterRoleCreateComponent {...formState} />
    </Layout>
  );
};

export default MasterRoleCreateContainer;
