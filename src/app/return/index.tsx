import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import MobileLayout from "../shared/MobileLayout";
import DesktopReturn from "../../modules/return/desktop-return";
import MobileReturn from "../../modules/return/mobile-return";

/**
 * Return page
 * @returns {ReactElement} Return page component
 */
export default function ReturnPage(): ReactElement {
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
        <MobileReturn />
      </MobileLayout>
    );
  }

  return <DesktopReturn />;
}
