import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import { AlertComponent } from "@/components/Alert";

import { MasterPaymentTypeComponent } from "./MasterPaymentType.component";
import { useMasterPaymentTypeContainerState } from "./MasterPaymentType.hook";
import type { PaymentTypeRouteState } from "./MasterPaymentType.type";

/**
 * Master Payment Type Container.
 *
 * @returns {React.ReactElement} Container component
 */
const MasterPaymentTypeContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: PaymentTypeRouteState | null = location.state;
  const containerState = useMasterPaymentTypeContainerState();
  const { canCreate, canEdit } = usePagePermission("/master-payment-type");

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterPaymentTypeComponent
        {...containerState.pagination}
        onBack={containerState.goBack}
        onCreate={canCreate ? containerState.goCreate : undefined}
        onEdit={canEdit ? containerState.goEdit : undefined}
      />
    </>
  );
};

export default MasterPaymentTypeContainer;
