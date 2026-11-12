import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import type { OrderDetailProps, OrderDetailRouteState } from "./OrderDetail.type";
import { resolveOrderDetailError } from "./OrderDetail.util";

import { useGetAllProjectsQuery } from "@/services/master-project.service";
import { useGetOrderByIdQuery } from "@/services/order.service";

/**
 * Load the order of the route and expose navigation handlers.
 * @returns {OrderDetailProps} - Order detail props
 */
export const useOrderDetail = (): OrderDetailProps => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { id = "" } = useParams();
  const routeState: OrderDetailRouteState | null = location.state;
  const isFromReport = routeState?.from === "report" || searchParams.get("from") === "report";
  const query = useGetOrderByIdQuery(id, { skip: id.length === 0 });
  const projectsQuery = useGetAllProjectsQuery();

  /**
   * Navigate back to the order list or report.
   * @returns {void} - No return value
   */
  const handleNavigateBack = (): void => {
    if (routeState?.returnUrl) {
      void navigate(routeState.returnUrl);

      return;
    }

    void navigate(-1);
  };

  /**
   * Navigate to the order edit page.
   * @returns {void} - No return value
   */
  const handleEdit = (): void => {
    void navigate(`/order/edit/${id}`, { state: { returnUrl: `/order/detail/${id}` } });
  };

  return {
    order: query.data?.data ?? null,
    projects: projectsQuery.data?.data ?? [],
    isLoading: query.isLoading,
    errorMessage: resolveOrderDetailError(Boolean(query.error), query.data?.status),
    onNavigateBack: handleNavigateBack,
    onEdit: isFromReport ? undefined : handleEdit,
    breadcrumbs: isFromReport ? ["Report", "Order Detail"] : ["Order", "Order Detail"],
  };
};
