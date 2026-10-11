import type { ReactElement } from "react";

import ResponsiveLayout from "../shared/ResponsiveLayout";
import DesktopDashboard from "../../modules/dashboard/desktop-dashboard";
import MobileDashboard from "../../modules/dashboard/mobile-dashboard";

/**
 * Dashboard page using CSS-only responsive rendering.
 * @returns {ReactElement} Dashboard component
 */
export default function Dashboard(): ReactElement {
  return (
    <ResponsiveLayout pageTitle="Dashboard">
      <div className="hidden lg:block">
        <DesktopDashboard />
      </div>
      <div className="lg:hidden">
        <MobileDashboard />
      </div>
    </ResponsiveLayout>
  );
}