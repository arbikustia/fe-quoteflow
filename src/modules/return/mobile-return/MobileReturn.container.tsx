import type { ReactElement } from "react";

import { MobileReturnComponent } from "./MobileReturn.component";
import { useMobileReturn } from "./MobileReturn.hook";

/**
 * Mobile Return Container
 * @returns {ReactElement} container
 */
const MobileReturnContainer = (): ReactElement => {
  const props = useMobileReturn();
  
  return <MobileReturnComponent {...props} />;
};

export default MobileReturnContainer;
