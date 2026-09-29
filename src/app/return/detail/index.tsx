import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import MobileReturnDetail from "../../../modules/return/mobile-return-detail";

/**
 * Return detail page
 * @returns {ReactElement} Return detail page component
 */
export default function ReturnPageDetail(): ReactElement {
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
      <MobileReturnDetail />
    );
  }

  return <Navigate to="/return" replace />;
}
