import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { parsePhoneInput } from "./MasterCustomerCreate.helpers";
import type { MasterCustomerCreateFormState } from "./MasterCustomerCreate.type";

import type { CustomerCreateResponse } from "@/modules/master-customer/MasterCustomer.type";
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
 * Handle form submission logic for create or update.
 * @param {string | undefined} id - Customer ID
 * @param {boolean} isEditMode - Edit mode flag
 * @param {string} name - Name
 * @param {string} address - Address
 * @param {string} phoneNumber - Phone number
 * @param {boolean} isActive - Active status
 * @returns {{ readonly isSubmitting: boolean; readonly errorMessage: string | null; readonly successMessage: string | null; readonly handleSubmit: (event: SyntheticEvent) => Promise<void>; }} Submission state
 */
const _useCustomerSubmission = (
  id: string | undefined,
  isEditMode: boolean,
  name: string,
  address: string,
  phoneNumber: string,
  isActive: boolean,
): {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleSubmit: (event: SyntheticEvent) => Promise<void>;
} => {
  const navigate = useNavigate();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  /**
   * Submit form.
   * @param {SyntheticEvent} event - Event
   * @returns {Promise<void>} Promise
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let response: CustomerCreateResponse;

      if (isEditMode && id) {
        response = await updateCustomer({ id, name, address, phone_number: phoneNumber, status: isActive ? 1 : 0 }).unwrap();
      } else {
        response = await createCustomer({ name, address, phone_number: phoneNumber, status: 1 }).unwrap();
      }

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

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
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
  const routeCustomer = location.state?.customer;

  const { data: customerDetail, isLoading: isLoadingDetail } = useGetCustomerByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeCustomer),
  });

  const customerItem = customerDetail?.status && customerDetail.data ? (Array.isArray(customerDetail.data) ? customerDetail.data[0] : customerDetail.data) : null;
  const initialName = routeCustomer?.name ?? customerItem?.name ?? "";
  const initialAddress = routeCustomer?.address ?? customerItem?.address ?? "";
  const initialPhoneNumber = routeCustomer?.phoneNumber ?? customerItem?.phone_number ?? "";
  const initialIsActive = routeCustomer ? routeCustomer.status === "active" : customerItem?.status === 1;

  const [name, setName] = useState(initialName);
  const [address, setAddress] = useState(initialAddress);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [initializedId, setInitializedId] = useState<string | null>(routeCustomer?.id ?? null);
  const isLoadingInitialData = isLoadingDetail && !routeCustomer;

  if (customerItem && customerItem.id !== initializedId) {
    setInitializedId(customerItem.id);
    setName(customerItem.name ?? "");
    setAddress(customerItem.address ?? "");
    setPhoneNumber(customerItem.phone_number ?? "");
    setIsActive(customerItem.status === 1);
  }

  const handleNameChange = _useInputChange(setName);
  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setPhoneNumber(parsePhoneInput(event.target.value));
  };
  const handleAddressChange = _useInputChange(setAddress);
  const handleStatusChange = (): void => { setIsActive((currentIsActive) => !currentIsActive); };
  const submission = _useCustomerSubmission(id, isEditMode, name, address, phoneNumber, isActive);

  /**
   * Go back.
   * @returns {void}
   */
  const goBack = (): void => { navigate(-1); };

  return {
    name,
    address,
    phoneNumber,
    isActive,
    isEditMode,
    isLoadingInitialData,
    handleNameChange,
    handlePhoneNumberChange,
    handleAddressChange,
    handleStatusChange,
    goBack,
    ...submission,
  };
};
