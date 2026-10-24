import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { useMasterCustomerCreate } from "./MasterCustomerCreate.hook";

import * as Router from "react-router-dom";
import * as CustomerService from "@/services/master-customer.service";

jest.mock("react-router-dom", () => ({ useLocation: jest.fn(), useNavigate: jest.fn(), useParams: jest.fn() }));
jest.mock("@/services/master-customer.service", () => ({ useCreateCustomerMutation: jest.fn(), useGetCustomerByIdQuery: jest.fn(), useUpdateCustomerMutation: jest.fn() }));

describe("useMasterCustomerCreate", (): void => {
  const createCustomer = jest.fn();
  const updateCustomer = jest.fn();
  const navigate = jest.fn<Router.NavigateFunction>();

  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate as never);
    jest.mocked(Router.useLocation).mockReturnValue({ state: null } as never);
    jest.mocked(Router.useParams).mockReturnValue({});
    jest.mocked(CustomerService.useCreateCustomerMutation).mockReturnValue([createCustomer, { isLoading: false }] as never);
    jest.mocked(CustomerService.useUpdateCustomerMutation).mockReturnValue([updateCustomer, { isLoading: false }] as never);
    jest.mocked(CustomerService.useGetCustomerByIdQuery).mockReturnValue({ data: undefined, isLoading: false } as never);
  });

  it("should prevent submission when required fields are empty", async (): Promise<void> => {
    const { result } = renderHook(() => useMasterCustomerCreate());

    await act(async (): Promise<void> => { await result.current.handleSubmit({ preventDefault: jest.fn() } as never); });

    expect(result.current.isSubmitted).toBe(true);
    expect(createCustomer).not.toHaveBeenCalled();
  });

  it("should create customer and navigate on successful submission", async (): Promise<void> => {
    createCustomer.mockReturnValue({ unwrap: (): Promise<{ status: boolean; messages: null; data: null }> => Promise.resolve({ status: true, messages: null, data: null }) });
    const { result } = renderHook(() => useMasterCustomerCreate());

    act((): void => {
      result.current.handleNameChange({ target: { value: "Test Customer" } } as never);
      result.current.handlePhoneNumberChange({ target: { value: "081234567890" } } as never);
      result.current.handleAddressChange({ target: { value: "Test Address" } } as never);
    });
    await act(async (): Promise<void> => { await result.current.handleSubmit({ preventDefault: jest.fn() } as never); });

    expect(createCustomer).toHaveBeenCalledWith({ name: "Test Customer", address: "Test Address", phone_number: "081234567890", status: 1 });
    expect(result.current.successMessage).toBe("Customer created successfully.");
  });

  it("should show message when API rejects customer creation", async (): Promise<void> => {
    createCustomer.mockReturnValue({ unwrap: (): Promise<{ status: boolean; messages: string[]; data: null }> => Promise.resolve({ status: false, messages: ["Duplicate customer name"], data: null }) });
    const { result } = renderHook(() => useMasterCustomerCreate());

    act((): void => {
      result.current.handleNameChange({ target: { value: "Test Customer" } } as never);
      result.current.handlePhoneNumberChange({ target: { value: "081234567890" } } as never);
      result.current.handleAddressChange({ target: { value: "Test Address" } } as never);
    });
    await act(async (): Promise<void> => { await result.current.handleSubmit({ preventDefault: jest.fn() } as never); });

    await waitFor((): void => expect(result.current.errorMessage).toBe("Duplicate customer name"));
  });

  it("should initialize edit values and submit update payload", async (): Promise<void> => {
    jest.mocked(Router.useParams).mockReturnValue({ id: "customer-1" });
    jest.mocked(CustomerService.useGetCustomerByIdQuery).mockReturnValue({ data: { status: true, messages: null, data: { id: "customer-1", name: "Existing Customer", address: "Existing Address", phone_number: "081999888777", status: 1, created_at: null, created_by: null } }, isLoading: false } as never);
    updateCustomer.mockReturnValue({ unwrap: (): Promise<{ status: boolean; messages: null; data: null }> => Promise.resolve({ status: true, messages: null, data: null }) });
    const { result } = renderHook(() => useMasterCustomerCreate());

    await waitFor((): void => expect(result.current.name).toBe("Existing Customer"));
    await act(async (): Promise<void> => { await result.current.handleSubmit({ preventDefault: jest.fn() } as never); });

    expect(updateCustomer).toHaveBeenCalledWith({ id: "customer-1", name: "Existing Customer", address: "Existing Address", phone_number: "081999888777", status: 1 });
  });
});
