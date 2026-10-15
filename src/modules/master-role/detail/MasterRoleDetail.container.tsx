import type { ReactElement } from "react";

import { MasterRoleDetailComponent } from "./MasterRoleDetail.component";
import { useMasterRoleDetail } from "./MasterRoleDetail.hook";

/**
 * Render Master Role Detail Container.
 * @returns {ReactElement} Container
 */
const MasterRoleDetailContainer = (): ReactElement => {
  const state = useMasterRoleDetail();

  return <MasterRoleDetailComponent {...state} />;
};

export default MasterRoleDetailContainer;
