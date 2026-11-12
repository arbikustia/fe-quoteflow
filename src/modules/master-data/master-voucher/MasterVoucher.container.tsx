import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterVoucherComponent from "./MasterVoucher.component";
import { MASTER_VOUCHER_ROUTE } from "./MasterVoucher.config";
import { useMasterVoucher } from "./MasterVoucher.hook";
import type { VoucherRouteState } from "./MasterVoucher.type";
import { normalizeVoucherList } from "./MasterVoucher.util";

import { useGetVouchersQuery } from "@/services/master-voucher.service";

/**
 * Render the voucher list container.
 * @returns {React.ReactElement} - Container of the voucher list view
 */
const MasterVoucherContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: VoucherRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_VOUCHER_ROUTE.LIST);
  const controller = useMasterVoucher();
  const { data, isLoading, isError } = useGetVouchersQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizeVoucherList({ data, isLoading, isError });

  return (
    <MasterVoucherComponent
      {...listView}
      currentPage={controller.currentPage}
      pageSize={controller.pageSize}
      canCreate={canCreate}
      canEdit={canEdit}
      successMessage={routeState?.successMessage}
      onPageChange={controller.handlePageChange}
      onPageSizeChange={controller.handlePageSizeChange}
      onSearchChange={controller.handleSearchChange}
      onBack={controller.handleBack}
      onCreate={controller.handleCreate}
      onEdit={controller.handleEdit}
      onDownload={controller.handleDownload}
    />
  );
};

export default MasterVoucherContainer;
