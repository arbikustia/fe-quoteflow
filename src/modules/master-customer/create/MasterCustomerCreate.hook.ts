import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { parsePhoneInput } from "./MasterCustomerCreate.helpers";
import type {
  CustomerFormFields,
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
 * Hook managing input change handlers.
 * @param {Dispatch<SetStateAction<string>>} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _useInputChange = (setter: Dispatch<SetStateAction<string>>): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => { setter(event.target.value); }
);

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
 * Hook managing form fields and input state.
 * @param {CustomerData | undefined} routeCustomer - Customer from router state
 * @param {ReturnType<typeof _resolveCustomerDetail>} customerItem - Customer from API
 * @returns {CustomerFormFields} Form fields and handlers
 */
const useCustomerFormFields = (
  routeCustomer: CustomerData | undefined,
  customerItem: ReturnType<typeof _resolveCustomerDetail>,
): CustomerFormFields => {
  const initial = _getInitialFieldValues(routeCustomer, customerItem);
  const [name, setName] = useState(initial.name);
  const [address, setAddress] = useState(initial.address);
  const [phoneNumber, setPhoneNumber] = useState(initial.phoneNumber);
  const [isActive, setIsActive] = useState(initial.isActive);
  const [initializedId, setInitializedId] = useState<string | null>(routeCustomer?.id ?? null);

  if (customerItem && customerItem.id !== initializedId) {
    setInitializedId(customerItem.id);
    setName(customerItem.name);
    setAddress(customerItem.address ?? "");
    setPhoneNumber(customerItem.phone_number ?? "");
    setIsActive(customerItem.status === 1);
  }

  const handleNameChange = _useInputChange(setName);
  const handleAddressChange = _useInputChange(setAddress);
  /**
   * Handle phone number change.
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Phone change event
   * @returns {void}
   */
  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setPhoneNumber(parsePhoneInput(event.target.value));
  };
  /**
   * Handle status toggle.
   * @returns {void}
   */
  const handleStatusChange = (): void => { setIsActive((current) => !current); };

  return { name, address, phoneNumber, isActive, handleNameChange, handlePhoneNumberChange, handleAddressChange, handleStatusChange };
};

/**
 * Handle form submission logic for create or update.
 * @param {CustomerSubmissionParams} params - Submission values
 * @returns {CustomerSubmissionState} Submission state
 */
const useCustomerSubmission = (params: CustomerSubmissionParams): CustomerSubmissionState => {
  const { id, isEditMode, name, address, phoneNumber, isActive } = params;
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

      setSuccessMessage(isEditMode ? "Customer updated successfully." : "Customer created successfully.");
      navigate("/master-customer");
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
  const { name, address, phoneNumber, isActive } = formFields;
  const submission = useCustomerSubmission({ id, isEditMode, name, address, phoneNumber, isActive });

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
