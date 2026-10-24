import * as React from "react";
import { useLocation } from "react-router-dom";

import { AlertComponent } from "../../components/Alert";

import { MasterCustomerComponent } from "./MasterCustomer.component";
import { useMasterCustomerContainerState, useMasterCustomerNavigation } from "./MasterCustomer.hook";
import type { CustomerRouteState } from "./MasterCustomer.type";

/**
 * Master Customer Container
 * @returns {React.ReactElement} Container element
 */
const MasterCustomerContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: CustomerRouteState | null = location.state;
  const { goBack, goCreate, goEdit } = useMasterCustomerNavigation();
  const { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete } = useMasterCustomerContainerState();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterCustomerComponent
        {...pagination}
        isMoreOpen={isMoreOpen}
        onBack={goBack}
        onCreate={goCreate}
        onEdit={goEdit}
        onMore={toggleMore}
        onCloseMore={handleCloseMore}
        onDelete={goDelete}
      />
    </>
  );
};

export default MasterCustomerContainer;
