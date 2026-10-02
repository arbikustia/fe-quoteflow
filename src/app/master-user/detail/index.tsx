
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import MobileMasterUserDetail from "../../../modules/master-user/mobile-master-user-detail";

/**
 * Render Master User Page Detail
 * @returns {ReactElement} - Master User Page Detail Component
 */
export default function MasterUserPageDetail(): ReactElement {
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
    return <MobileMasterUserDetail />;
  }

  return <div>Desktop Master User Detail (Not Implemented)</div>;
}
