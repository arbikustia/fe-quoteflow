import type { ReactElement } from "react";

import { MobileReturnDetailComponent } from "./MobileReturnDetail.component";
import { useMobileReturnDetail } from "./MobileReturnDetail.hook";

/**
 * Mobile Return Detail Container
 * @returns {ReactElement} container
 */
const MobileReturnDetailContainer = (): ReactElement => {
  const props = useMobileReturnDetail();

  return <MobileReturnDetailComponent {...props} />;
};

export default MobileReturnDetailContainer;
