import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";

import type { ItemRouteState } from "./create/MasterItemCreate.type";
import { MasterItemComponent } from "./MasterItem.component";
import { useMasterItemContainerState } from "./MasterItem.hook";

/**
 * Master Item container
 * @returns {React.ReactElement} Container component
 */
const MasterItemContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: ItemRouteState | null = location.state;
  const containerState = useMasterItemContainerState();
  const navigation = containerState;
  const pagination = containerState.pagination;

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterItemComponent
        {...pagination}
        selectedItemIds={containerState.selectedItemIds}
        isMultiDownloadMode={containerState.isMultiDownloadMode}
        onToggleItem={containerState.onToggleItem}
        onToggleMultiDownload={containerState.onToggleMultiDownload}
        onCancelMultiDownload={containerState.onCancelMultiDownload}
        onDownload={containerState.onDownload}
        onDownloadSelected={containerState.onDownloadSelected}
        onBack={navigation.goBack}
        onCreate={navigation.goCreate}
        onEdit={navigation.goEdit}
        onMore={containerState.toggleMore}
        isMoreOpen={containerState.isMoreOpen}
        onCloseMore={containerState.handleCloseMore}
        onDelete={containerState.goDelete}
      />
    </>
  );
};

export default MasterItemContainer;
