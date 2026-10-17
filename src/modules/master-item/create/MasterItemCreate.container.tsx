import type { ReactElement } from "react";

import { MasterItemCreateForm } from "./MasterItemCreate.component";
import { useMasterItemCreateForm } from "./MasterItemCreate.hook";

import Layout from "@/app/layout";

/**
 * Render Master Item create container.
 * @returns {ReactElement} Item create page element
 */
const MasterItemCreateContainer = (): ReactElement => {
  const formState = useMasterItemCreateForm();

  return (
    <Layout mobileWhiteBackground={true}>
      <MasterItemCreateForm {...formState} />
    </Layout>
  );
};

export default MasterItemCreateContainer;
