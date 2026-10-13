
import SidebarContainer from "./Sidebar.container";
import type { SidebarProps } from "./Sidebar.type";
import test from "../../libs/unit-test";

jest.mock("./Sidebar.hook", () => ({
  useSidebarState: (): unknown => ({
    currentPath: "/home",
    openMenus: [],
    onToggleMenu: jest.fn(),
    isCollapsed: false,
    onToggleCollapsed: jest.fn(),
    isProfileOpen: false,
    onToggleProfile: jest.fn(),
  }),
}));

const configs: { props: SidebarProps | Record<string, never>; desc: string }[] = [
  {
    props: {},
    desc: "Should Render SidebarContainer with default props",
  },
];

it("SidebarContainer matches snapshot", () => {
  test.assertSnapshots(SidebarContainer, configs as unknown as never);
});
