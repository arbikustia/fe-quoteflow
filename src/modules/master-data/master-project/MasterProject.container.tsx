import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterProjectComponent from "./MasterProject.component";
import { MASTER_PROJECT_ROUTE } from "./MasterProject.config";
import { useMasterProject } from "./MasterProject.hook";
import type { ProjectRouteState } from "./MasterProject.type";
import { normalizeProjectList } from "./MasterProject.util";

import { useGetProjectsQuery } from "@/services/master-project.service";

/**
 * Render the project list container.
 * @returns {React.ReactElement} - Container of the project list view
 */
const MasterProjectContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: ProjectRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_PROJECT_ROUTE.LIST);
  const controller = useMasterProject();
  const { data, isLoading, isError } = useGetProjectsQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizeProjectList({ data, isLoading, isError });

  return (
    <MasterProjectComponent
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

export default MasterProjectContainer;
