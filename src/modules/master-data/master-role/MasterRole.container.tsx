import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";
import { usePagePermission } from "@/hooks/usePagePermission";

import { MasterRoleComponent } from "./MasterRole.component";
import { useMasterRoleContainerState } from "./MasterRole.hook";
import type { RoleRouteState } from "./MasterRole.type";

/**
 * Master Role Container
 *
 * @returns {React.ReactElement} Container component
 */
const MasterRoleContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: RoleRouteState | null = location.state;
  const containerState = useMasterRoleContainerState();
  const { canCreate, canEdit } = usePagePermission("/master-role");

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterRoleComponent
        {...containerState.pagination}
        onBack={containerState.goBack}
        onCreate={canCreate ? containerState.goCreate : undefined}
        onEdit={canEdit ? containerState.goEdit : undefined}
        onRowClick={canEdit ? containerState.goEdit : undefined}
        onMore={canEdit ? containerState.toggleMore : undefined}
        isMoreOpen={containerState.isMoreOpen}
        onCloseMore={containerState.handleCloseMore}
        onDelete={canEdit ? containerState.goDelete : undefined}
      />
    </>
  );
};

export default MasterRoleContainer;
