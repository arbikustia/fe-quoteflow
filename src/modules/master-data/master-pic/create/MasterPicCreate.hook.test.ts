import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { PIC_FORM_DEFAULT_VALUES } from "./MasterPicCreate.config";
import { useMasterPicCreate } from "./MasterPicCreate.hook";
import type { MasterPicCreateParams, PicFormValues } from "./MasterPicCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const FILLED_VALUES: PicFormValues = { ...PIC_FORM_DEFAULT_VALUES, name: "Aurora" };

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
 * @param {Partial<MasterPicCreateParams>} [overrides] - Params to override
 * @returns {MasterPicCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterPicCreateParams>): MasterPicCreateParams => ({
  mode: "create",
  initialValues: PIC_FORM_DEFAULT_VALUES,
  createPic: mutationOf({ status: true }),
  updatePic: mutationOf({ status: true }),
  ...overrides,
});

describe("useMasterPicCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit and expose the name error when empty, then clear it on input", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterPicCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.fieldErrors.name).toBe("PIC name is required.");
    expect(params.createPic).not.toHaveBeenCalled();

    act(() => result.current.handleNameChange(changeEvent("Aurora")));
    await waitFor(() => expect(result.current.fieldErrors.name).toBeUndefined());
    expect(result.current.values.name).toBe("Aurora");
  });

  it("should create the PIC and return to the list", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterPicCreate(params));

    act(() => result.current.handleNameChange(changeEvent("Aurora")));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createPic).toHaveBeenCalledWith({ name: "Aurora", status: 1 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-pic", { state: { successMessage: "PIC created successfully." } });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: FILLED_VALUES, createPic: mutationOf({ status: false, messages: ["Duplicate name"] }) });
    const { result } = renderHook(() => useMasterPicCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate name");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updatePic = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "pic-1", mode: "edit", initialValues: FILLED_VALUES, updatePic });
    const { result } = renderHook(() => useMasterPicCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update PIC. Please try again.");
  });

  it("should submit the update with the toggled status", async () => {
    const params = createParams({ id: "pic-1", mode: "edit", initialValues: FILLED_VALUES });
    const { result } = renderHook(() => useMasterPicCreate(params));

    act(() => result.current.handleStatusChange(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updatePic).toHaveBeenCalledWith({ id: "pic-1", name: "Aurora", status: 0 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-pic", { state: { successMessage: "PIC updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterPicCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-pic");
  });
});
