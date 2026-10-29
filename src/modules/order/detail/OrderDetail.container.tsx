import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { OrderDetailComponent } from "./OrderDetail.component";

import { mapProject, useGetAllProjectsQuery } from "@/services/master-project.service";
import { useGetOrderByIdQuery } from "@/services/order.service";

/**
 * Handle module operation.
 * @returns {React.ReactElement} - Operation result
 */
const OrderDetailContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const query = useGetOrderByIdQuery(id, { skip: id.length === 0 });
  const projectsQuery = useGetAllProjectsQuery();
  const projects = (projectsQuery.data?.data ?? []).map(mapProject);
  /** Navigate back to order list. */
  const handleNavigateBack = (): void => { void navigate(-1); };
  /** Navigate to order edit page. */
  const handleEdit = (): void => { void navigate(`/order/edit/${id}`); };
  let errorMessage: string | null = null;

  if (query.error) {
    errorMessage = "Unable to load order detail.";
  } else if (query.data?.status === false) {
    errorMessage = "Order detail is unavailable.";
  }

  return (
    <OrderDetailComponent
      order={query.data?.data ?? null}
      projects={projects}
      isLoading={query.isLoading}
      errorMessage={errorMessage}
      onNavigateBack={handleNavigateBack}
      onEdit={handleEdit}
    />
  );
};

export default OrderDetailContainer;
