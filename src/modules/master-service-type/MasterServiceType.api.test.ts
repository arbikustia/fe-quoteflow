import { _mapServiceType } from "./MasterServiceType.api";
import type { ApiServiceType } from "./MasterServiceType.type";

const activeServiceType: ApiServiceType = {
  id: "st-1",
  name: "Sound System",
  price: 50000,
  is_active: true,
  status: 1,
  created_at: "2024-01-01",
  updated_at: "2024-01-02",
  created_by: "Admin",
};

describe("MasterServiceType.api", () => {
  it("should map active API model to UI model", () => {
    const result = _mapServiceType(activeServiceType);

    expect(result).toEqual({
      id: "st-1",
      name: "Sound System",
      price: 50000,
      isActive: true,
      status: "active",
      createAt: "2024-01-01",
      createBy: "Admin",
    });
  });

  it("should map inactive API model with missing optional values", () => {
    const inactiveServiceType: ApiServiceType = {
      ...activeServiceType,
      is_active: false,
      status: 0,
      created_at: null,
      created_by: null,
    };

    const result = _mapServiceType(inactiveServiceType);

    expect(result.status).toBe("inactive");
    expect(result.isActive).toBe(false);
    expect(result.createAt).toBe("");
    expect(result.createBy).toBe("");
  });
});
