import { _mapPaymentMethod } from "./MasterPaymentMethod.api";

describe("MasterPaymentMethod API", () => {
  it("should map API model to UI model", () => {
    const result = _mapPaymentMethod({
      id: "pm-1",
      name: "Bank Transfer",
      description: "Transfer payment",
      status: 1,
      created_at: "2026-10-13T00:00:00Z",
      created_by: "admin",
    });

    expect(result).toEqual({
      id: "pm-1",
      name: "Bank Transfer",
      description: "Transfer payment",
      status: "active",
      createAt: "2026-10-13T00:00:00Z",
      createBy: "admin",
    });
  });

  it("should map nullable API fields explicitly", () => {
    const result = _mapPaymentMethod({
      id: "pm-2",
      name: "Cash",
      description: null,
      status: 0,
      created_at: null,
      created_by: null,
    });

    expect(result).toEqual({
      id: "pm-2",
      name: "Cash",
      description: "",
      status: "inactive",
      createAt: "",
      createBy: "",
    });
  });
});
