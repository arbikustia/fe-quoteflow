
import test from "../../libs/unit-test";

import SidebarContainer from "./Sidebar.container";
import type { LogoutState, SidebarContainerProps, SidebarState } from "./Sidebar.type";

jest.mock("./Sidebar.hook", () => ({
  /**
   * Mock sidebar state.
   * @returns {SidebarState} Mock state
   */
  useSidebarState: (): SidebarState => ({
    currentPath: "/home",
    openMenus: [],
    onToggleMenu: jest.fn(),
    isCollapsed: false,
    onToggleCollapsed: jest.fn(),
    isProfileOpen: false,
    onToggleProfile: jest.fn(),
    onCloseProfile: jest.fn(),
    setOpenMenus: jest.fn(),
  }),
  /**
   * Mock logout state.
   * @returns {LogoutState} Mock state
   */
  useLogoutState: (): LogoutState => ({
    isLogoutConfirmOpen: false,
    handleLogout: jest.fn(),
    closeLogoutConfirm: jest.fn(),
    confirmLogout: jest.fn(),
  }),
}));

const configs: { props: SidebarContainerProps; desc: string }[] = [
  {
    props: {},
    desc: "Should Render SidebarContainer with default props",
  },
];

it("SidebarContainer matches snapshot", () => {
  test.assertSnapshots(SidebarContainer, configs);
});
