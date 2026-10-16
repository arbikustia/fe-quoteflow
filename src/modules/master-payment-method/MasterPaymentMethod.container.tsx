import * as React from "react";

import { getColumns } from "./MasterPaymentMethod.columns";
import { MasterPaymentMethodComponent } from "./MasterPaymentMethod.component";
import { useMasterPaymentMethodContainerState } from "./MasterPaymentMethod.hook";

/**
 * Master Payment Method Container.
 * @returns {React.ReactElement} Container component
 */
const MasterPaymentMethodContainer = (): React.ReactElement => {
  const containerState = useMasterPaymentMethodContainerState();
  const columns = getColumns({
    currentPage: containerState.pagination.currentPage,
    pageSize: containerState.pagination.pageSize,
    onEdit: containerState.goEdit,
  });

  return (
    <MasterPaymentMethodComponent
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

export default MasterPaymentMethodContainer;
