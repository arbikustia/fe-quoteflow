import { createPermissionHandler, createRowSelectHandler } from "./PermissionAssign.helper";

describe("PermissionAssign helper", () => {
  it("should bind the url to the row select handler", () => {
    const handler = jest.fn();

    createRowSelectHandler(handler, "/q")(true);
    expect(handler).toHaveBeenCalledWith("/q", true);
  });

  it("should bind the url and action to the permission handler", () => {
    const handler = jest.fn();

    createPermissionHandler(handler, "/q", "edit")(false);
    expect(handler).toHaveBeenCalledWith("/q", "edit", false);
  });
});
