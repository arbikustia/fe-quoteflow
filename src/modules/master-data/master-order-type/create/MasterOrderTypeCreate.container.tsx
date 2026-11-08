import type { ReactElement } from "react";

import { MasterOrderTypeCreateForm } from "./MasterOrderTypeCreate.component";
import { useMasterOrderTypeCreate } from "./MasterOrderTypeCreate.hook";

import Layout from "@/app/layout";

/**
 * Master Order Type Create page container.
 *
 * @returns {ReactElement} create page element
 */
const MasterOrderTypeCreateContainer = (): ReactElement => {
  const formState = useMasterOrderTypeCreate();

  return (
    <Layout mobileWhiteBackground={true} showMobileGlobalHeader={true}>
      <MasterOrderTypeCreateForm {...formState} />
    </Layout>
  );
};

export default MasterOrderTypeCreateContainer;
