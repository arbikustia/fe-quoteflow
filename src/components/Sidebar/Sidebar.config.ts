import { Icons } from "../Icons";
import type { MasterNavigationItem, NavigationItem, NavigationSection } from "./Sidebar.type";

export const MASTER_DATA_ITEMS: readonly MasterNavigationItem[] = [
  { name: "Customer", description: "Manage customer profiles and contact info", icon: Icons.Customers, path: "/master-customer" },
  { name: "Category", description: "Manage product and item categories", icon: Icons.Dashboard, path: "/master-category" },
  { name: "Item", description: "Manage items and inventory data", icon: Icons.Database, path: "/master-item" },
  { name: "Project", description: "Manage project items and details", icon: Icons.Database, path: "/master-project" },
  { name: "Service Type", description: "Manage service types and pricing", icon: Icons.Report, path: "/master-service-type" },
  { name: "Payment Method", description: "Manage available payment methods", icon: Icons.Report, path: "/master-payment-method" },
  { name: "Payment Type", description: "Manage payment types categorization", icon: Icons.Report, path: "/master-payment-type" },
  { name: "Voucher", description: "Manage discount codes and vouchers", icon: Icons.Quotes, path: "/master-voucher" },
  { name: "Role", description: "Manage user roles and access rights", icon: Icons.Dashboard, path: "/master-role" },
  { name: "User", description: "Manage system users and their roles", icon: Icons.Customers, path: "/master-user" },
  { name: "PIC", description: "Manage person in charge data", icon: Icons.Customers, path: "/master-pic" },
];

export const NAVIGATION_CONFIG: readonly NavigationItem[] = [
  {
    name: "Order",
    icon: Icons.Document,
    path: "/order",
  },
  {
    name: "Master Data",
    icon: Icons.Database,
    children: MASTER_DATA_ITEMS,
  },
];

export const NAVIGATION_SECTIONS: readonly NavigationSection[] = [
  {
    title: "Menu",
    items: NAVIGATION_CONFIG,
  },
];
