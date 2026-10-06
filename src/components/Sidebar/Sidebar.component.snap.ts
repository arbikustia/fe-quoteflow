import { vi } from "vitest";

import { SidebarComponent } from "./Sidebar.component";
import { NAVIGATION_CONFIG } from "./Sidebar.config";
import test from "../../libs/unit-test";

const mockOnToggleMenu = vi.fn();
const mockOnToggleCollapsed = vi.fn();
const mockOnToggleProfile = vi.fn();

const configs = [
  {
    props: {
      navigation: NAVIGATION_CONFIG,
      currentPath: "/home",
      openMenus: [],
      onToggleMenu: mockOnToggleMenu,
      isCollapsed: false,
      onToggleCollapsed: mockOnToggleCollapsed,
      isProfileOpen: false,
      onToggleProfile: mockOnToggleProfile,
    },
    desc: "Should Render SidebarComponent with default props",
  },
];

it("SidebarComponent matches snapshot", () => {
  test.assertSnapshots(SidebarComponent, configs);
});
