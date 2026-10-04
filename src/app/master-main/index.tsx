import type { ReactElement } from "react";

import Layout from "../layout";
import MasterMain from "../../modules/master-main";

/**
 * Render the responsive master data landing page.
 * @returns {ReactElement} - master data page
 */
export default function MasterMainPage(): ReactElement {
  return (
    <Layout>
      <MasterMain />
    </Layout>
  );
}

