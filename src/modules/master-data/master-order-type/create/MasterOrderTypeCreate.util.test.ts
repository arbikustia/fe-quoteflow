import { MOCK_API_ORDER_TYPES } from "@/fixture/master-order-type";

import { ORDER_TYPE_FORM_DEFAULT_VALUES } from "./MasterOrderTypeCreate.config";
import type { OrderTypeValidValues } from "./MasterOrderTypeCreate.type";
import {
  buildOrderTypePayload,
  createToggleChangeHandlers,
  formatApiMessages,
  getOrderTypeFieldErrors,
  normalizeOrderTypeFormSource,
  resolveOrderTypeForm,
  sendOrderTypeMutation,
} from "./MasterOrderTypeCreate.util";

const VALID_VALUES: OrderTypeValidValues = { name: "Delivery", isHandover: true, isActive: false };

const EXPECTED_PAYLOAD = { name: "Delivery", is_handover: true, status: 0 };

/**
 * Build a mutation trigger that resolves with a successful response.
 * @returns {jest.Mock} - Mutation trigger
 */
const createMutation = (): jest.Mock => jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

describe("MasterOrderTypeCreate util", () => {
  it("should format backend messages", () => {
    expect(formatApiMessages(["Duplicate", "name"])).toBe("Duplicate name");
    expect(formatApiMessages("Server error")).toBe("Server error");
    expect(formatApiMessages(null)).toBe("Order type request failed.");
  });

  it("should return loading, create and error sources without detail data", () => {
    expect(normalizeOrderTypeFormSource({ data: undefined, isLoading: true, isError: false }).formStatus).toBe("loading");
    expect(normalizeOrderTypeFormSource({ data: undefined, isLoading: false, isError: false })).toEqual({
      formStatus: "ready",
      initialValues: ORDER_TYPE_FORM_DEFAULT_VALUES,
    });
    expect(normalizeOrderTypeFormSource({ data: undefined, isLoading: false, isError: true }).formStatus).toBe("error");
  });

  it("should return an error source when the API reports a failure", () => {
    expect(normalizeOrderTypeFormSource({ data: { status: false, data: null, messages: ["Data not found."] }, isLoading: false, isError: false }).formStatus).toBe("error");
  });

  it("should map the order type detail into form values", () => {
    const source = normalizeOrderTypeFormSource({ data: { status: true, data: MOCK_API_ORDER_TYPES[1], messages: [] }, isLoading: false, isError: false });

    expect(source).toEqual({ formStatus: "ready", initialValues: { name: "Pickup", isHandover: false, isActive: false } });
  });

  it("should trim the name and require it", () => {
    expect(resolveOrderTypeForm({ ...VALID_VALUES, name: " Delivery " })).toEqual({ values: VALID_VALUES, errors: {} });

    const result = resolveOrderTypeForm({ ...ORDER_TYPE_FORM_DEFAULT_VALUES, name: " " });

    expect(getOrderTypeFieldErrors(result.errors)).toEqual({ name: "Order type name is required." });
  });

  it("should build the request body with the status code", () => {
    expect(buildOrderTypePayload(VALID_VALUES)).toEqual(EXPECTED_PAYLOAD);
    expect(buildOrderTypePayload({ ...VALID_VALUES, isActive: true }).status).toBe(1);
  });

  it("should send update with the id, otherwise create", async () => {
    const createOrderType = createMutation();
    const updateOrderType = createMutation();

    await sendOrderTypeMutation(VALID_VALUES, { createOrderType, updateOrderType });
    await sendOrderTypeMutation(VALID_VALUES, { id: "order-type-1", createOrderType, updateOrderType });

    expect(createOrderType).toHaveBeenCalledWith(EXPECTED_PAYLOAD);
    expect(updateOrderType).toHaveBeenCalledWith({ ...EXPECTED_PAYLOAD, id: "order-type-1" });
  });

  it("should create one handler per switch field", () => {
    const onToggle = jest.fn();
    const handlers = createToggleChangeHandlers(onToggle);

    handlers.isHandover(true);

    expect(Object.keys(handlers)).toEqual(["isHandover", "isActive"]);
    expect(onToggle).toHaveBeenCalledWith("isHandover", true);
  });
});
