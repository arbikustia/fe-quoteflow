import * as React from "react";

import { getColumns } from "./MasterCustomer.columns";
import { MasterCustomerComponent } from "./MasterCustomer.component";
import { useMasterCustomerContainerState, useMasterCustomerNavigation } from "./MasterCustomer.hook";

/**
 * Master Customer Container
 * @returns {React.ReactElement} Container element
 */
const MasterCustomerContainer = (): React.ReactElement => {
  const { goBack, goCreate, goEdit, goDetail } = useMasterCustomerNavigation();
  const { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete } = useMasterCustomerContainerState();

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterCustomerComponent
      {...pagination}
      columns={columns}
      isMoreOpen={isMoreOpen}
      onBack={goBack}
      onCreate={goCreate}
      onEdit={goEdit}
      onRowClick={goDetail}
      onMore={toggleMore}
      onCloseMore={handleCloseMore}
      onDelete={goDelete}
    />
  );
};

export default MasterCustomerContainer;
