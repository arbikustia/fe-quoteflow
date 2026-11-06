import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";

import { MasterRoleComponent } from "./MasterRole.component";
import { useMasterRoleContainerState } from "./MasterRole.hook";
import type { RoleRouteState } from "./MasterRole.type";

/**
 * Master Role Container
 * @returns {React.ReactElement} Container component
 */
const MasterRoleContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: RoleRouteState | null = location.state;
  const containerState = useMasterRoleContainerState();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterRoleComponent
        {...containerState.pagination}
        onBack={containerState.goBack}
        onCreate={containerState.goCreate}
        onEdit={containerState.goEdit}
        onRowClick={containerState.goEdit}
        onMore={containerState.toggleMore}
        isMoreOpen={containerState.isMoreOpen}
        onCloseMore={containerState.handleCloseMore}
        onDelete={containerState.goDelete}
      />
    </>
  );
};

export default MasterRoleContainer;
