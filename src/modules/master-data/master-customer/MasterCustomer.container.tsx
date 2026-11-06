import * as React from "react";
import { useLocation } from "react-router-dom";

import { MasterCustomerComponent } from "./MasterCustomer.component";
import { useMasterCustomerNavigation, useMasterCustomerPagination } from "./MasterCustomer.hook";
import type { CustomerRouteState } from "./MasterCustomer.type";
import { AlertComponent } from "../../../components/Alert";

/**
 * Master Customer Container
 * @returns {React.ReactElement} Container element
 */
const MasterCustomerContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: CustomerRouteState | undefined = location.state;
  const { goBack, goCreate, goEdit } = useMasterCustomerNavigation();
  const pagination = useMasterCustomerPagination();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MasterCustomerComponent
        {...pagination}
        onBack={goBack}
        onCreate={goCreate}
        onEdit={goEdit}
      />
    </>
  );
};

export default MasterCustomerContainer;
