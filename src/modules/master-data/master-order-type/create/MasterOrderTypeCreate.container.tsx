import * as React from "react";
import { useParams } from "react-router-dom";

import MasterOrderTypeCreateComponent from "./MasterOrderTypeCreate.component";
import { useMasterOrderTypeCreate } from "./MasterOrderTypeCreate.hook";
import type { OrderTypeFormMode } from "./MasterOrderTypeCreate.type";
import { normalizeOrderTypeFormSource } from "./MasterOrderTypeCreate.util";

import {
  useCreateOrderTypeMutation,
  useGetOrderTypeByIdQuery,
  useUpdateOrderTypeMutation,
} from "@/services/master-order-type.service";

/**
 * Render the order type create / edit container. Edit mode is the `/master-order-type/edit/:id` route.
 * @returns {React.ReactElement} - Container of the order type form view
 */
const MasterOrderTypeCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const mode: OrderTypeFormMode = id ? "edit" : "create";
  const { data, isLoading, isError } = useGetOrderTypeByIdQuery(id ?? "", { skip: !id });
  const [createOrderType, createState] = useCreateOrderTypeMutation();
  const [updateOrderType, updateState] = useUpdateOrderTypeMutation();

  // Single upstream fallback: the form receives normalized initial values only
  const { formStatus, initialValues } = normalizeOrderTypeFormSource({ data, isLoading, isError });
  const controller = useMasterOrderTypeCreate({ id, mode, initialValues, createOrderType, updateOrderType });

  return (
    <MasterOrderTypeCreateComponent
      mode={mode}
      formStatus={formStatus}
      values={controller.values}
      fieldErrors={controller.fieldErrors}
      isSubmitting={createState.isLoading || updateState.isLoading}
      errorMessage={controller.errorMessage}
      onNameChange={controller.handleNameChange}
      onToggleChange={controller.handleToggleChange}
      onSubmit={controller.handleSubmit}
      onBack={controller.handleBack}
    />
  );
};

export default MasterOrderTypeCreateContainer;
