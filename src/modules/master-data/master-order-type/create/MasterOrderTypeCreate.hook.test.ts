import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { ORDER_TYPE_FORM_DEFAULT_VALUES } from "./MasterOrderTypeCreate.config";
import { useMasterOrderTypeCreate } from "./MasterOrderTypeCreate.hook";
import type { MasterOrderTypeCreateParams, OrderTypeFormValues } from "./MasterOrderTypeCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const FILLED_VALUES: OrderTypeFormValues = { ...ORDER_TYPE_FORM_DEFAULT_VALUES, name: "Delivery" };

/**
 * Build an input change event.
 * @param {string} value - Input value
 * @returns {ChangeEvent<HTMLInputElement>} - Change event
 */
const changeEvent = (value: string): ChangeEvent<HTMLInputElement> => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

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
 * @param {Partial<MasterOrderTypeCreateParams>} [overrides] - Params to override
 * @returns {MasterOrderTypeCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterOrderTypeCreateParams>): MasterOrderTypeCreateParams => ({
  mode: "create",
  initialValues: ORDER_TYPE_FORM_DEFAULT_VALUES,
  createOrderType: mutationOf({ status: true }),
  updateOrderType: mutationOf({ status: true }),
  ...overrides,
});

describe("useMasterOrderTypeCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit and expose the name error when empty, then clear it on input", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterOrderTypeCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.fieldErrors.name).toBe("Order type name is required.");
    expect(params.createOrderType).not.toHaveBeenCalled();

    act(() => result.current.handleNameChange(changeEvent("Delivery")));
    await waitFor(() => expect(result.current.fieldErrors.name).toBeUndefined());
    expect(result.current.values.name).toBe("Delivery");
  });

  it("should create the order type and return to the list", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterOrderTypeCreate(params));

    act(() => {
      result.current.handleNameChange(changeEvent("Delivery"));
      result.current.handleToggleChange.isHandover(true);
    });
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createOrderType).toHaveBeenCalledWith({ name: "Delivery", is_handover: true, status: 1 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-order-type", { state: { successMessage: "Order type created successfully." } });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: FILLED_VALUES, createOrderType: mutationOf({ status: false, messages: ["Duplicate name"] }) });
    const { result } = renderHook(() => useMasterOrderTypeCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate name");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updateOrderType = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "order-type-1", mode: "edit", initialValues: FILLED_VALUES, updateOrderType });
    const { result } = renderHook(() => useMasterOrderTypeCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update order type. Please try again.");
  });

  it("should load edit values and submit the update", async () => {
    const params = createParams({ id: "order-type-1", mode: "edit" });
    const { result, rerender } = renderHook((props: MasterOrderTypeCreateParams) => useMasterOrderTypeCreate(props), { initialProps: params });

    rerender({ ...params, initialValues: FILLED_VALUES });
    await waitFor(() => expect(result.current.values.name).toBe("Delivery"));

    act(() => result.current.handleToggleChange.isActive(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updateOrderType).toHaveBeenCalledWith({ id: "order-type-1", name: "Delivery", is_handover: false, status: 0 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-order-type", { state: { successMessage: "Order type updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterOrderTypeCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-order-type");
  });
});
