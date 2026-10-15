import type { ReactElement } from "react";

import { MasterVoucherCreateComponent } from "./MasterVoucherCreate.component";
import { useMasterVoucherCreateForm } from "./MasterVoucherCreate.hook";

/** Render master voucher create container.
 * @returns {ReactElement} Create container
 */
const MasterVoucherCreateContainer = (): ReactElement => <MasterVoucherCreateComponent {...useMasterVoucherCreateForm()} />;

export default MasterVoucherCreateContainer;
