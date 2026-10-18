import { Icons } from "../Icons";

import type { MobileNavigateItem } from "./MobileNavigate.type";

/**
 * Static mobile navigation items.
 */
export const MOBILE_NAVIGATE_ITEMS: readonly MobileNavigateItem[] = [
  {
    id: "/home",
    label: "Home",
    Icon: Icons.Dashboard,
  },
  {
    id: "/order",
    label: "Order",
    Icon: Icons.Document,
  },
  {
    id: "/return",
    label: "Return",
    Icon: Icons.Schedule,
  },
  {
    id: "/master-main",
    label: "Master",
    Icon: Icons.Database,
  },
  {
    id: "/report/main",
    label: "Report",
    Icon: Icons.Reporting,
  },
];
