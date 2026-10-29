import { Icons } from "../Icons";

import type { MasterNavigationItem, NavigationItem, NavigationSection } from "./Sidebar.type";

export const MASTER_DATA_ITEMS: MasterNavigationItem[] = [
  { name: "Customer", description: "Manage customer profiles and contact info", icon: Icons.Customers, path: "/master-customer" },
  { name: "Category", description: "Manage product and item categories", icon: Icons.Dashboard, path: "/master-category" },
  { name: "Item", description: "Manage items and inventory data", icon: Icons.Database, path: "/master-item" },
  { name: "Project", description: "Manage project items and details", icon: Icons.Database, path: "/master-project" },
  { name: "Payment Method", description: "Manage available payment methods", icon: Icons.Report, path: "/master-payment-method" },
  { name: "Payment Type", description: "Manage payment types categorization", icon: Icons.Report, path: "/master-payment-type" },
  { name: "Voucher", description: "Manage discount codes and vouchers", icon: Icons.Quotes, path: "/master-voucher" },
  { name: "Role", description: "Manage user roles and access rights", icon: Icons.Dashboard, path: "/master-role" },
  { name: "User", description: "Manage system users and their roles", icon: Icons.Customers, path: "/master-user" },
  { name: "PIC", description: "Manage person in charge data", icon: Icons.Customers, path: "/master-pic" },
];

export const DOCUMENT_ITEMS: MasterNavigationItem[] = [
  { name: "Quotation", description: "Manage quotation documents and status", icon: Icons.Quotes, path: "/document/quotation" },
  { name: "Invoice", description: "Manage invoices and payment status", icon: Icons.Report, path: "/document/invoice" },
  { name: "Item Checklist", description: "Track rental item preparation and return", icon: Icons.Database, path: "/document/item-checklist" },
  { name: "Payment", description: "Manage document payments and status", icon: Icons.Report, path: "/document/payment" },
];

export const NAVIGATION_CONFIG: NavigationItem[] = [
  {
    name: "Order",
    icon: Icons.Document,
    path: "/order",
  },
  {
    name: "Document",
    icon: Icons.Document,
    children: DOCUMENT_ITEMS,
  },
  {
    name: "Activity Log",
    icon: Icons.Report,
    path: "/activity-log",
  },
  {
    name: "Master Data",
    icon: Icons.Database,
    children: MASTER_DATA_ITEMS,
  },
];

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    title: "Menu",
    items: NAVIGATION_CONFIG,
  },
];
