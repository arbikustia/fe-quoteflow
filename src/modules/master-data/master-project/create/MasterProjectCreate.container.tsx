import type { ReactElement } from "react";

import { MasterProjectCreateForm } from "./MasterProjectCreate.component";
import { useMasterProjectCreate } from "./MasterProjectCreate.hook";

/**
 * Master project create page container.
 * @returns {ReactElement} Create page element
 */
const MasterProjectCreateContainer = (): ReactElement => {
  const formState = useMasterProjectCreate();

  return <MasterProjectCreateForm {...formState} />;
};

export default MasterProjectCreateContainer;
