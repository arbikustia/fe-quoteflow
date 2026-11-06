import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";

import { MasterProjectComponent } from "./MasterProject.component";
import { useMasterProjectContainerState } from "./MasterProject.hook";
import type { ProjectRouteState } from "./MasterProject.type";

/**
 * Master Project Container
 * @returns {React.ReactElement} Container component
 */
const MasterProjectContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: ProjectRouteState | null = location.state;
  const containerState = useMasterProjectContainerState();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterProjectComponent
        {...containerState.pagination}
        onBack={containerState.goBack}
        onCreate={containerState.goCreate}
        onEdit={containerState.goEdit}
        onMore={containerState.toggleMore}
        isMoreOpen={containerState.isMoreOpen}
        onCloseMore={containerState.handleCloseMore}
        onDelete={containerState.goDelete}
      />
    </>
  );
};

export default MasterProjectContainer;
