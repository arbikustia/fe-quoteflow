import type { ReactElement } from "react";

import { MasterVoucherCreateComponent } from "./MasterVoucherCreate.component";

import Layout from "@/app/layout";
import { useMasterVoucherCreateForm } from "./MasterVoucherCreate.hook";

/** Render master voucher create container.
 * @returns {ReactElement} Create container
 */
const MasterVoucherCreateContainer = (): ReactElement => (
  <Layout mobileWhiteBackground={true} showMobileGlobalHeader={true}>
    <MasterVoucherCreateComponent {...useMasterVoucherCreateForm()} />
  </Layout>
);

export default MasterVoucherCreateContainer;
