import * as React from "react";

import { getColumns } from "./MasterCategory.columns";
import { MasterCategoryComponent } from "./MasterCategory.component";
import { useMasterCategoryContainerState, useMasterCategoryNavigation } from "./MasterCategory.hook";

/**
 * Master Category Container.
 * @returns {React.ReactElement} Container element
 */
const MasterCategoryContainer = (): React.ReactElement => {
  const { goBack, goCreate, goEdit, goDetail } = useMasterCategoryNavigation();
  const { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete } = useMasterCategoryContainerState();
  const columns = getColumns({ currentPage: pagination.currentPage, pageSize: pagination.pageSize, onEdit: goEdit, onDelete: goDelete });

  return (
    <MasterCategoryComponent
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

export default MasterCategoryContainer;
