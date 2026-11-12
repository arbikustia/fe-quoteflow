import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { useMasterCategoryCreate } from "./MasterCategoryCreate.hook";
import type { MasterCategoryCreateParams } from "./MasterCategoryCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

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
 * @param {Partial<MasterCategoryCreateParams>} [overrides] - Params to override
 * @returns {MasterCategoryCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterCategoryCreateParams>): MasterCategoryCreateParams => ({
  mode: "create",
  initialValues: { name: "", isActive: true },
  createCategory: mutationOf({ status: true }),
  updateCategory: mutationOf({ status: true }),
  ...overrides,
});

describe("useMasterCategoryCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit and expose the name error when empty, then clear it on input", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterCategoryCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.nameError).toBe("Category name is required.");
    expect(params.createCategory).not.toHaveBeenCalled();

    act(() => result.current.handleNameChange(changeEvent("Audio")));
    await waitFor(() => expect(result.current.nameError).toBeUndefined());
  });

  it("should create the category and return to the list", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterCategoryCreate(params));

    act(() => result.current.handleNameChange(changeEvent("Audio")));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createCategory).toHaveBeenCalledWith({ category_name: "Audio", status: 1 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-category", { state: { successMessage: "Category created successfully." } });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: { name: "Audio", isActive: true }, createCategory: mutationOf({ status: false, messages: ["Duplicate category"] }) });
    const { result } = renderHook(() => useMasterCategoryCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate category");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updateCategory = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "c-1", mode: "edit", initialValues: { name: "Audio", isActive: true }, updateCategory });
    const { result } = renderHook(() => useMasterCategoryCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update category. Please try again.");
  });

  it("should load edit values and submit the update with the toggled status", async () => {
    const params = createParams({ id: "c-1", mode: "edit" });
    const { result, rerender } = renderHook((props: MasterCategoryCreateParams) => useMasterCategoryCreate(props), { initialProps: params });

    rerender({ ...params, initialValues: { name: "Existing", isActive: true } });
    await waitFor(() => expect(result.current.values.name).toBe("Existing"));

    act(() => result.current.handleStatusChange(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updateCategory).toHaveBeenCalledWith({ id: "c-1", category_name: "Existing", status: 0 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-category", { state: { successMessage: "Category updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterCategoryCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-category");
  });
});
