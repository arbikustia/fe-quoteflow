import * as React from "react";
import { useLocation, useParams } from "react-router-dom";

import type { PaymentMethodEditRouteState } from "../MasterPaymentMethod.type";

import MasterPaymentMethodCreateComponent from "./MasterPaymentMethodCreate.component";
import { useMasterPaymentMethodCreate } from "./MasterPaymentMethodCreate.hook";
import type { PaymentMethodFormMode } from "./MasterPaymentMethodCreate.type";
import { normalizePaymentMethodFormSource } from "./MasterPaymentMethodCreate.util";

import { useCreatePaymentMethodMutation, useUpdatePaymentMethodMutation } from "@/services/master-payment-method.service";

/**
 * Render the payment method create / edit container. Edit mode is the `/master-payment-method/edit/:id` route.
 * @returns {React.ReactElement} - Container of the payment method form view
 */
const MasterPaymentMethodCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const routeState: PaymentMethodEditRouteState = useLocation().state;
  const mode: PaymentMethodFormMode = id ? "edit" : "create";
  const [createPaymentMethod, createState] = useCreatePaymentMethodMutation();
  const [updatePaymentMethod, updateState] = useUpdatePaymentMethodMutation();

  // Single upstream fallback: the form receives normalized initial values only
  const { formStatus, initialValues } = normalizePaymentMethodFormSource({ id, routePaymentMethod: routeState?.paymentMethod });
  const controller = useMasterPaymentMethodCreate({ id, mode, initialValues, createPaymentMethod, updatePaymentMethod });

  return (
    <MasterPaymentMethodCreateComponent
      mode={mode}
      formStatus={formStatus}
      values={controller.values}
      fieldErrors={controller.fieldErrors}
      isSubmitting={createState.isLoading || updateState.isLoading}
      errorMessage={controller.errorMessage}
      onNameChange={controller.handleNameChange}
      onDescriptionChange={controller.handleDescriptionChange}
      onStatusChange={controller.handleStatusChange}
      onSubmit={controller.handleSubmit}
      onBack={controller.handleBack}
    />
  );
};

export default MasterPaymentMethodCreateContainer;
