import * as React from "react";

import { getColumns } from "./Order.columns";
import { OrderComponent } from "./Order.component";
import { useOrderPagination, useOrderState } from "./Order.hook";

const OrderContainer = (): React.ReactElement => {
  const state = useOrderState();
  const pagination = useOrderPagination();
  const columns = getColumns({ currentPage: pagination.currentPage, pageSize: pagination.pageSize, openEditModal: state.openEditModal });

  return <OrderComponent {...state} {...pagination} columns={columns} />;
};

export default OrderContainer;
