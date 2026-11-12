import * as React from "react";
import { useLocation } from "react-router-dom";

import MasterCustomerComponent from "./MasterCustomer.component";
import { useMasterCustomer } from "./MasterCustomer.hook";
import type { CustomerRouteState } from "./MasterCustomer.type";
import { normalizeCustomerList } from "./MasterCustomer.util";

import { useGetCustomersQuery } from "@/services/master-customer.service";

/**
 * Render the customer list container.
 * @returns {React.ReactElement} - Container of the customer list view
 */
const MasterCustomerContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: CustomerRouteState = location.state;
  const controller = useMasterCustomer();
  const { data, isLoading, isError } = useGetCustomersQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizeCustomerList({ data, isLoading, isError });

  return (
    <MasterCustomerComponent
      {...listView}
      currentPage={controller.currentPage}
      pageSize={controller.pageSize}
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

export default MasterCustomerContainer;
