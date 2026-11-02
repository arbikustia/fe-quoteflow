import { MOBILE_NAVIGATE_ITEMS } from "./MobileNavigate.config";
import { _isTabActive } from "./MobileNavigate.hook";

describe("mobile navigation destinations", () => {
  it("should replace Activity Log tab with Note and keep note creation active", (): void => {
    expect(MOBILE_NAVIGATE_ITEMS.map((item) => item.id)).toEqual(["/home", "/calendar", "/note", "/profile"]);
    expect(_isTabActive("/note", "/note/create")).toBe(true);
    expect(MOBILE_NAVIGATE_ITEMS.some((item) => item.id === "/activity-log")).toBe(false);
  });
});
