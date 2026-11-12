import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterPicComponent from "./MasterPic.component";
import { MASTER_PIC_ROUTE } from "./MasterPic.config";
import { useMasterPic } from "./MasterPic.hook";
import type { PicRouteState } from "./MasterPic.type";
import { normalizePicList } from "./MasterPic.util";

import { useGetPicsQuery } from "@/services/master-pic.service";

/**
 * Render the PIC list container.
 * @returns {React.ReactElement} - Container of the PIC list view
 */
const MasterPicContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: PicRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_PIC_ROUTE.LIST);
  const controller = useMasterPic();
  const { data, isLoading, isError } = useGetPicsQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizePicList({ data, isLoading, isError });

  return (
    <MasterPicComponent
      {...listView}
      currentPage={controller.currentPage}
      pageSize={controller.pageSize}
      canCreate={canCreate}
      canEdit={canEdit}
      successMessage={routeState?.successMessage}
      onPageChange={controller.handlePageChange}
      onPageSizeChange={controller.handlePageSizeChange}
      onSearchChange={controller.handleSearchChange}
      onBack={controller.handleBack}
      onCreate={controller.handleCreate}
      onEdit={controller.handleEdit}
    />
  );
};

export default MasterPicContainer;
