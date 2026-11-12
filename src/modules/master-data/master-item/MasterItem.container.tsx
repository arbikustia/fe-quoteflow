import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterItemComponent from "./MasterItem.component";
import { MASTER_ITEM_ROUTE } from "./MasterItem.config";
import { useMasterItem } from "./MasterItem.hook";
import type { ItemRouteState } from "./MasterItem.type";
import { normalizeItemList } from "./MasterItem.util";

import { useGetItemsQuery } from "@/services/master-item.service";

/**
 * Render the item list container.
 * @returns {React.ReactElement} - Container of the item list view
 */
const MasterItemContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: ItemRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_ITEM_ROUTE.LIST);
  const controller = useMasterItem();
  const { data, isLoading, isError } = useGetItemsQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizeItemList({ data, isLoading, isError });

  return (
    <MasterItemComponent
      {...listView}
      currentPage={controller.currentPage}
      pageSize={controller.pageSize}
      canCreate={canCreate}
      canEdit={canEdit}
      successMessage={routeState?.successMessage}
      selectedItemIds={controller.selectedItemIds}
      isMultiDownloadMode={controller.isMultiDownloadMode}
      onPageChange={controller.handlePageChange}
      onPageSizeChange={controller.handlePageSizeChange}
      onSearchChange={controller.handleSearchChange}
      onBack={controller.handleBack}
      onCreate={controller.handleCreate}
      onEdit={controller.handleEdit}
      onToggleItem={controller.handleToggleItem}
      onStartMultiDownload={controller.handleStartMultiDownload}
      onCancelMultiDownload={controller.handleCancelMultiDownload}
      onDownload={controller.handleDownload}
      onDownloadSelected={controller.handleDownloadSelected}
    />
  );
};

export default MasterItemContainer;
