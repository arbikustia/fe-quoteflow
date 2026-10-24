import type { ChangeEvent, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import type { UseFormRegister, UseFormReset } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { parsePhoneInput } from "./MasterCustomerCreate.helpers";
import type {
  CustomerFormFields,
  CustomerFormValidation,
  CustomerFormValues,
  CustomerSubmissionParams,
  CustomerSubmissionState,
  MasterCustomerCreateFormState,
} from "./MasterCustomerCreate.type";

import type { CustomerCreateResponse, CustomerData } from "@/modules/master-customer/MasterCustomer.type";
import { useCreateCustomerMutation, useGetCustomerByIdQuery, useUpdateCustomerMutation } from "@/services/master-customer.service";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Customer request failed.";
};



/**
 * Extract customer item from API detail payload.
 * @param {ReturnType<typeof useGetCustomerByIdQuery>["data"]} customerDetail - Detail response
 * @returns {CustomerData | null} Customer item or null
 */
const _resolveCustomerDetail = (customerDetail: ReturnType<typeof useGetCustomerByIdQuery>["data"]): {
  readonly id: string;
  readonly name: string;
  readonly address: string | null;
  readonly phone_number: string | null;
  readonly status: number;
} | null => {
  if (!customerDetail?.status || !customerDetail.data) {
    return null;
  }

  return Array.isArray(customerDetail.data) ? customerDetail.data[0] : customerDetail.data;
};

/**
 * Derive initial customer field values.
 * @param {CustomerData | undefined} routeCustomer - Customer from router state
 * @param {ReturnType<typeof _resolveCustomerDetail>} customerItem - Customer from API
 * @returns {{ readonly name: string; readonly address: string; readonly phoneNumber: string; readonly isActive: boolean }} Initial values
 */
const _getInitialFieldValues = (
  routeCustomer: CustomerData | undefined,
  customerItem: ReturnType<typeof _resolveCustomerDetail>,
): {
  readonly name: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly isActive: boolean;
} => ({
  name: routeCustomer?.name ?? customerItem?.name ?? "",
  address: routeCustomer?.address ?? customerItem?.address ?? "",
  phoneNumber: routeCustomer?.phoneNumber ?? customerItem?.phone_number ?? "",
  isActive: routeCustomer ? routeCustomer.status === "active" : customerItem?.status === 1,
});

/**
 * Register customer validation rules.
 * @param {UseFormRegister<CustomerFormValues>} register - Form register function
 * @returns {void} No return value
 */
const _registerCustomerFields = (register: UseFormRegister<CustomerFormValues>): void => {
  register("name", { required: "Customer name is required." });
  register("address", { required: "Address is required." });
  register("phoneNumber", { required: "Phone number is required.", pattern: { value: /^\d{6,15}$/, message: "Phone number must contain 6–15 digits." } });
};

/**
 * Reset form when API customer arrives.
 * @param {ReturnType<typeof _resolveCustomerDetail>} customerItem - Customer from API
 * @param {UseFormReset<CustomerFormValues>} reset - Form reset function
 * @returns {void} No return value
 */
const useCustomerReset = (customerItem: ReturnType<typeof _resolveCustomerDetail>, reset: UseFormReset<CustomerFormValues>): void => {
  useEffect((): void => {
    if (customerItem) {
      reset({ name: customerItem.name, address: customerItem.address ?? "", phoneNumber: customerItem.phone_number ?? "", isActive: customerItem.status === 1 });
    }
  }, [customerItem, reset]);
};

/**
 * Manage customer form fields and validation state.
 * @param {CustomerData | undefined} routeCustomer - Customer from route state
 * @param {ReturnType<typeof _resolveCustomerDetail>} customerItem - Customer from API
 * @returns {CustomerFormFields & CustomerFormValidation} Form state and handlers
 */
const useCustomerFormFields = (
  routeCustomer: CustomerData | undefined,
  customerItem: ReturnType<typeof _resolveCustomerDetail>,
): CustomerFormFields & CustomerFormValidation => {
  const initial = _getInitialFieldValues(routeCustomer, customerItem);
  const { control: formControl, formState: { errors }, getValues, register, reset, setValue, trigger } = useForm<CustomerFormValues>({
    defaultValues: { name: initial.name, address: initial.address, phoneNumber: initial.phoneNumber, isActive: initial.isActive },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  _registerCustomerFields(register);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const name = useWatch({ control: formControl, name: "name" });
  const address = useWatch({ control: formControl, name: "address" });
  const phoneNumber = useWatch({ control: formControl, name: "phoneNumber" });
  const isActive = useWatch({ control: formControl, name: "isActive" });

  useCustomerReset(customerItem, reset);

  /**
   * Handle customer name change.
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Name change event
   * @returns {void}
   */
  const handleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue("name", event.target.value, { shouldValidate: Boolean(errors.name) });
  };

  /**
   * Handle customer address change.
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Address change event
   * @returns {void}
   */
  const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue("address", event.target.value, { shouldValidate: Boolean(errors.address) });
  };

  /**
   * Handle customer phone number change.
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Phone change event
   * @returns {void}
   */
  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue("phoneNumber", parsePhoneInput(event.target.value), { shouldValidate: Boolean(errors.phoneNumber) });
  };

  /**
   * Toggle customer status.
   * @returns {void}
   */
  const handleStatusChange = (): void => { setValue("isActive", !isActive, { shouldDirty: true }); };

  /**
   * Validate customer fields.
   * @returns {Promise<boolean>} Validation result
   */
  const validateForm = async (): Promise<boolean> => {
    setIsSubmitted(true);

    return await trigger();
  };

  return { name, address, phoneNumber, isActive, errors, isSubmitted, getValues, register, validateForm, handleNameChange, handlePhoneNumberChange, handleAddressChange, handleStatusChange };
};

/**
 * Handle form submission logic for create or update.
 * @param {CustomerSubmissionParams} params - Submission values
 * @returns {CustomerSubmissionState} Submission state
 */
const useCustomerSubmission = (params: CustomerSubmissionParams): CustomerSubmissionState => {
  const { id, isEditMode, isActive, getValues, validateForm } = params;
  const navigate = useNavigate();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Submit customer form.
   * @param {SyntheticEvent} event - Form submission event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    if (!(await validateForm())) {
      return;
    }

    const { name, address, phoneNumber } = getValues();

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response: CustomerCreateResponse = isEditMode && id
        ? await updateCustomer({ id, name, address, phone_number: phoneNumber, status: isActive ? 1 : 0 }).unwrap()
        : await createCustomer({ name, address, phone_number: phoneNumber, status: 1 }).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      const successMessage = isEditMode ? "Customer updated successfully." : "Customer created successfully.";

      setSuccessMessage(successMessage);
      navigate("/master-customer", { state: { successMessage } });
    } catch {
      setErrorMessage(isEditMode ? "Unable to update customer. Please try again." : "Unable to create customer. Please try again.");
    }
  };

  return { isSubmitting: isCreating || isUpdating, errorMessage, successMessage, handleSubmit };
};

/**
 * Hook managing master customer form state.
 * @returns {MasterCustomerCreateFormState} Form state
 */
export const useMasterCustomerCreate = (): MasterCustomerCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routeCustomer: CustomerData | undefined = location.state?.customer;

  const { data: customerDetail, isLoading: isLoadingDetail } = useGetCustomerByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeCustomer),
  });

  const customerItem = _resolveCustomerDetail(customerDetail);
  const formFields = useCustomerFormFields(routeCustomer, customerItem);
  const submission = useCustomerSubmission({
    id,
    isEditMode,
    isActive: formFields.isActive,
    getValues: formFields.getValues,
    validateForm: formFields.validateForm,
  });

  /**
   * Go back.
   * @returns {void}
   */
  const goBack = (): void => { navigate(-1); };

  return {
    ...formFields,
    isEditMode,
    isLoadingInitialData: isLoadingDetail && !routeCustomer,
    goBack,
    ...submission,
  };
};
