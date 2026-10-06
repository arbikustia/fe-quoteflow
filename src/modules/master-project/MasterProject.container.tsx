import * as React from "react";

import { getColumns } from "./MasterProject.columns";
import { MasterProjectComponent } from "./MasterProject.component";
import { useMasterProjectContainerState } from "./MasterProject.hook";

/**
 * Master Project Container
 * @returns {React.ReactElement} Container component
 */
const MasterProjectContainer = (): React.ReactElement => {
  const containerState = useMasterProjectContainerState();

  const columns = getColumns({
    currentPage: containerState.pagination.currentPage,
    pageSize: containerState.pagination.pageSize,
    onEdit: containerState.goEdit,
  });

  return (
    <MasterProjectComponent
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

export default MasterProjectContainer;
