import type { ReactElement } from "react";

import Layout from "../layout";
import MasterMain from "../../modules/master-data/master-main";

/**
 * Render responsive master data landing page.
 * @returns {ReactElement} - master data page
 */
export default function MasterMainPage(): ReactElement {
  return (
    <Layout pageTitle="Master Data" mobileWhiteBackground={false}>
      <MasterMain />
    </Layout>
  );
}
