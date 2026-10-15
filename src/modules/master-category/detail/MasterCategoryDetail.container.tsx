import type { ReactElement } from "react";

import { MasterCategoryDetailComponent } from "./MasterCategoryDetail.component";
import { useMasterCategoryDetail } from "./MasterCategoryDetail.hook";

/**
 * Master Category Detail page container.
 * @returns {ReactElement} Container element
 */
const MasterCategoryDetailContainer = (): ReactElement => {
  const detailState = useMasterCategoryDetail();

  return <MasterCategoryDetailComponent {...detailState} />;
};

export default MasterCategoryDetailContainer;
