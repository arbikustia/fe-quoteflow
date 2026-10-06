import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import MobileLayout from "../shared/MobileLayout";
import DesktopOrder from "../../modules/order/desktop-order";
import MobileOrder from "../../modules/order/mobile-order";

/**
 * Order page
 * @returns {ReactElement} Order page component
 */
export default function OrderPage(): ReactElement {
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
        <MobileOrder />
      </MobileLayout>
    );
  }

  return <DesktopOrder />;
}
