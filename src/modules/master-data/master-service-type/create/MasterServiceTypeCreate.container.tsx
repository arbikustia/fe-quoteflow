import type { ReactElement } from "react";

import { MasterServiceTypeCreateComponent } from "./MasterServiceTypeCreate.component";
import { useMasterServiceTypeCreateForm } from "./MasterServiceTypeCreate.hook";

/**
 * Render Master Service Type Create Container.
 * @returns {ReactElement} Container
 */
const MasterServiceTypeCreateContainer = (): ReactElement => {
  const formState = useMasterServiceTypeCreateForm();

  return <MasterServiceTypeCreateComponent {...formState} />;
};

export default MasterServiceTypeCreateContainer;
