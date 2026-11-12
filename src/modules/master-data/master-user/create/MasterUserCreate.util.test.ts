import { MOCK_ROLE_ALL_RESPONSE } from "@/fixture/master-role";
import { MOCK_USER_DETAIL_RESPONSE } from "@/fixture/master-user";

import { USER_FORM_DEFAULT_VALUES } from "./MasterUserCreate.config";
import type { UserValidValues } from "./MasterUserCreate.type";
import {
  buildUserPayload,
  formatApiMessages,
  getUserFieldErrors,
  normalizeRoleOptions,
  normalizeUserFormSource,
  resolveUserForm,
  sendUserMutation,
} from "./MasterUserCreate.util";

const VALID_VALUES: UserValidValues = { username: "johndoe", email: "john@example.com", password: "secret", role: "Sales", isActive: false };

const EXPECTED_PAYLOAD = { username: "johndoe", email: "john@example.com", password: "secret", role: ["Sales"], status: 0 };

/**
 * Build a mutation trigger that resolves with a successful response.
 * @returns {jest.Mock} - Mutation trigger
 */
const createMutation = (): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

describe("MasterUserCreate util", () => {
  it("should format backend messages", () => {
    expect(formatApiMessages(["Duplicate", "username"])).toBe("Duplicate username");
    expect(formatApiMessages("Server error")).toBe("Server error");
    expect(formatApiMessages(null)).toBe("User request failed.");
  });

  it("should return loading, error and an empty ready source", () => {
    const empty = { formStatus: "ready", initialValues: USER_FORM_DEFAULT_VALUES };

    expect(normalizeUserFormSource({ isLoading: true, isError: false }).formStatus).toBe("loading");
    expect(normalizeUserFormSource({ isLoading: false, isError: true }).formStatus).toBe("error");
    expect(normalizeUserFormSource({ isLoading: false, isError: false })).toEqual(empty);
  });

  it("should map the detail response into form values", () => {
    const data = MOCK_USER_DETAIL_RESPONSE;
    const sparse = { ...data, data: { id: "user-3", role: "Sales", status: 0 } };

    expect(normalizeUserFormSource({ data, isLoading: false, isError: false })).toEqual({
      formStatus: "ready",
      initialValues: { username: "arbikustia14", email: "arbi@example.com", password: "", role: "Administrator", isActive: true },
    });
    expect(normalizeUserFormSource({ data: sparse, isLoading: false, isError: false }).initialValues).toEqual({
      username: "",
      email: "",
      password: "",
      role: "Sales",
      isActive: false,
    });
  });

  it("should return an error source for a failed or empty detail response", () => {
    const data = MOCK_USER_DETAIL_RESPONSE;

    expect(normalizeUserFormSource({ data: { ...data, status: false }, isLoading: false, isError: false }).formStatus).toBe("error");
    expect(normalizeUserFormSource({ data: { ...data, data: null }, isLoading: false, isError: false }).formStatus).toBe("error");
  });

  it("should trim values and require the password only in create mode", () => {
    const editValues = { ...VALID_VALUES, password: "" };

    expect(resolveUserForm({ ...VALID_VALUES, username: " johndoe " }, "create")).toEqual({ values: VALID_VALUES, errors: {} });
    expect(resolveUserForm(editValues, "edit")).toEqual({ values: editValues, errors: {} });
    expect(getUserFieldErrors(resolveUserForm(editValues, "create").errors)).toEqual({ password: "Password is required." });
  });

  it("should report required and invalid fields", () => {
    expect(getUserFieldErrors(resolveUserForm({ ...USER_FORM_DEFAULT_VALUES, username: " " }, "edit").errors)).toEqual({
      username: "Username is required.",
      email: "Email is required.",
      role: "Role is required.",
    });
    expect(getUserFieldErrors(resolveUserForm({ ...VALID_VALUES, email: "john" }, "edit").errors)).toEqual({ email: "Invalid email address." });
  });

  it("should build the request body with the role list and status code", () => {
    expect(buildUserPayload(VALID_VALUES)).toEqual(EXPECTED_PAYLOAD);
    expect(buildUserPayload({ ...VALID_VALUES, isActive: true }).status).toBe(1);
  });

  it("should send update with the id and without password, otherwise create", async () => {
    const createUser = createMutation();
    const updateUser = createMutation();
    const { password: _password, ...updatePayload } = EXPECTED_PAYLOAD;

    await sendUserMutation(VALID_VALUES, { createUser, updateUser });
    await sendUserMutation(VALID_VALUES, { id: "user-1", createUser, updateUser });

    expect(createUser).toHaveBeenCalledWith(EXPECTED_PAYLOAD);
    expect(updateUser).toHaveBeenCalledWith({ ...updatePayload, id: "user-1" });
  });

  it("should map roles into select options", () => {
    expect(normalizeRoleOptions({ data: MOCK_ROLE_ALL_RESPONSE, isLoading: false, isError: false })).toEqual({
      roleOptions: [
        { label: "Administrator", value: "Administrator" },
        { label: "Sales", value: "Sales" },
      ],
      isRoleOptionsLoading: false,
    });
    expect(normalizeRoleOptions({ isLoading: true, isError: false })).toEqual({ roleOptions: [], isRoleOptionsLoading: true });
  });

  it("should return a role error for a failed or rejected role query", () => {
    expect(normalizeRoleOptions({ isLoading: false, isError: true }).roleOptionsError).toBe("Unable to load roles.");
    expect(normalizeRoleOptions({ data: { ...MOCK_ROLE_ALL_RESPONSE, status: false }, isLoading: false, isError: false }).roleOptionsError).toBe(
      "User request failed.",
    );
  });
});
