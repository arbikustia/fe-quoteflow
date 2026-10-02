
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import MobileMasterUserCreate from "../../../modules/master-user/mobile-master-user-create";

/**
 * Render Master User Page Create
 * @returns {ReactElement} - Master User Page Create Component
 */
export default function MasterUserPageCreate(): ReactElement {
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
    return <MobileMasterUserCreate />;
  }

  return <div>Desktop Master User Create (Not Implemented)</div>;
}
