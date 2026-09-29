import * as React from "react";

import DesktopOrderCreateComponent from "./DesktopOrderCreate.component";
import { useDesktopOrderCreate } from "./DesktopOrderCreate.hook";

/**
 * Order Page Create Container
 * @returns {React.ReactElement} node
 */
const DesktopOrderCreateContainer = (): React.ReactElement => {
  const state = useDesktopOrderCreate();
  
  return <DesktopOrderCreateComponent {...state} />;
};

export default DesktopOrderCreateContainer;
