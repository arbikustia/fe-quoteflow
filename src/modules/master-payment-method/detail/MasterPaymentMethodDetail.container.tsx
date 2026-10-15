import type { ReactElement } from "react";

import { MasterPaymentMethodDetailComponent } from "./MasterPaymentMethodDetail.component";
import { useMasterPaymentMethodDetail } from "./MasterPaymentMethodDetail.hook";

/**
 * Master Payment Method Detail container.
 * @returns {ReactElement} Container
 */
const MasterPaymentMethodDetailContainer = (): ReactElement => {
  const detailState = useMasterPaymentMethodDetail();

  return <MasterPaymentMethodDetailComponent {...detailState} />;
};

export default MasterPaymentMethodDetailContainer;
