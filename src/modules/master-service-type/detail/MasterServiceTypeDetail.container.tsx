import type { ReactElement } from "react";

import { MasterServiceTypeDetailComponent } from "./MasterServiceTypeDetail.component";
import { useMasterServiceTypeDetail } from "./MasterServiceTypeDetail.hook";

/**
 * Render Master Service Type Detail Container.
 * @returns {ReactElement} Container
 */
const MasterServiceTypeDetailContainer = (): ReactElement => {
  const state = useMasterServiceTypeDetail();

  return <MasterServiceTypeDetailComponent {...state} />;
};

export default MasterServiceTypeDetailContainer;
