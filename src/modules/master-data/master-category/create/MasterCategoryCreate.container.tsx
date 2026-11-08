import type { ReactElement } from "react";

import { MasterCategoryCreateForm } from "./MasterCategoryCreate.component";
import { useMasterCategoryCreate } from "./MasterCategoryCreate.hook";

import Layout from "@/app/layout";

/**
 * Master Category Create page container.
 *
 * @returns {ReactElement} create page element
 */
const MasterCategoryCreateContainer = (): ReactElement => {
  const formState = useMasterCategoryCreate();

  return (
    <Layout>
      <MasterCategoryCreateForm {...formState} />
    </Layout>
  );
};

export default MasterCategoryCreateContainer;
