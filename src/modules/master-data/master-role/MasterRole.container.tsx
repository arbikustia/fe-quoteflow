import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterRoleComponent from "./MasterRole.component";
import { MASTER_ROLE_ROUTE } from "./MasterRole.config";
import { useMasterRole } from "./MasterRole.hook";
import type { RoleRouteState } from "./MasterRole.type";
import { normalizeRoleList } from "./MasterRole.util";

import { useGetRolesQuery } from "@/services/master-role.service";

/**
 * Render the role list container.
 * @returns {React.ReactElement} - Container of the role list view
 */
const MasterRoleContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: RoleRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_ROLE_ROUTE.LIST);
  const controller = useMasterRole();
  const { data, isLoading, isError } = useGetRolesQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizeRoleList({ data, isLoading, isError });

  return (
    <MasterRoleComponent
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

export default MasterRoleContainer;
