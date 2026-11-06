import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";

import { MasterUserComponent } from "./MasterUser.component";
import { useMasterUserContainerState } from "./MasterUser.hook";
import type { UserRouteState } from "./MasterUser.type";

/**
 * Master User Container
 * @returns {React.ReactElement} Container component
 */
const MasterUserContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: UserRouteState | null = location.state;
  const containerState = useMasterUserContainerState();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterUserComponent
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

export default MasterUserContainer;
