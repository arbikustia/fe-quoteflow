import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetOrderByIdQuery } from "@/services/order.service";

import { OrderDetailComponent } from "./OrderDetail.component";

const OrderDetailContainer = (): React.ReactElement => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const query = useGetOrderByIdQuery(id, { skip: id.length === 0 });

  return (
    <OrderDetailComponent
      order={query.data?.data ?? null}
      isLoading={query.isLoading}
      errorMessage={query.error ? "Unable to load order detail." : query.data?.status === false ? "Order detail is unavailable." : null}
      onNavigateBack={(): void => { void navigate(-1); }}
    />
  );
};

export default OrderDetailContainer;
