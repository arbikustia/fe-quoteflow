import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";

import { MasterCategoryComponent } from "./MasterCategory.component";
import { useMasterCategoryContainerState, useMasterCategoryNavigation } from "./MasterCategory.hook";
import type { CategoryRouteState } from "./MasterCategory.type";

/**
 * Master Category Container.
 *
 * @returns {React.ReactElement} Container element
 */
const MasterCategoryContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: CategoryRouteState | null = location.state;
  const { goBack, goCreate, goEdit } = useMasterCategoryNavigation();
  const { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete } = useMasterCategoryContainerState();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterCategoryComponent
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

export default MasterCategoryContainer;
