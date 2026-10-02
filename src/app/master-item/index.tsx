import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import MobileLayout from "../shared/MobileLayout";
import { DesktopMasterItem, MobileMasterItem } from "../../modules/master-item";

/**
 * Master item page
 * @returns {ReactElement} Master item page component
 */
export default function MasterItemPage(): ReactElement {
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
        <MobileMasterItem />
      </MobileLayout>
    );
  }

  return <DesktopMasterItem />;
}
