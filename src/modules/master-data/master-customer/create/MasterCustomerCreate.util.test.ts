import {
  buildCustomerPayload,
  formatApiMessages,
  getCustomerFieldErrors,
  normalizeCustomerFormSource,
  parsePhoneInput,
  resolveCustomerForm,
  sendCustomerMutation,
} from "./MasterCustomerCreate.util";

const VALID_VALUES = { name: "PT Mega", email: "a@mega.com", phoneNumber: "081234567890", address: "Jl. Sudirman", isActive: false };

describe("MasterCustomerCreate util", () => {
  it("should keep only digits from phone input", () => {
    expect(parsePhoneInput("+62 812-3456-7890")).toBe("6281234567890");
    expect(parsePhoneInput("phone: 0812abc")).toBe("0812");
    expect(parsePhoneInput("")).toBe("");
  });

  it("should join backend messages or use the default message", () => {
    expect(formatApiMessages(["Duplicate", "name"])).toBe("Duplicate name");
    expect(formatApiMessages("Bad request")).toBe("Bad request");
    expect(formatApiMessages(null)).toBe("Customer request failed.");
  });

  it("should return a ready empty form in create mode", () => {
    expect(normalizeCustomerFormSource({ data: undefined, isLoading: false, isError: false })).toEqual({
      formStatus: "ready",
      initialValues: { name: "", email: "", phoneNumber: "", address: "", isActive: true },
    });
  });

  it("should return loading and error states for the detail query", () => {
    expect(normalizeCustomerFormSource({ data: undefined, isLoading: true, isError: false }).formStatus).toBe("loading");
    expect(normalizeCustomerFormSource({ data: undefined, isLoading: false, isError: true }).formStatus).toBe("error");
    expect(normalizeCustomerFormSource({ data: { status: false, data: null }, isLoading: false, isError: false }).formStatus).toBe("error");
  });

  it("should map the customer detail into form values with defaults applied once", () => {
    const data = { status: true, data: { id: "1", name: "PT Mega", email: null, address: "Jl. Sudirman", phone_number: "0812345678", status: 0 } };

    expect(normalizeCustomerFormSource({ data, isLoading: false, isError: false })).toEqual({
      formStatus: "ready",
      initialValues: { name: "PT Mega", email: "", phoneNumber: "0812345678", address: "Jl. Sudirman", isActive: false },
    });
  });

  it("should accept valid values", () => {
    expect(resolveCustomerForm(VALID_VALUES)).toEqual({ values: VALID_VALUES, errors: {} });
  });

  it("should report the first error of each invalid field", () => {
    const { errors } = resolveCustomerForm({ name: " ", email: "", phoneNumber: "12", address: "", isActive: true });

    expect(getCustomerFieldErrors(errors)).toEqual({
      name: "Customer name is required.",
      email: "Email is required.",
      phoneNumber: "Phone number must contain 6–15 digits.",
      address: "Address is required.",
    });
  });

  it("should reject an invalid email format", () => {
    const { errors } = resolveCustomerForm({ ...VALID_VALUES, email: "invalid-email" });

    expect(getCustomerFieldErrors(errors).email).toBe("Please enter a valid email address.");
  });

  it("should build the request body with the status code", () => {
    expect(buildCustomerPayload(VALID_VALUES)).toEqual({ name: "PT Mega", email: "a@mega.com", address: "Jl. Sudirman", phone_number: "081234567890", status: 0 });
  });

  it("should update when an id exists and create otherwise", async () => {
    const response = { status: true };
    const createCustomer = jest.fn(() => ({ unwrap: (): Promise<typeof response> => Promise.resolve(response) }));
    const updateCustomer = jest.fn(() => ({ unwrap: (): Promise<typeof response> => Promise.resolve(response) }));

    await sendCustomerMutation(VALID_VALUES, { createCustomer, updateCustomer });
    await sendCustomerMutation(VALID_VALUES, { id: "c-1", createCustomer, updateCustomer });

    expect(createCustomer).toHaveBeenCalledWith(buildCustomerPayload(VALID_VALUES));
    expect(updateCustomer).toHaveBeenCalledWith({ ...buildCustomerPayload(VALID_VALUES), id: "c-1" });
  });
});
