import type { ReactElement } from "react";

import { MasterItemDetailComponent } from "./MasterItemDetail.component";
import { useMasterItemDetail } from "./MasterItemDetail.hook";

/**
 * Render Master Item detail container.
 * @returns {ReactElement} Item detail page element
 */
const MasterItemDetailContainer = (): ReactElement => {
  const detailState = useMasterItemDetail();

  return <MasterItemDetailComponent {...detailState} />;
};

export default MasterItemDetailContainer;
