import {
  LuActivity,
  LuBadgePercent,
  LuCalendarDays,
  LuChartNoAxesCombined,
  LuClipboardList,
  LuCreditCard,
  LuFileCheck2,
  LuFilePlus2,
  LuFileText,
  LuFolderKanban,
  LuLayoutDashboard,
  LuMail,
  LuNotebookTabs,
  LuPackage,
  LuReceiptText,
  LuShieldCheck,
  LuSquareCheck,
  LuTags,
  LuUserRound,
  LuUserRoundCog,
  LuUsers,
  LuWalletCards,
} from "react-icons/lu";

import type { MasterNavigationItem, NavigationItem, NavigationSection } from "./Sidebar.type";

export const MASTER_DATA_ITEMS: MasterNavigationItem[] = [
  { name: "Customer", description: "Manage customer profiles and contact info", icon: LuUsers, path: "/master-customer" },
  { name: "Category", description: "Manage product and item categories", icon: LuTags, path: "/master-category" },
  { name: "Item", description: "Manage items and inventory data", icon: LuPackage, path: "/master-item" },
  { name: "Project", description: "Manage project items and details", icon: LuFolderKanban, path: "/master-project" },
  { name: "Payment Method", description: "Manage available payment methods", icon: LuCreditCard, path: "/master-payment-method" },
  { name: "Payment Type", description: "Manage payment types categorization", icon: LuWalletCards, path: "/master-payment-type" },
  { name: "Voucher", description: "Manage discount codes and vouchers", icon: LuBadgePercent, path: "/master-voucher" },
  { name: "Role", description: "Manage user roles and access rights", icon: LuShieldCheck, path: "/master-role" },
  { name: "User", description: "Manage system users and their roles", icon: LuUserRoundCog, path: "/master-user" },
  { name: "PIC", description: "Manage person in charge data", icon: LuUserRound, path: "/master-pic" },
  { name: "Email Sender", description: "Manage SMTP email sender settings", icon: LuMail, path: "/master-email-sender" },
];

export const DOCUMENT_ITEMS: MasterNavigationItem[] = [
  { name: "Quotation", description: "Manage quotation documents and status", icon: LuFileCheck2, path: "/document/quotation" },
  { name: "Invoice", description: "Manage invoices and payment status", icon: LuReceiptText, path: "/document/invoice" },
  { name: "Item Checklist", description: "Track rental item preparation and return", icon: LuSquareCheck, path: "/document/item-checklist" },
  { name: "Payment", description: "Manage document payments and status", icon: LuCreditCard, path: "/document/payment" },
];

const DOCUMENT_SIDEBAR_ITEMS: MasterNavigationItem[] = [
  { name: "Draft Order", description: "Manage draft orders and order preparation", icon: LuClipboardList, path: "/order/draft" },
  ...DOCUMENT_ITEMS.filter((item) => item.path !== "/document/item-checklist"),
];

export const NAVIGATION_CONFIG: NavigationItem[] = [
  {
    name: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/home",
  },
  {
    name: "Create Order",
    icon: LuFilePlus2,
    path: "/order/create",
  },
  {
    name: "Document",
    icon: LuFileText,
    children: DOCUMENT_SIDEBAR_ITEMS,
  },
  {
    name: "Item Checklist",
    icon: LuSquareCheck,
    path: "/document/item-checklist",
  },
  {
    name: "Calendar",
    icon: LuCalendarDays,
    path: "/calendar",
  },
  {
    name: "Activity Log",
    icon: LuActivity,
    path: "/activity-log",
  },
  {
    name: "Note",
    icon: LuNotebookTabs,
    path: "/note",
  },
  {
    name: "Report",
    icon: LuChartNoAxesCombined,
    children: [{ name: "Report Order", icon: LuClipboardList, path: "/report" }],
  },
  {
    name: "Master Data",
    icon: LuPackage,
    children: MASTER_DATA_ITEMS,
  },
];

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    title: "Menu",
    items: NAVIGATION_CONFIG,
  },
];
