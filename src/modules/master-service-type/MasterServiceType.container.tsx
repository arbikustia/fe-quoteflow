import * as React from "react";

import { getColumns } from "./MasterServiceType.columns";
import { MasterServiceTypeComponent } from "./MasterServiceType.component";
import { useMasterServiceTypeContainerState } from "./MasterServiceType.hook";

/**
 * Master Service Type Container
 * @returns {React.ReactElement} Container component
 */
const MasterServiceTypeContainer = (): React.ReactElement => {
  const containerState = useMasterServiceTypeContainerState();

  const columns = getColumns({
    currentPage: containerState.pagination.currentPage,
    pageSize: containerState.pagination.pageSize,
    onEdit: containerState.goEdit,
  });

  return (
    <MasterServiceTypeComponent
      {...containerState.pagination}
      columns={columns}
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
