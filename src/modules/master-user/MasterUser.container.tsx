import * as React from "react";

import { getColumns } from "./MasterUser.columns";
import { MasterUserComponent } from "./MasterUser.component";
import { useMasterUserContainerState } from "./MasterUser.hook";

/**
 * Master User Container
 * @returns {React.ReactElement} Container component
 */
const MasterUserContainer = (): React.ReactElement => {
  const containerState = useMasterUserContainerState();

  const columns = getColumns({
    currentPage: containerState.pagination.currentPage,
    pageSize: containerState.pagination.pageSize,
    onEdit: containerState.goEdit,
  });

  return (
    <MasterUserComponent
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

export default MasterUserContainer;
