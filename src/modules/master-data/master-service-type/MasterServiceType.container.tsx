import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";

import { MasterServiceTypeComponent } from "./MasterServiceType.component";
import { useMasterServiceTypeContainerState } from "./MasterServiceType.hook";
import type { ServiceTypeRouteState } from "./MasterServiceType.type";

/**
 * Master Service Type Container
 *
 * @returns {React.ReactElement} Container component
 */
const MasterServiceTypeContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: ServiceTypeRouteState | null = location.state;
  const containerState = useMasterServiceTypeContainerState();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterServiceTypeComponent
        {...containerState.pagination}
        onBack={containerState.goBack}
        onCreate={containerState.goCreate}
        onEdit={containerState.goEdit}
        onRowClick={containerState.goDetail}
        onMore={containerState.toggleMore}
        isMoreOpen={containerState.isMoreOpen}
        onCloseMore={containerState.handleCloseMore}
        onDelete={containerState.goDelete}
      />
    </>
  );
};

export default MasterServiceTypeContainer;
