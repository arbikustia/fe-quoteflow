import type { ReactElement } from "react";

import { MasterPicDetailComponent } from "./MasterPicDetail.component";
import { useMasterPicDetail } from "./MasterPicDetail.hook";

/**
 * Render Master PIC Detail Container.
 * @returns {ReactElement} Container
 */
const MasterPicDetailContainer = (): ReactElement => {
  const state = useMasterPicDetail();

  return <MasterPicDetailComponent {...state} />;
};

export default MasterPicDetailContainer;
