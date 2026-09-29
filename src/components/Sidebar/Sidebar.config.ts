import type { NavigationItem } from "./Sidebar.type";
import { Icons } from "../Icons";

export const NAVIGATION_CONFIG: NavigationItem[] = [
  { name: "Dashboard", path: "/home", icon: Icons.Dashboard },
  { name: "Order", path: "/quotes", icon: Icons.Quotes },
  { name: "Return", path: "/return", icon: Icons.Customers },
  {
    name: "Master Data",
    path: "/master-main",
    icon: Icons.Database,
  },
  { name: "Report", path: "/report", icon: Icons.Report },
];
