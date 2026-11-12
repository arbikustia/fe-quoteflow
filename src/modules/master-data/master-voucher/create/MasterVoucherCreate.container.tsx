import * as React from "react";
import { useParams } from "react-router-dom";

import MasterVoucherCreateComponent from "./MasterVoucherCreate.component";
import { useMasterVoucherCreate } from "./MasterVoucherCreate.hook";
import type { VoucherFormMode } from "./MasterVoucherCreate.type";
import { normalizeVoucherFormSource } from "./MasterVoucherCreate.util";

import { useCreateVoucherMutation, useGetVoucherByIdQuery, useUpdateVoucherMutation } from "@/services/master-voucher.service";

/**
 * Render the voucher create / edit container. Edit mode is the `/master-voucher/edit/:id` route.
 * @returns {React.ReactElement} - Container of the voucher form view
 */
const MasterVoucherCreateContainer = (): React.ReactElement => {
  const { id } = useParams();
  const mode: VoucherFormMode = id ? "edit" : "create";
  const { data, isLoading, isError } = useGetVoucherByIdQuery(id ?? "", { skip: !id });
  const [createVoucher, createState] = useCreateVoucherMutation();
  const [updateVoucher, updateState] = useUpdateVoucherMutation();

  // Single upstream fallback: the form receives normalized initial values only
  const { formStatus, initialValues } = normalizeVoucherFormSource({ data, isLoading, isError });
  const controller = useMasterVoucherCreate({ id, mode, initialValues, createVoucher, updateVoucher });

  return (
    <MasterVoucherCreateComponent
      mode={mode}
      formStatus={formStatus}
      values={controller.values}
      fieldErrors={controller.fieldErrors}
      isSubmitting={createState.isLoading || updateState.isLoading}
      errorMessage={controller.errorMessage}
      onNameChange={controller.handleNameChange}
      onCodeModeChange={controller.handleCodeModeChange}
      onCodeChange={controller.handleCodeChange}
      onDiscountChange={controller.handleDiscountChange}
      onStatusChange={controller.handleStatusChange}
      onSubmit={controller.handleSubmit}
      onBack={controller.handleBack}
    />
  );
};

export default MasterVoucherCreateContainer;
