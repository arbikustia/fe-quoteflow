import type { ReactElement } from "react";

import { MasterPaymentTypeDetailComponent } from "./MasterPaymentTypeDetail.component";
import { useMasterPaymentTypeDetail } from "./MasterPaymentTypeDetail.hook";

/**
 * Render Master Payment Type Detail Container
 * @returns {ReactElement} Container
 */
const MasterPaymentTypeDetailContainer = (): ReactElement => {
  const state = useMasterPaymentTypeDetail();

  return <MasterPaymentTypeDetailComponent {...state} />;
};

export default MasterPaymentTypeDetailContainer;
