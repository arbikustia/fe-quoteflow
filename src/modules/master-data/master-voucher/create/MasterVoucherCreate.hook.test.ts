import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { VOUCHER_FORM_DEFAULT_VALUES } from "./MasterVoucherCreate.config";
import { useMasterVoucherCreate } from "./MasterVoucherCreate.hook";
import type { MasterVoucherCreateParams, VoucherFormValues } from "./MasterVoucherCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const FILLED_VALUES: VoucherFormValues = { name: "Summer Promo", codeMode: "type", code: "SLABC123", discountPercent: 10, isActive: true };

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
 * @param {Partial<MasterVoucherCreateParams>} [overrides] - Params to override
 * @returns {MasterVoucherCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterVoucherCreateParams>): MasterVoucherCreateParams => ({
  mode: "create",
  initialValues: VOUCHER_FORM_DEFAULT_VALUES,
  createVoucher: mutationOf({ status: true }),
  updateVoucher: mutationOf({ status: true }),
  ...overrides,
});

describe("useMasterVoucherCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit and expose errors when empty, then clear them on input", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterVoucherCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.fieldErrors.name).toBe("Voucher name is required.");
    expect(result.current.fieldErrors.discountPercent).toBe("Discount percentage is required.");
    expect(params.createVoucher).not.toHaveBeenCalled();

    act(() => result.current.handleNameChange(changeEvent("Summer Promo")));
    act(() => result.current.handleDiscountChange(10));
    await waitFor(() => expect(result.current.fieldErrors).toEqual({}));
    expect(result.current.values).toMatchObject({ name: "Summer Promo", discountPercent: 10 });
  });

  it("should create the voucher with a generated code and return to the list", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterVoucherCreate(params));

    act(() => result.current.handleNameChange(changeEvent("Summer Promo")));
    act(() => result.current.handleDiscountChange(10));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createVoucher).toHaveBeenCalledWith({
      name: "Summer Promo",
      code: expect.stringMatching(/^SL[A-Z0-9]{6}$/),
      discount_percent: 10,
      status: 1,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/master-voucher", { state: { successMessage: "Voucher created successfully." } });
  });

  it("should require a valid typed code after switching the code option", async () => {
    const params = createParams({ initialValues: { ...FILLED_VALUES, codeMode: "generate", code: "" } });
    const { result } = renderHook(() => useMasterVoucherCreate(params));

    act(() => result.current.handleCodeModeChange("type"));
    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.fieldErrors.code).toBe("Voucher code is required.");

    act(() => result.current.handleCodeChange(changeEvent("abc1234")));
    await waitFor(() => expect(result.current.fieldErrors.code).toBeUndefined());
    await act(() => result.current.handleSubmit(submitEvent()));
    expect(params.createVoucher).toHaveBeenCalledWith(expect.objectContaining({ code: "ABC1234" }));

    act(() => result.current.handleCodeModeChange("generate"));
    expect(result.current.values).toMatchObject({ codeMode: "generate", code: "" });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: FILLED_VALUES, createVoucher: mutationOf({ status: false, messages: ["Duplicate name"] }) });
    const { result } = renderHook(() => useMasterVoucherCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate name");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updateVoucher = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "voucher-1", mode: "edit", initialValues: FILLED_VALUES, updateVoucher });
    const { result } = renderHook(() => useMasterVoucherCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update voucher. Please try again.");
  });

  it("should submit the update with the toggled status", async () => {
    const params = createParams({ id: "voucher-1", mode: "edit", initialValues: FILLED_VALUES });
    const { result } = renderHook(() => useMasterVoucherCreate(params));

    act(() => result.current.handleStatusChange(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updateVoucher).toHaveBeenCalledWith({ id: "voucher-1", name: "Summer Promo", code: "SLABC123", discount_percent: 10, status: 0 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-voucher", { state: { successMessage: "Voucher updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterVoucherCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-voucher");
  });
});
