import type { ReactElement } from "react";

import Layout from "@/app/layout";

import { MasterVoucherCreateComponent } from "./MasterVoucherCreate.component";
import { useMasterVoucherCreateForm } from "./MasterVoucherCreate.hook";

/** Render master voucher create container.
 * @returns {ReactElement} Create container
 */
const MasterVoucherCreateContainer = (): ReactElement => (
  <Layout>
    <MasterVoucherCreateComponent {...useMasterVoucherCreateForm()} />
  </Layout>
);

export default MasterVoucherCreateContainer;
