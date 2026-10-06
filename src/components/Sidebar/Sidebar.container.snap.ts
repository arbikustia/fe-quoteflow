import { vi } from "vitest";

import SidebarContainer from "./Sidebar.container";
import type { SidebarProps } from "./Sidebar.type";
import test from "../../libs/unit-test";

vi.mock("./Sidebar.hook", () => ({
  useSidebarState: (): unknown => ({
    currentPath: "/home",
    openMenus: [],
    onToggleMenu: vi.fn(),
    isCollapsed: false,
    onToggleCollapsed: vi.fn(),
    isProfileOpen: false,
    onToggleProfile: vi.fn(),
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
