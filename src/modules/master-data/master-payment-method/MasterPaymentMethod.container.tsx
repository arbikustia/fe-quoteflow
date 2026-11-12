import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterPaymentMethodComponent from "./MasterPaymentMethod.component";
import { MASTER_PAYMENT_METHOD_ROUTE } from "./MasterPaymentMethod.config";
import { useMasterPaymentMethod } from "./MasterPaymentMethod.hook";
import type { PaymentMethodRouteState } from "./MasterPaymentMethod.type";
import { normalizePaymentMethodList } from "./MasterPaymentMethod.util";

import { useGetPaymentMethodsQuery } from "@/services/master-payment-method.service";

/**
 * Render the payment method list container.
 * @returns {React.ReactElement} - Container of the payment method list view
 */
const MasterPaymentMethodContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: PaymentMethodRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_PAYMENT_METHOD_ROUTE.LIST);
  const controller = useMasterPaymentMethod();
  const { data, isLoading, isError } = useGetPaymentMethodsQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizePaymentMethodList({ data, isLoading, isError });

  return (
    <MasterPaymentMethodComponent
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
    />
  );
};

export default MasterPaymentMethodContainer;
