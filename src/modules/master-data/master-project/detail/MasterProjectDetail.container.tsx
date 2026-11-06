import type { ReactElement } from "react";

import { MasterProjectDetailComponent } from "./MasterProjectDetail.component";
import { useMasterProjectDetail } from "./MasterProjectDetail.hook";

/**
 * Render Master Project Detail Container.
 * @returns {ReactElement} Container
 */
const MasterProjectDetailContainer = (): ReactElement => {
  const state = useMasterProjectDetail();

  return <MasterProjectDetailComponent {...state} />;
};

export default MasterProjectDetailContainer;
