import type { ReactElement } from "react";

import { usePagePermission } from "@/hooks/usePagePermission";

import { ActivityLogComponent } from "./ActivityLog.component";
import { useActivityLogNavigation, useActivityLogPagination } from "./ActivityLog.hook";

/**
 * Render activity log container.
 * @returns {ReactElement} Activity log page
 */
const ActivityLogContainer = (): ReactElement | null => {
  const pagination = useActivityLogPagination();
  const navigation = useActivityLogNavigation();
  const { canView } = usePagePermission("/activity-log");

  if (!canView) return null;

  return <ActivityLogComponent {...pagination} {...navigation} />;
};

export default ActivityLogContainer;
