import { Icons } from "../Icons";

import type { MobileNavigateItem } from "./MobileNavigate.type";

/**
 * Static mobile navigation items.
 */
export const MOBILE_NAVIGATE_ITEMS: MobileNavigateItem[] = [
  {
    id: "/home",
    label: "Home",
    Icon: Icons.Home,
  },
  {
    id: "/calendar",
    label: "Calendar",
    Icon: Icons.CalendarSolid,
  },
  {
    id: "/note",
    label: "Note",
    Icon: Icons.Document,
  },
  {
    id: "/profile",
    label: "Profile",
    Icon: Icons.UserSolid,
  },
];
