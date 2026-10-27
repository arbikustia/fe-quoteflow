import type { ReactElement } from "react";

import { ActivityLogComponent } from "./ActivityLog.component";
import { useActivityLogNavigation, useActivityLogPagination } from "./ActivityLog.hook";

/**
 * Render activity log container.
 * @returns {ReactElement} Activity log page
 */
const ActivityLogContainer = (): ReactElement => {
  const pagination = useActivityLogPagination();
  const navigation = useActivityLogNavigation();

  return <ActivityLogComponent {...pagination} {...navigation} />;
};

export default ActivityLogContainer;
