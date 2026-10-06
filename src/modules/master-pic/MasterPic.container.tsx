import * as React from "react";

import { getColumns } from "./MasterPic.columns";
import { MasterPicComponent } from "./MasterPic.component";
import { useMasterPicContainerState, useMasterPicNavigation } from "./MasterPic.hook";

/**
 * Master PIC container component
 * @returns {React.ReactElement} The container component
 */
const MasterPicContainer = (): React.ReactElement => {
  const { goBack, goCreate, goEdit, goDetail } = useMasterPicNavigation();
  const { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore } = useMasterPicContainerState();

  const columns = getColumns({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    onEdit: goEdit,
  });

  return (
    <MasterPicComponent
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

export default MasterPicContainer;
