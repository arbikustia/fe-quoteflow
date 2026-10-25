import * as React from "react";

import { MasterCategoryComponent } from "./MasterCategory.component";
import { useMasterCategoryContainerState, useMasterCategoryNavigation } from "./MasterCategory.hook";

/**
 * Master Category Container.
 * @returns {React.ReactElement} Container element
 */
const MasterCategoryContainer = (): React.ReactElement => {
  const { goBack, goCreate, goEdit } = useMasterCategoryNavigation();
  const { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete } = useMasterCategoryContainerState();
  return (
    <MasterCategoryComponent
      {...pagination}
      isMoreOpen={isMoreOpen}
      onBack={goBack}
      onCreate={goCreate}
      onEdit={goEdit}
      onMore={toggleMore}
      onCloseMore={handleCloseMore}
      onDelete={goDelete}
    />
  );
};

export default MasterCategoryContainer;
