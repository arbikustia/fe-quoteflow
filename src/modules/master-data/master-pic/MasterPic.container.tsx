import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";

import { MasterPicComponent } from "./MasterPic.component";
import { useMasterPicContainerState, useMasterPicNavigation } from "./MasterPic.hook";
import type { PicRouteState } from "./MasterPic.type";

/**
 * Master PIC container component
 * @returns {React.ReactElement} The container component
 */
const MasterPicContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: PicRouteState | null = location.state;
  const { goBack, goCreate, goEdit } = useMasterPicNavigation();
  const { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore } = useMasterPicContainerState();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterPicComponent
        {...pagination}
        onBack={goBack}
        onCreate={goCreate}
        onEdit={goEdit}
        onRowClick={goEdit}
        onMore={toggleMore}
        isMoreOpen={isMoreOpen}
        onCloseMore={handleCloseMore}
        onDelete={goDelete}
      />
    </>
  );
};

export default MasterPicContainer;
