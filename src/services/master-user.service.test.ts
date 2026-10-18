import { mapUser } from "./master-user.service";

describe("mapUser", () => {
  it("should keep a string role intact", () => {
    const user = mapUser({
      id: "user-1",
      username: "adep",
      email: "adep@gmail.com",
      password: null,
      role: "superadmin",
      status: 1,
      last_created: null,
    });

    expect(user.role).toBe("superadmin");
  });

  it("should map the first array role", () => {
    const user = mapUser({
      id: "user-1",
      username: "adep",
      email: "adep@gmail.com",
      password: null,
      role: ["kasir"],
      status: 1,
      last_created: null,
    });

    expect(user.role).toBe("kasir");
  });
});
