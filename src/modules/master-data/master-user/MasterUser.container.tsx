import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterUserComponent from "./MasterUser.component";
import { MASTER_USER_ROUTE } from "./MasterUser.config";
import { useMasterUser } from "./MasterUser.hook";
import type { UserRouteState } from "./MasterUser.type";
import { normalizeUserList } from "./MasterUser.util";

import { useGetUsersQuery } from "@/services/master-user.service";

/**
 * Render the user list container.
 * @returns {React.ReactElement} - Container of the user list view
 */
const MasterUserContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: UserRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_USER_ROUTE.LIST);
  const controller = useMasterUser();
  const { data, isLoading, isError } = useGetUsersQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizeUserList({ data, isLoading, isError });

  return (
    <MasterUserComponent
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

export default MasterUserContainer;
