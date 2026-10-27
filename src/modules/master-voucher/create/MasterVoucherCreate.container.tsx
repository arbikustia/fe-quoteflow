import type { ReactElement } from "react";

import { MasterVoucherCreateComponent } from "./MasterVoucherCreate.component";
import { useMasterVoucherCreateForm } from "./MasterVoucherCreate.hook";

import Layout from "@/app/layout";

/** Render master voucher create container.
 * @returns {ReactElement} Create container
 */
const MasterVoucherCreateContainer = (): ReactElement => (
  <Layout mobileWhiteBackground={true} showMobileGlobalHeader={true}>
    <MasterVoucherCreateComponent {...useMasterVoucherCreateForm()} />
  </Layout>
);

export default MasterVoucherCreateContainer;
