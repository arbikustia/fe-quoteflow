import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";
import { usePagePermission } from "@/hooks/usePagePermission";

import { MasterPicComponent } from "./MasterPic.component";
import { useMasterPicContainerState, useMasterPicNavigation } from "./MasterPic.hook";
import type { PicRouteState } from "./MasterPic.type";

/**
 * Master PIC container component
 *
 * @returns {React.ReactElement} The container component
 */
const MasterPicContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: PicRouteState | null = location.state;
  const { goBack, goCreate, goEdit } = useMasterPicNavigation();
  const { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore } = useMasterPicContainerState();
  const { canCreate, canEdit } = usePagePermission("/master-pic");

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterPicComponent
        {...pagination}
        onBack={goBack}
        onCreate={canCreate ? goCreate : undefined}
        onEdit={canEdit ? goEdit : undefined}
        onRowClick={canEdit ? goEdit : undefined}
        onMore={canEdit ? toggleMore : undefined}
        isMoreOpen={isMoreOpen}
        onCloseMore={handleCloseMore}
        onDelete={canEdit ? goDelete : undefined}
      />
    </>
  );
};

export default MasterPicContainer;
