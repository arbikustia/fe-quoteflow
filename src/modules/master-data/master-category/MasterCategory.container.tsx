import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterCategoryComponent from "./MasterCategory.component";
import { MASTER_CATEGORY_ROUTE } from "./MasterCategory.config";
import { useMasterCategory } from "./MasterCategory.hook";
import type { CategoryRouteState } from "./MasterCategory.type";
import { normalizeCategoryList } from "./MasterCategory.util";

import { useGetCategoriesQuery } from "@/services/master-category.service";

/**
 * Render the category list container.
 * @returns {React.ReactElement} - Container of the category list view
 */
const MasterCategoryContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: CategoryRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_CATEGORY_ROUTE.LIST);
  const controller = useMasterCategory();
  const { data, isLoading, isError } = useGetCategoriesQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizeCategoryList({ data, isLoading, isError });

  return (
    <MasterCategoryComponent
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

export default MasterCategoryContainer;
