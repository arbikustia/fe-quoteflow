import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "@/components/Alert";

import { MasterPaymentMethodComponent } from "./MasterPaymentMethod.component";
import { useMasterPaymentMethodContainerState } from "./MasterPaymentMethod.hook";
import type { PaymentMethodRouteState } from "./MasterPaymentMethod.type";

/**
 * Master Payment Method Container.
 * @returns {React.ReactElement} Container component
 */
const MasterPaymentMethodContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: PaymentMethodRouteState | null = location.state;
  const containerState = useMasterPaymentMethodContainerState();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterPaymentMethodComponent
        {...containerState.pagination}
        onBack={containerState.goBack}
        onCreate={containerState.goCreate}
        onEdit={containerState.goEdit}
        onMore={containerState.toggleMore}
        isMoreOpen={containerState.isMoreOpen}
        onCloseMore={containerState.handleCloseMore}
        onDelete={containerState.goDelete}
      />
    </>
  );
};

export default MasterPaymentMethodContainer;
