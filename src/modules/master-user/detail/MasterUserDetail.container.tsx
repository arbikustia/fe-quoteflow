/* eslint-disable jsdoc/require-returns */
import type { ReactElement } from "react";

import { MasterUserDetailComponent } from "./MasterUserDetail.component";
import { useMasterUserDetail } from "./MasterUserDetail.hook";

/** Render master user detail container. */
const MasterUserDetailContainer = (): ReactElement => <MasterUserDetailComponent {...useMasterUserDetail()} />;

export default MasterUserDetailContainer;
