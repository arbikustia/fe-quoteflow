import * as React from "react";

import { MasterServiceTypeComponent } from "./MasterServiceType.component";
import { useMasterServiceTypeContainerState } from "./MasterServiceType.hook";

/**
 * Master Service Type Container
 * @returns {React.ReactElement} Container component
 */
const MasterServiceTypeContainer = (): React.ReactElement => {
  const containerState = useMasterServiceTypeContainerState();

  return (
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
  );
};

export default MasterServiceTypeContainer;
