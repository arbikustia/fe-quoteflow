import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import MobileOrderDetail from "../../../modules/order/mobile-order-detail";

/**
 * Order detail page
 * @returns {ReactElement} Order detail page component
 */
export default function OrderPageDetail(): ReactElement {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { id } = useParams();

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
    return <MobileOrderDetail />;
  }

  return <Navigate to={`/order/edit/${id}`} replace />;
}
