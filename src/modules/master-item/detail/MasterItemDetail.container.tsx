/* eslint-disable jsdoc/require-returns */
import type { ReactElement } from "react";

import { MasterItemDetailComponent } from "./MasterItemDetail.component";
import { useMasterItemDetail } from "./MasterItemDetail.hook";

/** Item detail page. @returns {ReactElement} Page */
const MasterItemDetailContainer = (): ReactElement => {
  const detailState = useMasterItemDetail();

  return <MasterItemDetailComponent {...detailState} />;
};

export default MasterItemDetailContainer;
