import type { ReactElement } from "react";

import Layout from "@/app/layout";

import { MasterItemCreateForm } from "./MasterItemCreate.component";
import { useMasterItemCreateForm } from "./MasterItemCreate.hook";

/**
 * Render Master Item create container.
 * @returns {ReactElement} Item create page element
 */
const MasterItemCreateContainer = (): ReactElement => {
  const formState = useMasterItemCreateForm();

  return (
    <Layout>
      <MasterItemCreateForm {...formState} />
    </Layout>
  );
};

export default MasterItemCreateContainer;
