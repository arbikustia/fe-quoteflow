import * as React from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { OrderDetailComponent } from "./OrderDetail.component";
import type { OrderDetailRouteState } from "./OrderDetail.type";

import { mapProject, useGetAllProjectsQuery } from "@/services/master-project.service";
import { useGetOrderByIdQuery } from "@/services/order.service";

/**
 * Resolve error message from order query state.
 * @param {boolean} hasError - whether query failed
 * @param {boolean | undefined} status - data status
 * @returns {string | null} error message
 */
const _resolveErrorMessage = (hasError: boolean, status?: boolean): string | null => {
  if (hasError) {
    return "Unable to load order detail.";
  }

  if (status === false) {
    return "Order detail is unavailable.";
  }

  return null;
};

/**
 * Handle module operation.
 * @returns {React.ReactElement} - Operation result
 */
const OrderDetailContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { id = "" } = useParams();
  const routeState: OrderDetailRouteState | null = location.state;
  const isFromReport = routeState?.from === "report" || searchParams.get("from") === "report";

  const query = useGetOrderByIdQuery(id, { skip: id.length === 0 });
  const projectsQuery = useGetAllProjectsQuery();
  const projects = (projectsQuery.data?.data ?? []).map(mapProject);

  /** Navigate back to order list or report. */
  const handleNavigateBack = (): void => {
    if (routeState?.returnUrl) {
      void navigate(routeState.returnUrl);

      return;
    }

    void navigate(-1);
  };

  /** Navigate to order edit page. */
  const handleEdit = (): void => {
    void navigate(`/order/edit/${id}`, {
      state: { returnUrl: `/order/detail/${id}` },
    });
  };

  return (
    <OrderDetailComponent
      order={query.data?.data ?? null}
      projects={projects}
      isLoading={query.isLoading}
      errorMessage={_resolveErrorMessage(Boolean(query.error), query.data?.status)}
      onNavigateBack={handleNavigateBack}
      onEdit={isFromReport ? undefined : handleEdit}
      breadcrumbs={isFromReport ? ["Report", "Order Detail"] : ["Order", "Order Detail"]}
    />
  );
};

export default OrderDetailContainer;
