import type { ReactElement } from "react";

import { MasterCustomerDetailComponent } from "./MasterCustomerDetail.component";
import { useMasterCustomerDetail } from "./MasterCustomerDetail.hook";

/**
 * Master Customer Detail page container.
 * @returns {ReactElement} Container element
 */
const MasterCustomerDetailContainer = (): ReactElement => {
  const detailState = useMasterCustomerDetail();

  return <MasterCustomerDetailComponent {...detailState} />;
};

export default MasterCustomerDetailContainer;
