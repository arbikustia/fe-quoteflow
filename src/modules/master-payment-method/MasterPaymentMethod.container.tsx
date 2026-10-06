import * as React from "react";

import { getColumns } from "./MasterPaymentMethod.columns";
import { MasterPaymentMethodComponent } from "./MasterPaymentMethod.component";
import { 
  useMasterPaymentMethodContainerState, 
  useMasterPaymentMethodNavigation 
} from "./MasterPaymentMethod.hook";

/**
 * Master Payment Method Container
 * @returns {React.ReactElement} container component
 */
const MasterPaymentMethodContainer = (): React.ReactElement => {
  const { 
    goBack, 
    goCreate, 
    goEdit, 
    goDetail 
  } = useMasterPaymentMethodNavigation();

  const {
    pagination,
    isMoreOpen,
    toggleMore,
    goDelete,
    handleCloseMore
  } = useMasterPaymentMethodContainerState();

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterPaymentMethodComponent
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

export default MasterPaymentMethodContainer;
