import * as React from "react";

import { getColumns } from "./MasterPaymentType.columns";
import { MasterPaymentTypeComponent } from "./MasterPaymentType.component";
import { useMasterPaymentTypeContainerState } from "./MasterPaymentType.hook";

/**
 * Master Payment Type Container.
 * @returns {React.ReactElement} Container component
 */
const MasterPaymentTypeContainer = (): React.ReactElement => {
  const containerState = useMasterPaymentTypeContainerState();
  const columns = getColumns({
    currentPage: containerState.pagination.currentPage,
    pageSize: containerState.pagination.pageSize,
    onEdit: containerState.goEdit,
  });

  return (
    <MasterPaymentTypeComponent
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

export default MasterPaymentTypeContainer;
