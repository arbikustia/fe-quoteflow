import * as React from "react";
import { useLocation } from "react-router-dom";

import { MasterOrderTypeComponent } from "./MasterOrderType.component";
import { useMasterOrderTypeContainerState, useMasterOrderTypeNavigation } from "./MasterOrderType.hook";
import type { OrderTypeRouteState } from "./MasterOrderType.type";
import { AlertComponent } from "../../../components/Alert";

/**
 * Master Order Type Container
 * @returns {React.ReactElement} Container element
 */
const MasterOrderTypeContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: OrderTypeRouteState | null = location.state;
  const { goBack, goCreate, goEdit } = useMasterOrderTypeNavigation();
  const { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete } = useMasterOrderTypeContainerState();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterOrderTypeComponent
        {...pagination}
        isMoreOpen={isMoreOpen}
        onBack={goBack}
        onCreate={goCreate}
        onEdit={goEdit}
        onMore={toggleMore}
        onCloseMore={handleCloseMore}
        onDelete={goDelete}
      />
    </>
  );
};

export default MasterOrderTypeContainer;
