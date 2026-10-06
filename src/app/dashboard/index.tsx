import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import Layout from "../layout";
import MobileLayout from "../shared/MobileLayout";
import DesktopDashboard from "../../modules/dashboard/desktop-dashboard";
import MobileDashboard from "../../modules/dashboard/mobile-dashboard";

/**
 * Dashboard page
 * @returns {ReactElement} Dashboard component
 */
export default function Dashboard(): ReactElement {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    /**
     * Handle resize window
     * @returns {void} void
     */
    const handleResize = (): void => setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);

    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <MobileLayout>
        <MobileDashboard />
      </MobileLayout>
    );
  }

  return (
    <Layout pageTitle="Dashboard">
      <DesktopDashboard />
    </Layout>
  );
}
