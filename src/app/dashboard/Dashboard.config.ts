import type { DashboardMenuItem } from "./Dashboard.type";
import DocumentMenuIcon from "../../assets/icon-document-menu.png";
import MasterDataMenuIcon from "../../assets/icon-masterdata-menu.png";
import OrderMenuIcon from "../../assets/icon-order-menu.png";
import ReportMenuIcon from "../../assets/icon-report-menu.png";
import ReturnMenuIcon from "../../assets/icon-return-menu.png";
import ItemChecklistMenuIcon from "../../assets/icon-item-checklist-menu.png";
import ActivityLogMenuIcon from "../../assets/icon-activity-log-menu.png";

export const DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  { route: "/order/create", label: "Create Order", icon: OrderMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
  { route: "/document", label: "Document", icon: DocumentMenuIcon, backgroundClassName: "bg-background-subtle" },
  { route: "/item-checklist", label: "Item Checklist", icon: ItemChecklistMenuIcon, backgroundClassName: "bg-background-subtle" },
  { route: "/item-return", label: "Item Return", icon: ReturnMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
  { route: "/master-main", label: "Master Data", icon: MasterDataMenuIcon, backgroundClassName: "bg-background-subtle" },
  { route: "/report", label: "Report", icon: ReportMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
  { route: "/activity-log", label: "Activity Log", icon: ActivityLogMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
];
