import { _mapPic } from "./MasterPic.api";
import type { ApiPic } from "./MasterPic.type";

const API_PIC: ApiPic = {
  id: "pic-1",
  name: "Jane Doe",
  status: 1,
  created_by: "Admin",
  created_at: "2026-10-13T10:00:00Z",
  updated_at: null,
};

describe("MasterPic API mapping", () => {
  it("should map API PIC fields to UI fields", () => {
    expect(_mapPic(API_PIC)).toEqual({
      id: "pic-1",
      name: "Jane Doe",
      status: "active",
      createAt: "2026-10-13T10:00:00Z",
      createBy: "Admin",
    });
  });

  it("should map non-active status and nullable audit fields", () => {
    expect(_mapPic({ ...API_PIC, status: 0, created_at: null, created_by: null })).toEqual({
      id: "pic-1",
      name: "Jane Doe",
      status: "inactive",
      createAt: "",
      createBy: "",
    });
  });
});
