import { MOCK_API_PAYMENT_METHODS, MOCK_PAYMENT_METHOD_LIST_RESPONSE } from "@/fixture/master-payment-method";

import { getPaymentMethodRowNumber, normalizePaymentMethodList } from "./MasterPaymentMethod.util";

describe("MasterPaymentMethod util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizePaymentMethodList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      paymentMethods: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return error and missing views", () => {
    expect(normalizePaymentMethodList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizePaymentMethodList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return a missing view when a row does not match the schema", () => {
    const data = { ...MOCK_PAYMENT_METHOD_LIST_RESPONSE, data: [{ name: "x" }] } as never;

    expect(normalizePaymentMethodList({ data, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no payment methods", () => {
    const data = { ...MOCK_PAYMENT_METHOD_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizePaymentMethodList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize payment methods with description, status, date and the raw source", () => {
    const listView = normalizePaymentMethodList({ data: MOCK_PAYMENT_METHOD_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(2);
    expect(listView.paymentMethods[0]).toEqual({
      id: "payment-method-1",
      name: "BCA",
      description: "No Admin Fee",
      status: "active",
      createdAt: "30 Oktober 2026 22:00",
      source: MOCK_API_PAYMENT_METHODS[0],
    });
    expect(listView.paymentMethods[1]).toMatchObject({ description: "No description", status: "inactive", createdAt: "-" });
  });

  it("should show a placeholder for a missing name", () => {
    const data = { ...MOCK_PAYMENT_METHOD_LIST_RESPONSE, data: [{ ...MOCK_API_PAYMENT_METHODS[1], name: null }] };

    expect(normalizePaymentMethodList({ data, isLoading: false, isError: false }).paymentMethods[0].name).toBe("-");
  });

  it("should number rows across pages", () => {
    expect(getPaymentMethodRowNumber(1, 10, 0)).toBe(1);
    expect(getPaymentMethodRowNumber(3, 20, 4)).toBe(45);
  });
});
