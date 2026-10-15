import type { ReactElement } from "react";
import { useMemo } from "react";

import { getColumns } from "./MasterCategory.columns";
import { MasterCategoryComponent } from "./MasterCategory.component";
import {
  useMasterCategoryContainerState,
  useMasterCategoryNavigation,
} from "./MasterCategory.hook";
import type { CategoryData } from "./MasterCategory.type";

/**
 * Master Category Container.
 * @returns {ReactElement} Container element
 */
const MasterCategoryContainer = (): ReactElement => {
  const { goBack, goCreate, goEdit, goDetail } = useMasterCategoryNavigation();
  const { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete } = useMasterCategoryContainerState();
  
  const columns = useMemo(() => getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
    onDelete: (_data: CategoryData) => {},
  }), [pagination.currentPage, pagination.pageSize, goEdit]);

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
