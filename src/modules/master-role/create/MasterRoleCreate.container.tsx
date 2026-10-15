import type { ReactElement } from "react";

import { useMasterRoleCreateForm } from "../MasterRole.hook";

import { MasterRoleCreateComponent } from "./MasterRoleCreate.component";

/**
 * Render Master Role Create Container.
 * @returns {ReactElement} Container
 */
const MasterRoleCreateContainer = (): ReactElement => {
  const formState = useMasterRoleCreateForm();

  return <MasterRoleCreateComponent {...formState} />;
};

export default MasterRoleCreateContainer;
