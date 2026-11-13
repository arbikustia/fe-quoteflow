import BannerApp from "@/assets/banner-app.png";
import ActivityLogMenuIcon from "@/assets/icon-activity-log-menu.png";
import DocumentMenuIcon from "@/assets/icon-document-menu.png";
import EmailMenuIcon from "@/assets/icon-email-menu.webp";
import ItemChecklistMenuIcon from "@/assets/icon-item-checklist-menu.png";
import MasterDataMenuIcon from "@/assets/icon-masterdata-menu.png";
import OrderMenuIcon from "@/assets/icon-order-menu.png";
import ReportMenuIcon from "@/assets/icon-report-menu.png";
import ReturnMenuIcon from "@/assets/icon-return-menu.png";

import type { DashboardMenuItem, DashboardMetricConfig, DashboardQueryParams } from "./Dashboard.type";

export const DASHBOARD_BANNER: string = BannerApp;

export const DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  { route: "/order/create", label: "Create Order", icon: OrderMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
  { route: "/document", label: "Document", icon: DocumentMenuIcon, backgroundClassName: "bg-background-subtle" },
  { route: "/item-checklist", label: "Item Checklist", icon: ItemChecklistMenuIcon, backgroundClassName: "bg-background-subtle" },
  { route: "/item-return", label: "Item Return", icon: ReturnMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
  { route: "/master-main", label: "Master Data", icon: MasterDataMenuIcon, backgroundClassName: "bg-background-subtle" },
  { route: "/mail", label: "Mail", icon: EmailMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
  { route: "/report", label: "Report", icon: ReportMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
  { route: "/activity-log", label: "Activity Log", icon: ActivityLogMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
];

export const DASHBOARD_METRICS: DashboardMetricConfig[] = [
  { key: "quotation", label: "Quotation", description: "Active quotation records", colorClassName: "text-action-primary", surfaceClassName: "bg-action-primary-subtle" },
  { key: "invoice", label: "Invoice", description: "Issued invoice records", colorClassName: "text-information", surfaceClassName: "bg-information-subtle" },
  { key: "payment", label: "Payment", description: "Recorded payments", colorClassName: "text-success", surfaceClassName: "bg-success-subtle" },
  { key: "voucher", label: "Voucher", description: "Available vouchers", colorClassName: "text-accent-600", surfaceClassName: "bg-accent-50" },
];

/** Only `total_count` is read, so one row per page is enough. */
export const DASHBOARD_COUNT_QUERY: DashboardQueryParams = { pageNumber: 1, pageSize: 1, searchTerm: "" };

export const DASHBOARD_ORDER_QUERY: DashboardQueryParams = { pageNumber: 1, pageSize: 1000, searchTerm: "" };

export const DASHBOARD_CHART_DAYS = 7;

export const DASHBOARD_ACTIVE_VOUCHER_STATUS = 1;
