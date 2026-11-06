import { mapUser, normalizeUserDetailResponse } from "./master-user.service";

describe("master user service", () => {
  it("should normalize string role and messages", () => {
    const response = normalizeUserDetailResponse({
      status: true,
      messages: "Loaded",
      data: {
        id: "user-1",
        username: "adep",
        email: "adep@gmail.com",
        role: "superadmin",
        status: 1,
      },
    });

    expect(response.messages).toEqual(["Loaded"]);
    expect(response.data?.role).toEqual(["superadmin"]);
  });

  it("should map first normalized role", () => {
    const user = mapUser({
      id: "user-1",
      username: "adep",
      email: "adep@gmail.com",
      role: ["kasir"],
      status: 1,
    });

    expect(user.email).toBe("adep@gmail.com");
    expect(user.role).toBe("kasir");
  });
});
