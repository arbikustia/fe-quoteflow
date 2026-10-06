import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import Layout from "../layout";
import MobileLayout from "../shared/MobileLayout";
import MasterMain from "../../modules/master-main";

/**
 * Render the responsive master data landing page.
 * Detects mobile viewport and renders appropriate layout.
 * @returns {ReactElement} - master data page
 */
export default function MasterMainPage(): ReactElement {
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
        <MasterMain />
      </MobileLayout>
    );
  }

  return (
    <Layout>
      <MasterMain />
    </Layout>
  );
}

