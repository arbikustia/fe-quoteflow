import type { ChangeEvent, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import type { Control, UseFormRegister, UseFormReset, UseFormSetValue } from "react-hook-form";
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
  id: string;
  name: string;
  email: string | null;
  address: string | null;
  phone_number: string | null;
  status: number;
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
 * @returns {{ name: string; email: string; address: string; phoneNumber: string; isActive: boolean }} Initial values
 */
const _getInitialFieldValues = (
  routeCustomer: CustomerData | undefined,
  customerItem: ReturnType<typeof _resolveCustomerDetail>,
): {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
} => ({
  name: routeCustomer?.name ?? customerItem?.name ?? "",
  email: routeCustomer?.email ?? customerItem?.email ?? "",
  address: routeCustomer?.address ?? customerItem?.address ?? "",
  phoneNumber: routeCustomer?.phoneNumber ?? customerItem?.phone_number ?? "",
  isActive: routeCustomer ? routeCustomer.status === "active" : customerItem?.status === 1,
});

const EMAIL_REGEX = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Register customer validation rules.
 * @param {UseFormRegister<CustomerFormValues>} register - Form register function
 * @returns {void} No return value
 */
const _registerCustomerFields = (register: UseFormRegister<CustomerFormValues>): void => {
  register("name", { required: "Customer name is required." });
  register("email", {
    required: "Email is required.",
    pattern: {
      value: EMAIL_REGEX,
      message: "Please enter a valid email address.",
    },
  });
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
      reset({ name: customerItem.name, email: customerItem.email ?? "", address: customerItem.address ?? "", phoneNumber: customerItem.phone_number ?? "", isActive: customerItem.status === 1 });
    }
  }, [customerItem, reset]);
};

/**
 * Create input change handler for customer fields.
 * @param {"name" | "email" | "address"} field - Field name
 * @param {UseFormSetValue<CustomerFormValues>} setValue - React hook form setValue
 * @param {boolean} hasError - Field error presence
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _createCustomerFieldChange = (
  field: "name" | "email" | "address",
  setValue: UseFormSetValue<CustomerFormValues>,
  hasError: boolean,
): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue(field, event.target.value, { shouldValidate: hasError });
  }
);

/**
 * Create phone number change handler.
 * @param {UseFormSetValue<CustomerFormValues>} setValue - React hook form setValue
 * @param {boolean} hasError - Field error presence
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _createPhoneChange = (
  setValue: UseFormSetValue<CustomerFormValues>,
  hasError: boolean,
): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue("phoneNumber", parsePhoneInput(event.target.value), { shouldValidate: hasError });
  }
);

/**
 * Toggle customer status handler.
 * @param {UseFormSetValue<CustomerFormValues>} setValue - React hook form setValue
 * @param {boolean} isActive - Current active status
 * @returns {() => void} Toggle handler
 */
const _createStatusToggle = (
  setValue: UseFormSetValue<CustomerFormValues>,
  isActive: boolean,
): (() => void) => (
  (): void => {
    setValue("isActive", !isActive, { shouldDirty: true });
  }
);

/**
 * Create form validation trigger.
 * @param {() => Promise<boolean>} trigger - Form trigger function
 * @param {(submitted: boolean) => void} setIsSubmitted - Set submitted state
 * @returns {() => Promise<boolean>} Validate function
 */
const _createValidateForm = (
  trigger: () => Promise<boolean>,
  setIsSubmitted: (submitted: boolean) => void,
): (() => Promise<boolean>) => (
  async (): Promise<boolean> => {
    setIsSubmitted(true);

    return await trigger();
  }
);

/**
 * Watch all customer form values.
 * @param {Control<CustomerFormValues>} control - Form control
 * @returns {CustomerFormValues} Current watched values
 */
const useCustomerWatches = (control: Control<CustomerFormValues>): CustomerFormValues => ({
  name: useWatch({ control, name: "name" }),
  email: useWatch({ control, name: "email" }),
  address: useWatch({ control, name: "address" }),
  phoneNumber: useWatch({ control, name: "phoneNumber" }),
  isActive: useWatch({ control, name: "isActive" }),
});

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
    defaultValues: initial,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  _registerCustomerFields(register);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const values = useCustomerWatches(formControl);

  useCustomerReset(customerItem, reset);

  return {
    ...values,
    errors,
    isSubmitted,
    getValues,
    register,
    validateForm: _createValidateForm(trigger, setIsSubmitted),
    handleNameChange: _createCustomerFieldChange("name", setValue, Boolean(errors.name)),
    handleEmailChange: _createCustomerFieldChange("email", setValue, Boolean(errors.email)),
    handlePhoneNumberChange: _createPhoneChange(setValue, Boolean(errors.phoneNumber)),
    handleAddressChange: _createCustomerFieldChange("address", setValue, Boolean(errors.address)),
    handleStatusChange: _createStatusToggle(setValue, values.isActive),
  };
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

    const { name, email, address, phoneNumber } = getValues();

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response: CustomerCreateResponse = isEditMode && id
        ? await updateCustomer({ id, name, email, address, phone_number: phoneNumber, status: isActive ? 1 : 0 }).unwrap()
        : await createCustomer({ name, email, address, phone_number: phoneNumber, status: 1 }).unwrap();

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
  const { id } = useParams<{ id?: string }>();
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
