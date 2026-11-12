import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { PAYMENT_METHOD_FORM_DEFAULT_VALUES } from "./MasterPaymentMethodCreate.config";
import { useMasterPaymentMethodCreate } from "./MasterPaymentMethodCreate.hook";
import type { MasterPaymentMethodCreateParams, PaymentMethodFormValues } from "./MasterPaymentMethodCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const FILLED_VALUES: PaymentMethodFormValues = { ...PAYMENT_METHOD_FORM_DEFAULT_VALUES, name: "BCA", description: "No Admin Fee" };

/**
 * Build an input change event.
 * @param {string} value - Input value
 * @returns {ChangeEvent<HTMLInputElement>} - Change event
 */
const changeEvent = (value: string): ChangeEvent<HTMLInputElement> => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

/**
 * Build a textarea change event.
 * @param {string} value - Textarea value
 * @returns {ChangeEvent<HTMLTextAreaElement>} - Change event
 */
const textareaEvent = (value: string): ChangeEvent<HTMLTextAreaElement> => ({ target: { value } }) as ChangeEvent<HTMLTextAreaElement>;

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
const mutationOf = (response: MockMutationResponse): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<MockMutationResponse> => Promise.resolve(response) }));

/**
 * Build hook params.
 * @param {Partial<MasterPaymentMethodCreateParams>} [overrides] - Params to override
 * @returns {MasterPaymentMethodCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterPaymentMethodCreateParams>): MasterPaymentMethodCreateParams => ({
  mode: "create",
  initialValues: PAYMENT_METHOD_FORM_DEFAULT_VALUES,
  createPaymentMethod: mutationOf({ status: true }),
  updatePaymentMethod: mutationOf({ status: true }),
  ...overrides,
});

describe("useMasterPaymentMethodCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit and expose the name error when empty, then clear it on input", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterPaymentMethodCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.fieldErrors.name).toBe("Payment method name is required.");
    expect(result.current.fieldErrors.description).toBe("Description is required.");
    expect(params.createPaymentMethod).not.toHaveBeenCalled();

    act(() => result.current.handleNameChange(changeEvent("BCA")));
    await waitFor(() => expect(result.current.fieldErrors.name).toBeUndefined());
    expect(result.current.values.name).toBe("BCA");
  });

  it("should create the payment method and return to the list", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterPaymentMethodCreate(params));

    act(() => {
      result.current.handleNameChange(changeEvent("BCA"));
      result.current.handleDescriptionChange(textareaEvent("No Admin Fee"));
    });
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createPaymentMethod).toHaveBeenCalledWith({ name: "BCA", description: "No Admin Fee", status: 1 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-payment-method", { state: { successMessage: "Payment method created successfully." } });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: FILLED_VALUES, createPaymentMethod: mutationOf({ status: false, messages: ["Duplicate name"] }) });
    const { result } = renderHook(() => useMasterPaymentMethodCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate name");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updatePaymentMethod = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "payment-method-1", mode: "edit", initialValues: FILLED_VALUES, updatePaymentMethod });
    const { result } = renderHook(() => useMasterPaymentMethodCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update payment method. Please try again.");
  });

  it("should submit the update with the toggled status", async () => {
    const params = createParams({ id: "payment-method-1", mode: "edit", initialValues: FILLED_VALUES });
    const { result } = renderHook(() => useMasterPaymentMethodCreate(params));

    act(() => result.current.handleStatusChange(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updatePaymentMethod).toHaveBeenCalledWith({ id: "payment-method-1", name: "BCA", description: "No Admin Fee", status: 0 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-payment-method", { state: { successMessage: "Payment method updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterPaymentMethodCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-payment-method");
  });
});
