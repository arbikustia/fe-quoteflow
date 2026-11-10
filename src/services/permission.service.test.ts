import { getPermissionRequest } from "./permission.service";

describe("permission service", () => {
  it("should request permission by encoded username", () => {
    expect(getPermissionRequest("user name")).toEqual({
      url: "/api/users/hak-akses/user%20name",
      method: "GET",
    });
  });
});
