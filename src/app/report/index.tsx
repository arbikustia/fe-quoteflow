import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import MobileLayout from "../shared/MobileLayout";
import { DesktopReport, MobileReport } from "../../modules/report";

/**
 * Report list page - responsive wrapper.
 * @returns {ReactElement} report page
 */
export default function ReportPage(): ReactElement {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);

    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <MobileLayout>
        <MobileReport />
      </MobileLayout>
    );
  }

  return <DesktopReport />;
}
