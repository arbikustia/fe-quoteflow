import type { ReactElement } from "react";
import { useEffect, useState } from "react";

// import DesktopOrderCreate from "../../../modules/order/desktop-order-create";
import MobileOrderCreate from "../../../modules/order/mobile-order-create";

/**
 * Order create page
 * @returns {ReactElement} Order create page component
 */
export default function OrderPageCreate(): ReactElement {
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
    return <MobileOrderCreate />;
  }

  // return <DesktopOrderCreate />;
  return <div></div>;
}
