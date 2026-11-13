import type { ReactElement } from "react";

import { PermissionAssignComponent } from "./PermissionAssign.component";
import { usePermissionAssign } from "./PermissionAssign.hook";

/**
 * Render the assign permission page container.
 * @returns {ReactElement} - Assign permission page
 */
const PermissionAssignContainer = (): ReactElement => {
  const state = usePermissionAssign();

  return <PermissionAssignComponent {...state} />;
};

export default PermissionAssignContainer;
