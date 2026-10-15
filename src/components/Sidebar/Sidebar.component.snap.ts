
import { SidebarComponent } from "./Sidebar.component";
import { NAVIGATION_CONFIG } from "./Sidebar.config";
import test from "../../libs/unit-test";

const mockOnToggleMenu = jest.fn();
const mockOnToggleProfile = jest.fn();
const mockOnToggleTheme = jest.fn();

const configs = [
  {
    props: {
      navigation: NAVIGATION_CONFIG,
      currentPath: "/home",
      openMenus: [],
      onToggleMenu: mockOnToggleMenu,
      isCollapsed: false,
      isProfileOpen: false,
      onToggleProfile: mockOnToggleProfile,
      theme: "light" as const,
      onToggleTheme: mockOnToggleTheme,
    },
    desc: "Should Render SidebarComponent with default props",
  },
];

it("SidebarComponent matches snapshot", () => {
  test.assertSnapshots(SidebarComponent, configs);
});
