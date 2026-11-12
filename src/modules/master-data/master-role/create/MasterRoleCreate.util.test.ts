import { MOCK_ROLE_DETAIL_RESPONSE } from "@/fixture/master-role";

import { ROLE_FORM_DEFAULT_VALUES } from "./MasterRoleCreate.config";
import type { RoleValidValues } from "./MasterRoleCreate.type";
import {
  buildRolePayload,
  formatApiMessages,
  getRoleFieldErrors,
  normalizeRoleFormSource,
  resolveRoleForm,
  sendRoleMutation,
} from "./MasterRoleCreate.util";

const VALID_VALUES: RoleValidValues = { name: "Administrator", isActive: false };

const EXPECTED_PAYLOAD = { role: "Administrator", status: 0 };

/**
 * Build a mutation trigger that resolves with a successful response.
 * @returns {jest.Mock} - Mutation trigger
 */
const createMutation = (): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

describe("MasterRoleCreate util", () => {
  it("should format backend messages", () => {
    expect(formatApiMessages(["Duplicate", "name"])).toBe("Duplicate name");
    expect(formatApiMessages("Server error")).toBe("Server error");
    expect(formatApiMessages(null)).toBe("Role request failed.");
  });

  it("should return loading, error and an empty ready source", () => {
    const empty = { formStatus: "ready", initialValues: ROLE_FORM_DEFAULT_VALUES };

    expect(normalizeRoleFormSource({ isLoading: true, isError: false }).formStatus).toBe("loading");
    expect(normalizeRoleFormSource({ isLoading: false, isError: true }).formStatus).toBe("error");
    expect(normalizeRoleFormSource({ isLoading: false, isError: false })).toEqual(empty);
  });

  it("should map the detail response into form values", () => {
    const data = MOCK_ROLE_DETAIL_RESPONSE;

    expect(normalizeRoleFormSource({ data, isLoading: false, isError: false })).toEqual({
      formStatus: "ready",
      initialValues: { name: "Administrator", isActive: true },
    });
    expect(normalizeRoleFormSource({ data: { ...data, data: { id: "r", role: null, status: 0 } }, isLoading: false, isError: false }).initialValues).toEqual({
      name: "",
      isActive: false,
    });
  });

  it("should return an error source for a failed or empty detail response", () => {
    const data = MOCK_ROLE_DETAIL_RESPONSE;

    expect(normalizeRoleFormSource({ data: { ...data, status: false }, isLoading: false, isError: false }).formStatus).toBe("error");
    expect(normalizeRoleFormSource({ data: { ...data, data: null }, isLoading: false, isError: false }).formStatus).toBe("error");
  });

  it("should trim the name and require it", () => {
    expect(resolveRoleForm({ ...VALID_VALUES, name: " Administrator " })).toEqual({ values: VALID_VALUES, errors: {} });
    expect(getRoleFieldErrors(resolveRoleForm({ ...ROLE_FORM_DEFAULT_VALUES, name: " " }).errors)).toEqual({
      name: "Role name is required.",
    });
  });

  it("should build the request body with the status code", () => {
    expect(buildRolePayload(VALID_VALUES)).toEqual(EXPECTED_PAYLOAD);
    expect(buildRolePayload({ ...VALID_VALUES, isActive: true }).status).toBe(1);
  });

  it("should send update with the id, otherwise create", async () => {
    const createRole = createMutation();
    const updateRole = createMutation();

    await sendRoleMutation(VALID_VALUES, { createRole, updateRole });
    await sendRoleMutation(VALID_VALUES, { id: "role-1", createRole, updateRole });

    expect(createRole).toHaveBeenCalledWith(EXPECTED_PAYLOAD);
    expect(updateRole).toHaveBeenCalledWith({ ...EXPECTED_PAYLOAD, id: "role-1" });
  });
});
