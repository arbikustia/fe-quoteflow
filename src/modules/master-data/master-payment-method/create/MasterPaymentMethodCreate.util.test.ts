import { MOCK_API_PAYMENT_METHODS } from "@/fixture/master-payment-method";

import { PAYMENT_METHOD_FORM_DEFAULT_VALUES } from "./MasterPaymentMethodCreate.config";
import type { PaymentMethodValidValues } from "./MasterPaymentMethodCreate.type";
import {
  buildPaymentMethodPayload,
  formatApiMessages,
  getPaymentMethodFieldErrors,
  normalizePaymentMethodFormSource,
  resolvePaymentMethodForm,
  sendPaymentMethodMutation,
} from "./MasterPaymentMethodCreate.util";

const VALID_VALUES: PaymentMethodValidValues = { name: "BCA", description: "No Admin Fee", isActive: false };

const EXPECTED_PAYLOAD = { name: "BCA", description: "No Admin Fee", status: 0 };

/**
 * Build a mutation trigger that resolves with a successful response.
 * @returns {jest.Mock} - Mutation trigger
 */
const createMutation = (): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

describe("MasterPaymentMethodCreate util", () => {
  it("should format backend messages", () => {
    expect(formatApiMessages(["Duplicate", "name"])).toBe("Duplicate name");
    expect(formatApiMessages("Server error")).toBe("Server error");
    expect(formatApiMessages(null)).toBe("Payment method request failed.");
  });

  it("should return a ready create source without an id", () => {
    expect(normalizePaymentMethodFormSource({})).toEqual({ formStatus: "ready", initialValues: PAYMENT_METHOD_FORM_DEFAULT_VALUES });
  });

  it("should map the router-state record into form values", () => {
    expect(normalizePaymentMethodFormSource({ id: "payment-method-1", routePaymentMethod: MOCK_API_PAYMENT_METHODS[0] })).toEqual({
      formStatus: "ready",
      initialValues: { name: "BCA", description: "No Admin Fee", isActive: true },
    });
    expect(normalizePaymentMethodFormSource({ id: "payment-method-2", routePaymentMethod: MOCK_API_PAYMENT_METHODS[1] }).initialValues).toEqual({
      name: "BRI",
      description: "",
      isActive: false,
    });
  });

  it("should return an error source without matching router state", () => {
    expect(normalizePaymentMethodFormSource({ id: "payment-method-1" }).formStatus).toBe("error");
    expect(normalizePaymentMethodFormSource({ id: "payment-method-2", routePaymentMethod: MOCK_API_PAYMENT_METHODS[0] }).formStatus).toBe("error");
  });

  it("should trim the fields and require name and description", () => {
    expect(resolvePaymentMethodForm({ ...VALID_VALUES, name: " BCA " })).toEqual({ values: VALID_VALUES, errors: {} });
    expect(getPaymentMethodFieldErrors(resolvePaymentMethodForm({ ...PAYMENT_METHOD_FORM_DEFAULT_VALUES, name: " " }).errors)).toEqual({
      name: "Payment method name is required.",
      description: "Description is required.",
    });
  });

  it("should build the request body with the status code", () => {
    expect(buildPaymentMethodPayload(VALID_VALUES)).toEqual(EXPECTED_PAYLOAD);
    expect(buildPaymentMethodPayload({ ...VALID_VALUES, isActive: true }).status).toBe(1);
  });

  it("should send update with the id, otherwise create", async () => {
    const createPaymentMethod = createMutation();
    const updatePaymentMethod = createMutation();

    await sendPaymentMethodMutation(VALID_VALUES, { createPaymentMethod, updatePaymentMethod });
    await sendPaymentMethodMutation(VALID_VALUES, { id: "payment-method-1", createPaymentMethod, updatePaymentMethod });

    expect(createPaymentMethod).toHaveBeenCalledWith(EXPECTED_PAYLOAD);
    expect(updatePaymentMethod).toHaveBeenCalledWith({ ...EXPECTED_PAYLOAD, id: "payment-method-1" });
  });
});
