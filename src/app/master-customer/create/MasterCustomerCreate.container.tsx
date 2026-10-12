import type { ReactElement } from "react";

import { MasterCustomerCreateForm } from "./MasterCustomerCreate.component";
import { useMasterCustomerCreate } from "./MasterCustomerCreate.hook";

/**
 * Master Customer Create page container.
 * @returns {ReactElement} create page element
 */
const MasterCustomerCreateContainer = (): ReactElement => {
  const formState = useMasterCustomerCreate();

  return <MasterCustomerCreateForm {...formState} />;
};

export default MasterCustomerCreateContainer;
