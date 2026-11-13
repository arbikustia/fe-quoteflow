import type { ReactElement } from "react";

import DashboardComponent from "./Dashboard.component";
import { useDashboardAssetLoading, useDashboardCalendar, useDashboardMenuItems, useDashboardNavigation, useDashboardOrders, useDashboardOverview, useDashboardVoucherCount } from "./Dashboard.hook";

/**
 * Render the dashboard container.
 * @returns {ReactElement} - Dashboard page
 */
const DashboardContainer = (): ReactElement => {
  const { navigateTo } = useDashboardNavigation();
  const isAssetLoading = useDashboardAssetLoading();
  const voucherCount = useDashboardVoucherCount();
  const menuItems = useDashboardMenuItems();
  const overview = useDashboardOverview();
  const calendar = useDashboardCalendar();
  const orderState = useDashboardOrders();

  return (
    <DashboardComponent
      isLoading={isAssetLoading}
      voucherCount={voucherCount}
      menuItems={menuItems}
      overview={overview}
      calendar={calendar}
      orderState={orderState}
      onNavigate={navigateTo}
    />
  );
};

export default DashboardContainer;
