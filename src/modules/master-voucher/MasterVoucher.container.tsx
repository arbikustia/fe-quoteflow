import * as React from "react";

import { getColumns } from "./MasterVoucher.columns";
import { MasterVoucherComponent } from "./MasterVoucher.component";
import { useMasterVoucherContainerState } from "./MasterVoucher.hook";

/**
 * Master Voucher Container
 * @returns {React.ReactElement} Container component
 */
const MasterVoucherContainer = (): React.ReactElement => {
  const containerState = useMasterVoucherContainerState();

  const columns = getColumns({
    currentPage: containerState.pagination.currentPage,
    pageSize: containerState.pagination.pageSize,
    onEdit: containerState.goEdit,
  });

  return (
    <MasterVoucherComponent
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

export default MasterVoucherContainer;
