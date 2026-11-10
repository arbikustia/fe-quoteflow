import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";
import { usePagePermission } from "@/hooks/usePagePermission";

import { MasterUserComponent } from "./MasterUser.component";
import { useMasterUserContainerState } from "./MasterUser.hook";
import type { UserRouteState } from "./MasterUser.type";

/**
 * Master User Container
 *
 * @returns {React.ReactElement} Container component
 */
const MasterUserContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: UserRouteState | null = location.state;
  const containerState = useMasterUserContainerState();
  const { canCreate, canEdit } = usePagePermission("/master-user");

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterUserComponent
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

export default MasterUserContainer;
