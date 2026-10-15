import type { ReactElement } from "react";

import { MasterVoucherDetailComponent } from "./MasterVoucherDetail.component";
import { useMasterVoucherDetail } from "./MasterVoucherDetail.hook";

/** Render master voucher detail container.
 * @returns {ReactElement} Detail container
 */
const MasterVoucherDetailContainer = (): ReactElement => <MasterVoucherDetailComponent {...useMasterVoucherDetail()} />;

export default MasterVoucherDetailContainer;
