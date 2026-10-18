import type { ReactElement } from "react";

import { MasterUserDetailComponent } from "./MasterUserDetail.component";
import { useMasterUserDetail } from "./MasterUserDetail.hook";

/**
 * Render master user detail container.
 * @returns {ReactElement} Container element
 */
const MasterUserDetailContainer = (): ReactElement => <MasterUserDetailComponent {...useMasterUserDetail()} />;

export default MasterUserDetailContainer;
