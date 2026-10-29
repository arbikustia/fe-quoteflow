import DocumentMenuIcon from "../../assets/icon-document-menu.png";
import MasterDataMenuIcon from "../../assets/icon-masterdata-menu.png";
import OrderMenuIcon from "../../assets/icon-order-menu.png";
import ReportMenuIcon from "../../assets/icon-report-menu.png";
import ReturnMenuIcon from "../../assets/icon-return-menu.png";

import type { DashboardMenuItem } from "./Dashboard.type";

export const DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  { route: "/order", label: "Order", icon: OrderMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
  { route: "/return", label: "Return", icon: ReturnMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
  { route: "/document", label: "Document", icon: DocumentMenuIcon, backgroundClassName: "bg-background-subtle" },
  { route: "/master-main", label: "Master Data", icon: MasterDataMenuIcon, backgroundClassName: "bg-background-subtle" },
  { route: "/report", label: "Report", icon: ReportMenuIcon, backgroundClassName: "bg-action-primary-subtle" },
];
