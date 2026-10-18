
import test from "../../libs/unit-test";

import SidebarContainer from "./Sidebar.container";
import type { SidebarContainerProps, SidebarState } from "./Sidebar.type";

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
