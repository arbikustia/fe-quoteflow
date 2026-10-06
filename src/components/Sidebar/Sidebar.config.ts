import type { NavigationItem, NavigationSection } from "./Sidebar.type";
import { Icons } from "../Icons";

export const NAVIGATION_CONFIG: NavigationItem[] = [
  {
    name: "Master Data",
    icon: Icons.Database,
    children: [
      { name: "Customer", path: "/master-customer" },
      { name: "Item", path: "/master-item" },
      { name: "Category", path: "/master-category" },
      { name: "Role", path: "/master-role" },
      { name: "Voucher", path: "/master-voucher" },
      { name: "Project", path: "/master-project" },
      { name: "Service Type", path: "/master-service-type" },
      { name: "Payment Method", path: "/master-payment-method" },
      { name: "Payment Type", path: "/master-payment-type" },
      { name: "PIC", path: "/master-pic" },
      { name: "User", path: "/master-user" },
    ],
  },
];

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    title: "Menu",
    items: NAVIGATION_CONFIG,
  },
];
