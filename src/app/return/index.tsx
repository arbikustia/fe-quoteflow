import type { ReactElement } from "react";

import ResponsiveLayout from "../shared/ResponsiveLayout";
import DesktopReturn from "../../modules/return/desktop-return";
import MobileReturn from "../../modules/return/mobile-return";

/**
 * Return page using CSS-only responsive layout.
 * @returns {ReactElement} Return page component
 */
export default function ReturnPage(): ReactElement {
  return (
    <ResponsiveLayout pageTitle="Return Equipment">
      <div className="hidden lg:block">
        <DesktopReturn />
      </div>
      <div className="lg:hidden">
        <MobileReturn />
      </div>
    </ResponsiveLayout>
  );
}
