import * as React from "react";
import { useParams } from "react-router-dom";

import MasterCustomerCreateComponent from "./MasterCustomerCreate.component";
import { useMasterCustomerCreate } from "./MasterCustomerCreate.hook";
import type { CustomerFormMode } from "./MasterCustomerCreate.type";
import { normalizeCustomerFormSource } from "./MasterCustomerCreate.util";

import {
  useCreateCustomerMutation,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "@/services/master-customer.service";

/**
 * Render the customer create / edit container. Edit mode is the `/master-customer/edit/:id` route.
 * @returns {React.ReactElement} - Container of the customer form view
 */
const MasterCustomerCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const mode: CustomerFormMode = id ? "edit" : "create";
  const { data, isLoading, isError } = useGetCustomerByIdQuery(id ?? "", { skip: !id });
  const [createCustomer, createState] = useCreateCustomerMutation();
  const [updateCustomer, updateState] = useUpdateCustomerMutation();

  // Single upstream fallback: the form receives normalized initial values only
  const { formStatus, initialValues } = normalizeCustomerFormSource({ data, isLoading, isError });
  const controller = useMasterCustomerCreate({ id, mode, initialValues, createCustomer, updateCustomer });

  return (
    <MasterCustomerCreateComponent
      mode={mode}
      formStatus={formStatus}
      values={controller.values}
      fieldErrors={controller.fieldErrors}
      isSubmitting={createState.isLoading || updateState.isLoading}
      errorMessage={controller.errorMessage}
      onNameChange={controller.handleNameChange}
      onEmailChange={controller.handleEmailChange}
      onPhoneNumberChange={controller.handlePhoneNumberChange}
      onAddressChange={controller.handleAddressChange}
      onStatusChange={controller.handleStatusChange}
      onSubmit={controller.handleSubmit}
      onBack={controller.handleBack}
    />
  );
};

export default MasterCustomerCreateContainer;
