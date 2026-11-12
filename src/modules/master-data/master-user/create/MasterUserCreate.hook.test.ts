import type { ChangeEvent, SubmitEvent } from "react";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { USER_FORM_DEFAULT_VALUES } from "./MasterUserCreate.config";
import { useMasterUserCreate } from "./MasterUserCreate.hook";
import type { MasterUserCreateParams, UserFormValues } from "./MasterUserCreate.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

type MockMutationResponse = {
  status: boolean;
  messages?: string[];
};

const FILLED_VALUES: UserFormValues = { username: "johndoe", email: "john@example.com", password: "secret", role: "Sales", isActive: true };

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
 * @param {Partial<MasterUserCreateParams>} [overrides] - Params to override
 * @returns {MasterUserCreateParams} - Hook params
 */
const createParams = (overrides?: Partial<MasterUserCreateParams>): MasterUserCreateParams => ({
  mode: "create",
  initialValues: USER_FORM_DEFAULT_VALUES,
  createUser: mutationOf({ status: true }),
  updateUser: mutationOf({ status: true }),
  ...overrides,
});

describe("useMasterUserCreate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block submit and expose required errors when empty, then clear them on input", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterUserCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.fieldErrors).toEqual({
      username: "Username is required.",
      email: "Email is required.",
      password: "Password is required.",
      role: "Role is required.",
    });
    expect(params.createUser).not.toHaveBeenCalled();

    act(() => result.current.handleUsernameChange(changeEvent("johndoe")));
    act(() => result.current.handleRoleChange("Sales"));
    await waitFor(() => expect(result.current.fieldErrors.username).toBeUndefined());
    expect(result.current.fieldErrors.role).toBeUndefined();
    expect(result.current.values).toMatchObject({ username: "johndoe", role: "Sales" });
  });

  it("should toggle the password visibility", () => {
    const { result } = renderHook(() => useMasterUserCreate(createParams()));

    act(result.current.handleTogglePasswordVisibility);
    expect(result.current.isPasswordVisible).toBe(true);
  });

  it("should create the user and return to the list", async () => {
    const params = createParams();
    const { result } = renderHook(() => useMasterUserCreate(params));

    act(() => result.current.handleUsernameChange(changeEvent("johndoe")));
    act(() => result.current.handleEmailChange(changeEvent("john@example.com")));
    act(() => result.current.handlePasswordChange(changeEvent("secret")));
    act(() => result.current.handleRoleChange("Sales"));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.createUser).toHaveBeenCalledWith({ username: "johndoe", email: "john@example.com", password: "secret", role: ["Sales"], status: 1 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-user", { state: { successMessage: "User created successfully." } });
  });

  it("should show backend messages when the API rejects the request", async () => {
    const params = createParams({ initialValues: FILLED_VALUES, createUser: mutationOf({ status: false, messages: ["Duplicate username"] }) });
    const { result } = renderHook(() => useMasterUserCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Duplicate username");
  });

  it("should show the mode failure message when the request throws", async () => {
    const updateUser = jest.fn(() => ({ unwrap: (): Promise<never> => Promise.reject(new Error("network")) }));
    const params = createParams({ id: "user-1", mode: "edit", initialValues: FILLED_VALUES, updateUser });
    const { result } = renderHook(() => useMasterUserCreate(params));

    await act(() => result.current.handleSubmit(submitEvent()));

    expect(result.current.errorMessage).toBe("Unable to update user. Please try again.");
  });

  it("should submit the update with the toggled status", async () => {
    const params = createParams({ id: "user-1", mode: "edit", initialValues: FILLED_VALUES });
    const { result } = renderHook(() => useMasterUserCreate(params));

    act(() => result.current.handleStatusChange(false));
    await act(() => result.current.handleSubmit(submitEvent()));

    expect(params.updateUser).toHaveBeenCalledWith({ id: "user-1", username: "johndoe", email: "john@example.com", role: ["Sales"], status: 0 });
    expect(mockNavigate).toHaveBeenCalledWith("/master-user", { state: { successMessage: "User updated successfully." } });
  });

  it("should navigate back to the list", () => {
    const { result } = renderHook(() => useMasterUserCreate(createParams()));

    act(result.current.handleBack);

    expect(mockNavigate).toHaveBeenCalledWith("/master-user");
  });
});
