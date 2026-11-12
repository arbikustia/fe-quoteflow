import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterOrderTypeComponent from "./MasterOrderType.component";
import { MASTER_ORDER_TYPE_ROUTE } from "./MasterOrderType.config";
import { useMasterOrderType } from "./MasterOrderType.hook";
import type { OrderTypeRouteState } from "./MasterOrderType.type";
import { normalizeOrderTypeList } from "./MasterOrderType.util";

import { useGetOrderTypesQuery } from "@/services/master-order-type.service";

/**
 * Render the order type list container.
 * @returns {React.ReactElement} - Container of the order type list view
 */
const MasterOrderTypeContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: OrderTypeRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_ORDER_TYPE_ROUTE.LIST);
  const controller = useMasterOrderType();
  const { data, isLoading, isError } = useGetOrderTypesQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizeOrderTypeList({ data, isLoading, isError });

  return (
    <MasterOrderTypeComponent
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

export default MasterOrderTypeContainer;
