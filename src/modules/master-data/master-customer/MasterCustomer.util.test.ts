import { MOCK_CUSTOMER_LIST_RESPONSE } from "@/fixture/master-customer";

import { getCustomerRowNumber, normalizeCustomerList } from "./MasterCustomer.util";

describe("MasterCustomer util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizeCustomerList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      customers: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return an error view when the query fails", () => {
    expect(normalizeCustomerList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
  });

  it("should return a missing view when the response has no rows", () => {
    expect(normalizeCustomerList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no customers", () => {
    const data = { ...MOCK_CUSTOMER_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizeCustomerList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize customers and apply display defaults once", () => {
    const listView = normalizeCustomerList({ data: MOCK_CUSTOMER_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(3);
    expect(listView.customers[0]).toEqual({
      id: "1",
      name: "PT Mega Jaya Abadi",
      email: "admin@megajaya.com",
      address: "Jl. Sudirman No. 45, Jakarta Pusat",
      phoneNumber: "081234567890",
      status: "active",
    });
    expect(listView.customers[1].email).toBe("—");
    expect(listView.customers[2].status).toBe("inactive");
  });

  it("should replace null optional fields with the placeholder", () => {
    const data = { ...MOCK_CUSTOMER_LIST_RESPONSE, data: [{ id: "9", name: "No Contact", email: null, address: null, phone_number: null, status: 1 }] };

    const [customer] = normalizeCustomerList({ data, isLoading: false, isError: false }).customers;

    expect([customer.email, customer.address, customer.phoneNumber]).toEqual(["—", "—", "—"]);
  });

  it("should calculate the row number across pages", () => {
    expect(getCustomerRowNumber(2, 10, 0)).toBe(11);
    expect(getCustomerRowNumber(3, 5, 4)).toBe(15);
  });
});
