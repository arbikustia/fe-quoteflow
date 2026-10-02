import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import MobileMasterMain from "./mobile";
import Layout from "../layout";
import MobileLayout from "../shared/MobileLayout";
import DesktopMasterMain from "../../modules/master-main";

/**
 * Render the responsive master data landing page.
 * @returns {ReactElement} - master data page
 */
export default function MasterMainPage(): ReactElement {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);

    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <MobileLayout>
        <MobileMasterMain />
      </MobileLayout>
    );
  }

  return (
    <Layout>
      <DesktopMasterMain />
    </Layout>
  );
}

