import { Icons } from "../Icons";
import type { NavigationItem } from "./Sidebar.type";

export const NAVIGATION_CONFIG: NavigationItem[] = [
  { name: "Dashboard", path: "/home", icon: Icons.Dashboard },
  { name: "Order", path: "/quotes", icon: Icons.Quotes },
  { name: "Return", path: "/customers", icon: Icons.Customers },
  {
    name: "Master Data",
    icon: Icons.Database,
    children: [
      { name: "Master User", path: "/master-data/users" },
      { name: "Master Category", path: "/master-data/categories" },
      { name: "Master Item", path: "/master-data/items" },
    ],
  },
  { name: "Report", path: "/report", icon: Icons.Report },
];
