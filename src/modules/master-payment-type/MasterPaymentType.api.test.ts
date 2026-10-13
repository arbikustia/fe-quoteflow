import { _mapPaymentType } from "./MasterPaymentType.api";

const activePaymentType = {
  id: "1",
  name: "Cash",
  status: 1,
  created_at: "2024-01-15 10:30",
  created_by: "Admin",
  updated_at: null,
};

const inactivePaymentType = {
  id: "2",
  name: "Bank Transfer",
  status: 0,
  created_at: null,
  created_by: null,
  updated_at: null,
};

describe("MasterPaymentType API", () => {
  it("should map active API payment type to UI data", () => {
    expect(_mapPaymentType(activePaymentType)).toEqual({
      id: "1",
      name: "Cash",
      status: "active",
      createAt: "2024-01-15 10:30",
      createBy: "Admin",
    });
  });

  it("should map inactive API payment type with empty nullable metadata", () => {
    expect(_mapPaymentType(inactivePaymentType)).toEqual({
      id: "2",
      name: "Bank Transfer",
      status: "inactive",
      createAt: "",
      createBy: "",
    });
  });
});
