import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { PROJECT_FORM_DEFAULT_VALUES } from "./MasterProjectCreate.config";
import { useMasterProjectCreate } from "./MasterProjectCreate.hook";
import type { MasterProjectCreateParams, ProjectFormValues, ProjectItemOption } from "./MasterProjectCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const OPTION: ProjectItemOption = { id: "item-1", name: "Beam 290", image: "", price: 100000, stock: 11 };
const FILLED_VALUES: ProjectFormValues = {
  ...PROJECT_FORM_DEFAULT_VALUES,
  name: "Wedding",
  price: 5000,
  selectedItems: [{ ...OPTION, qty: 2 }],
};

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
 * @param {Partial<MasterProjectCreateParams>} [overrides] - Params to override
 * @returns {MasterProjectCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterProjectCreateParams>): MasterProjectCreateParams => ({
  mode: "create",
  initialValues: PROJECT_FORM_DEFAULT_VALUES,
  createProject: mutationOf({ status: true }),
  updateProject: mutationOf({ status: true }),
  ...overrides,
} as MasterProjectCreateParams);

describe("useMasterProjectCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block the first step without items, then advance once an item is selected", async () => {
    const { result } = renderHook(() => useMasterProjectCreate(createParams()));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.step).toBe("items");
    expect(result.current.fieldErrors.selectedItems).toBe("Select at least one item.");

    act(() => result.current.handleItemToggle(OPTION));
    await waitFor(() => expect(result.current.fieldErrors.selectedItems).toBeUndefined());
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.step).toBe("information");
  });

  it("should update the quantity within stock", () => {
    const { result } = renderHook(() => useMasterProjectCreate(createParams({ initialValues: FILLED_VALUES })));

    act(() => result.current.handleItemQuantityChange("item-1", 99));

    expect(result.current.values.selectedItems[0].qty).toBe(11);
  });

  it("should validate the information step and go back through the steps", async () => {
    const { result } = renderHook(() => useMasterProjectCreate(createParams({ initialValues: { ...FILLED_VALUES, name: "", price: null } })));

    await act(() => result.current.handleSubmit(submitEvent()));
    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.step).toBe("information");
    expect(result.current.fieldErrors.name).toBe("Project name is required.");
    expect(result.current.fieldErrors.price).toBe("Project price is required.");

    act(() => {
      result.current.handleNameChange(changeEvent("Wedding"));
      result.current.handlePriceChange(5000);
      result.current.handleRemarkChange(textareaEvent("Note"));
    });
    await waitFor(() => expect(result.current.fieldErrors.name).toBeUndefined());
    expect(result.current.values).toMatchObject({ name: "Wedding", price: 5000, remark: "Note" });

    act(result.current.handleStepBack);
    expect(result.current.step).toBe("items");
  });

  it("should create the project from the preview step and return to the list", async () => {
    const params = createParams({ initialValues: FILLED_VALUES });
    const { result } = renderHook(() => useMasterProjectCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.step).toBe("preview");
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createProject).toHaveBeenCalledWith({ name: "Wedding", remark: "", price: 5000, status: 1, items: [{ item_id: "item-1", qty: 2, price: 100000 }] });
    expect(mockNavigate).toHaveBeenCalledWith("/master-project", { state: { successMessage: "Project created successfully." } });
  });

  it("should submit the update with the toggled status", async () => {
    const params = createParams({ id: "project-1", mode: "edit", initialValues: FILLED_VALUES });
    const { result } = renderHook(() => useMasterProjectCreate(params));

    act(() => result.current.handleStatusChange(false));
    await act(() => result.current.handleSubmit(submitEvent()));
    await act(() => result.current.handleSubmit(submitEvent()));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updateProject).toHaveBeenCalledWith(expect.objectContaining({ id: "project-1", status: 0 }));
    expect(mockNavigate).toHaveBeenCalledWith("/master-project", { state: { successMessage: "Project updated successfully." } });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: FILLED_VALUES, createProject: mutationOf({ status: false, messages: ["Duplicate name"] }) });
    const { result } = renderHook(() => useMasterProjectCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    await act(() => result.current.handleSubmit(submitEvent()));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate name");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updateProject = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "project-1", mode: "edit", initialValues: FILLED_VALUES, updateProject });
    const { result } = renderHook(() => useMasterProjectCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    await act(() => result.current.handleSubmit(submitEvent()));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update project. Please try again.");
  });

  it("should leave the form from the first step", () => {
    const { result } = renderHook(() => useMasterProjectCreate(createParams()));

    act(result.current.handleStepBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-project");
  });
});
