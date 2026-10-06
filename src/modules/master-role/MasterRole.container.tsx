import * as React from "react";

import { getColumns } from "./MasterRole.columns";
import { MasterRoleComponent } from "./MasterRole.component";
import { useMasterRoleContainerState } from "./MasterRole.hook";

/**
 * Master Role Container
 * @returns {React.ReactElement} Container component
 */
const MasterRoleContainer = (): React.ReactElement => {
  const containerState = useMasterRoleContainerState();

  const columns = getColumns({
    currentPage: containerState.pagination.currentPage,
    pageSize: containerState.pagination.pageSize,
    onEdit: containerState.goEdit,
  });

  return (
    <MasterRoleComponent
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

export default MasterRoleContainer;
