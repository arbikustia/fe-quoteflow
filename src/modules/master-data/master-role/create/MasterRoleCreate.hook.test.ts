import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { ROLE_FORM_DEFAULT_VALUES } from "./MasterRoleCreate.config";
import { useMasterRoleCreate } from "./MasterRoleCreate.hook";
import type { MasterRoleCreateParams, RoleFormValues } from "./MasterRoleCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const FILLED_VALUES: RoleFormValues = { ...ROLE_FORM_DEFAULT_VALUES, name: "Administrator" };

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
 * @param {Partial<MasterRoleCreateParams>} [overrides] - Params to override
 * @returns {MasterRoleCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterRoleCreateParams>): MasterRoleCreateParams => ({
  mode: "create",
  initialValues: ROLE_FORM_DEFAULT_VALUES,
  createRole: mutationOf({ status: true }),
  updateRole: mutationOf({ status: true }),
  ...overrides,
});

describe("useMasterRoleCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit and expose the name error when empty, then clear it on input", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterRoleCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.fieldErrors.name).toBe("Role name is required.");
    expect(params.createRole).not.toHaveBeenCalled();

    act(() => result.current.handleNameChange(changeEvent("Administrator")));
    await waitFor(() => expect(result.current.fieldErrors.name).toBeUndefined());
    expect(result.current.values.name).toBe("Administrator");
  });

  it("should create the role and return to the list", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterRoleCreate(params));

    act(() => result.current.handleNameChange(changeEvent("Administrator")));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createRole).toHaveBeenCalledWith({ role: "Administrator", status: 1 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-role", { state: { successMessage: "Role created successfully." } });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: FILLED_VALUES, createRole: mutationOf({ status: false, messages: ["Duplicate name"] }) });
    const { result } = renderHook(() => useMasterRoleCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate name");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updateRole = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "role-1", mode: "edit", initialValues: FILLED_VALUES, updateRole });
    const { result } = renderHook(() => useMasterRoleCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update role. Please try again.");
  });

  it("should submit the update with the toggled status", async () => {
    const params = createParams({ id: "role-1", mode: "edit", initialValues: FILLED_VALUES });
    const { result } = renderHook(() => useMasterRoleCreate(params));

    act(() => result.current.handleStatusChange(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updateRole).toHaveBeenCalledWith({ id: "role-1", role: "Administrator", status: 0 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-role", { state: { successMessage: "Role updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterRoleCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-role");
  });
});
