import type { ReactElement } from "react";

import ResponsiveLayout from "../shared/ResponsiveLayout";
import DesktopOrder from "../../modules/order/desktop-order";
import MobileOrder from "../../modules/order/mobile-order";

/**
 * Order page using CSS-only responsive rendering.
 * @returns {ReactElement} Order page component
 */
export default function OrderPage(): ReactElement {
  return (
    <ResponsiveLayout showCreateButton={true} createEndpoint="/order/create">
      <div className="hidden lg:block">
        <DesktopOrder />
      </div>
      <div className="lg:hidden">
        <MobileOrder />
      </div>
    </ResponsiveLayout>
  );
}
