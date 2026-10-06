import * as React from "react";

import { getColumns } from "./MasterPaymentType.columns";
import { MasterPaymentTypeComponent } from "./MasterPaymentType.component";
import { 
  useMasterPaymentTypeContainerState, 
  useMasterPaymentTypeNavigation} from "./MasterPaymentType.hook";

/**
 * Master Payment Type Container
 * @returns {React.ReactElement} The container element
 */
const MasterPaymentTypeContainer = (): React.ReactElement => {
  const { goBack, goCreate, goEdit, goDetail } = useMasterPaymentTypeNavigation();
  const { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore } = useMasterPaymentTypeContainerState();

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterPaymentTypeComponent
      {...pagination}
      columns={columns}
      onBack={goBack}
      onCreate={goCreate}
      onEdit={goEdit}
      onRowClick={goDetail}
      onMore={toggleMore}
      isMoreOpen={isMoreOpen}
      onCloseMore={handleCloseMore}
      onDelete={goDelete}
    />
  );
};

export default MasterPaymentTypeContainer;
