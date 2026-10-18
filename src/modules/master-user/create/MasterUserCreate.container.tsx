import type { ReactElement } from "react";

import { MasterUserCreateComponent } from "./MasterUserCreate.component";
import { useMasterUserCreateForm } from "./MasterUserCreate.hook";

/**
 * Render master user create container.
 * @returns {ReactElement} Container element
 */
const MasterUserCreateContainer = (): ReactElement => <MasterUserCreateComponent {...useMasterUserCreateForm()} />;

export default MasterUserCreateContainer;
