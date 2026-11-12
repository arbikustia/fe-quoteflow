import { MOCK_VOUCHER_DETAIL_RESPONSE } from "@/fixture/master-voucher";

import { VOUCHER_FORM_DEFAULT_VALUES } from "./MasterVoucherCreate.config";
import type { VoucherValidValues } from "./MasterVoucherCreate.type";
import {
  buildVoucherPayload,
  formatApiMessages,
  generateSecureVoucherCode,
  getVoucherFieldErrors,
  normalizeVoucherFormSource,
  resolveVoucherForm,
  sendVoucherMutation,
} from "./MasterVoucherCreate.util";

const VALID_VALUES: VoucherValidValues = { name: "Summer Promo", codeMode: "type", code: "slabc123", discountPercent: 10, isActive: false };

const EXPECTED_PAYLOAD = { name: "Summer Promo", code: "SLABC123", discount_percent: 10, status: 0 };

/**
 * Build a mutation trigger that resolves with a successful response.
 * @returns {jest.Mock} - Mutation trigger
 */
const createMutation = (): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Resolve the errors of a form value set.
 * @param {Partial<VoucherValidValues>} overrides - Values to override
 * @returns {Record<string, string | undefined>} - Message per field
 */
const errorsOf = (overrides: Partial<VoucherValidValues>): Record<string, string | undefined> =>
  getVoucherFieldErrors(resolveVoucherForm({ ...VALID_VALUES, ...overrides }).errors);

describe("MasterVoucherCreate util", () => {
  it("should format backend messages", () => {
    expect(formatApiMessages(["Duplicate", "name"])).toBe("Duplicate name");
    expect(formatApiMessages("Server error")).toBe("Server error");
    expect(formatApiMessages(null)).toBe("Voucher request failed.");
  });

  it("should return loading, error and an empty ready source", () => {
    const empty = { formStatus: "ready", initialValues: VOUCHER_FORM_DEFAULT_VALUES };

    expect(normalizeVoucherFormSource({ isLoading: true, isError: false }).formStatus).toBe("loading");
    expect(normalizeVoucherFormSource({ isLoading: false, isError: true }).formStatus).toBe("error");
    expect(normalizeVoucherFormSource({ isLoading: false, isError: false })).toEqual(empty);
  });

  it("should map the detail response into form values in type mode", () => {
    const data = MOCK_VOUCHER_DETAIL_RESPONSE;

    expect(normalizeVoucherFormSource({ data, isLoading: false, isError: false })).toEqual({
      formStatus: "ready",
      initialValues: { name: "Summer Promo", codeMode: "type", code: "SLABC123", discountPercent: 10, isActive: true },
    });
  });

  it("should return an error source for a failed or empty detail response", () => {
    const data = MOCK_VOUCHER_DETAIL_RESPONSE;

    expect(normalizeVoucherFormSource({ data: { ...data, status: false }, isLoading: false, isError: false }).formStatus).toBe("error");
    expect(normalizeVoucherFormSource({ data: { ...data, data: null }, isLoading: false, isError: false }).formStatus).toBe("error");
  });

  it("should generate a prefixed code of unbiased random characters", () => {
    expect(generateSecureVoucherCode()).toMatch(/^SL[A-Z0-9]{6}$/);
  });

  it("should retry random bytes that would bias the code", () => {
    const biasedThenValid = jest
      .spyOn(crypto, "getRandomValues")
      .mockImplementationOnce(((array: Uint8Array) => array.fill(255)) as never)
      .mockImplementationOnce(((array: Uint8Array) => array.fill(1)) as never);

    expect(generateSecureVoucherCode()).toBe("SLBBBBBB");
    biasedThenValid.mockRestore();
  });

  it("should throw when secure randomness is unavailable", () => {
    jest.spyOn(globalThis, "crypto", "get").mockReturnValue(undefined as never);

    expect(generateSecureVoucherCode).toThrow("Secure random generator is unavailable.");
    jest.restoreAllMocks();
  });

  it("should trim the name and accept valid values", () => {
    expect(resolveVoucherForm({ ...VALID_VALUES, name: " Summer Promo " })).toEqual({ values: VALID_VALUES, errors: {} });
  });

  it("should require the name and the discount", () => {
    expect(errorsOf({ name: " " }).name).toBe("Voucher name is required.");
    expect(errorsOf({ discountPercent: null as never }).discountPercent).toBe("Discount percentage is required.");
  });

  it("should keep the discount between 0 and 100", () => {
    expect(errorsOf({ discountPercent: -1 }).discountPercent).toBe("Discount must be between 0 and 100.");
    expect(errorsOf({ discountPercent: 101 }).discountPercent).toBe("Discount must be between 0 and 100.");
    expect(errorsOf({ discountPercent: 0 }).discountPercent).toBeUndefined();
    expect(errorsOf({ discountPercent: 100 }).discountPercent).toBeUndefined();
  });

  it("should validate the code only in type mode", () => {
    expect(errorsOf({ code: " " }).code).toBe("Voucher code is required.");
    expect(errorsOf({ code: "ABC123" }).code).toBe("Voucher code must be 7 to 8 alphanumeric characters.");
    expect(errorsOf({ code: "ABC12345!" }).code).toBe("Voucher code must be 7 to 8 alphanumeric characters.");
    expect(errorsOf({ code: "SLGHT857" }).code).toBeUndefined();
    expect(errorsOf({ code: "abc1234" }).code).toBeUndefined();
    expect(errorsOf({ codeMode: "generate", code: "" }).code).toBeUndefined();
  });

  it("should build the request body with an uppercased typed code and the status code", () => {
    expect(buildVoucherPayload(VALID_VALUES)).toEqual(EXPECTED_PAYLOAD);
    expect(buildVoucherPayload({ ...VALID_VALUES, isActive: true }).status).toBe(1);
  });

  it("should generate the code in generate mode", () => {
    expect(buildVoucherPayload({ ...VALID_VALUES, codeMode: "generate", code: "" }).code).toMatch(/^SL[A-Z0-9]{6}$/);
  });

  it("should send update with the id, otherwise create", async () => {
    const createVoucher = createMutation();
    const updateVoucher = createMutation();

    await sendVoucherMutation(VALID_VALUES, { createVoucher, updateVoucher });
    await sendVoucherMutation(VALID_VALUES, { id: "voucher-1", createVoucher, updateVoucher });

    expect(createVoucher).toHaveBeenCalledWith(EXPECTED_PAYLOAD);
    expect(updateVoucher).toHaveBeenCalledWith({ ...EXPECTED_PAYLOAD, id: "voucher-1" });
  });
});
