import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";

import { MasterVoucherComponent } from "./MasterVoucher.component";
import { downloadVoucherTemplate } from "./MasterVoucher.helpers";
import { useMasterVoucherContainerState } from "./MasterVoucher.hook";
import type { VoucherData, VoucherRouteState } from "./MasterVoucher.type";

/**
 * Master Voucher Container
 * @returns {React.ReactElement} Container component
 */
const MasterVoucherContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: VoucherRouteState | null = location.state;
  const containerState = useMasterVoucherContainerState();
  /**
   * Handle voucher template download.
   * @param {VoucherData} voucher - Voucher row
   * @returns {void} No return value
   */
  const handleDownload = (voucher: VoucherData): void => {
    void downloadVoucherTemplate(voucher).catch(() => {
      window.alert("Unable to download voucher template.");
    });
  };

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterVoucherComponent
        {...containerState.pagination}
        onBack={containerState.goBack}
        onCreate={containerState.goCreate}
        onEdit={containerState.goEdit}
        onDownload={handleDownload}
        onMore={containerState.toggleMore}
        isMoreOpen={containerState.isMoreOpen}
        onCloseMore={containerState.handleCloseMore}
        onDelete={containerState.goDelete}
      />
    </>
  );
};

export default MasterVoucherContainer;
