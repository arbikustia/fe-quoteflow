import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { useMasterCustomerCreate } from "./MasterCustomerCreate.hook";
import type { CustomerFormValues, MasterCustomerCreateParams } from "./MasterCustomerCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const EMPTY_VALUES: CustomerFormValues = { name: "", email: "", phoneNumber: "", address: "", isActive: true };

/**
 * Build an input change event.
 * @param {string} value - Input value
 * @returns {ChangeEvent<HTMLInputElement & HTMLTextAreaElement>} - Change event
 */
const changeEvent = (value: string): ChangeEvent<HTMLInputElement & HTMLTextAreaElement> => ({ target: { value } }) as ChangeEvent<HTMLInputElement & HTMLTextAreaElement>;

/**
 * Build a form submit event.
 * @returns {SubmitEvent<HTMLFormElement>} - Submit event
 */
const submitEvent = (): SubmitEvent<HTMLFormElement> => ({ preventDefault: jest.fn(), persist: jest.fn() }) as never;

/**
 * Build a mutation trigger that resolves with the given response.
 * @param {MockMutationResponse} response - Mutation response
 * @returns {jest.Mock} - Mutation trigger
 */
const mutationOf = (response: MockMutationResponse): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<typeof response> => Promise.resolve(response) }));

/**
 * Build hook params.
 * @param {Partial<MasterCustomerCreateParams>} [overrides] - Params to override
 * @returns {MasterCustomerCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterCustomerCreateParams>): MasterCustomerCreateParams => ({
  mode: "create",
  initialValues: EMPTY_VALUES,
  createCustomer: mutationOf({ status: true }),
  updateCustomer: mutationOf({ status: true }),
  ...overrides,
});

describe("useMasterCustomerCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit and expose field errors when required fields are empty", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterCustomerCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.fieldErrors.name).toBe("Customer name is required.");
    expect(params.createCustomer).not.toHaveBeenCalled();
  });

  it("should create the customer and return to the list with a success message", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterCustomerCreate(params));

    act(() => {
      result.current.handleNameChange(changeEvent("Test Customer"));
      result.current.handleEmailChange(changeEvent("test@example.com"));
      result.current.handlePhoneNumberChange(changeEvent("0812-3456-7890"));
      result.current.handleAddressChange(changeEvent("Test Address"));
    });
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createCustomer).toHaveBeenCalledWith({ name: "Test Customer", email: "test@example.com", address: "Test Address", phone_number: "081234567890", status: 1 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-customer", { state: { successMessage: "Customer created successfully." } });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: { ...EMPTY_VALUES, name: "A", email: "a@b.co", phoneNumber: "123456", address: "X" }, createCustomer: mutationOf({ status: false, messages: ["Duplicate customer name"] }) });
    const { result } = renderHook(() => useMasterCustomerCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    await waitFor(() => expect(result.current.errorMessage).toBe("Duplicate customer name"));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should show the mode failure message when the request throws", async () => {
    const updateCustomer = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "c-1", mode: "edit", initialValues: { ...EMPTY_VALUES, name: "A", email: "a@b.co", phoneNumber: "123456", address: "X" }, updateCustomer });
    const { result } = renderHook(() => useMasterCustomerCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update customer. Please try again.");
  });

  it("should load edit values and submit the update with the toggled status", async () => {
    const params = createParams({ id: "c-1", mode: "edit" });
    const { result, rerender } = renderHook((props: MasterCustomerCreateParams) => useMasterCustomerCreate(props), { initialProps: params });

    rerender({ ...params, initialValues: { name: "Existing", email: "e@x.com", phoneNumber: "081999888777", address: "Addr", isActive: true } });
    await waitFor(() => expect(result.current.values.name).toBe("Existing"));

    act(() => result.current.handleStatusChange(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updateCustomer).toHaveBeenCalledWith({ id: "c-1", name: "Existing", email: "e@x.com", address: "Addr", phone_number: "081999888777", status: 0 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-customer", { state: { successMessage: "Customer updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterCustomerCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-customer");
  });
});
