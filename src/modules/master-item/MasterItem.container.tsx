import * as React from "react";

import { getColumns } from "./MasterItem.columns";
import { MasterItemComponent } from "./MasterItem.component";
import { useMasterItemContainerState } from "./MasterItem.hook";

/**
 * Master Item container
 * @returns {React.ReactElement} Container component
 */
const MasterItemContainer = (): React.ReactElement => {
  const containerState = useMasterItemContainerState();

  const columns = getColumns({
    currentPage: containerState.pagination.currentPage,
    pageSize: containerState.pagination.pageSize,
    onEdit: containerState.goEdit,
    onConfirm: containerState.handleConfirm,
  });

  return (
    <MasterItemComponent
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

export default MasterItemContainer;
