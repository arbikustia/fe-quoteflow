import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import DesktopMasterUser from "../../modules/master-user/desktop-master-user";
import MobileMasterUser from "../../modules/master-user/mobile-master-user";
import MobileLayout from "../shared/MobileLayout";

/**
 * Render Master User Page
 * @returns {ReactElement} - Master User Page Component
 */
export default function MasterUserPage(): ReactElement {
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
        <MobileMasterUser />
      </MobileLayout>
    );
  }

  return <DesktopMasterUser />;
}
