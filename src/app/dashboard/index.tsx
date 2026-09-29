import { useEffect,useState } from "react";

import MobileLayout from "../shared/MobileLayout";
import DesktopDashboard from "../../modules/dashboard/desktop-dashboard";
import MobileDashboard from "../../modules/dashboard/mobile-dashboard";

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <MobileLayout>
        <MobileDashboard />
      </MobileLayout>
    );
  }

  return <DesktopDashboard />;
}
