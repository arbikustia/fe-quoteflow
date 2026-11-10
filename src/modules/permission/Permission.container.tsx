import * as React from "react";

import { PermissionComponent } from "./Permission.component";
import { usePermissionState } from "./Permission.hook";

/**
 * Render permission page container.
 * @returns {React.ReactElement} Permission page container
 */
const PermissionContainer = (): React.ReactElement => {
  const state = usePermissionState();

  return <PermissionComponent {...state} />;
};

export default PermissionContainer;
