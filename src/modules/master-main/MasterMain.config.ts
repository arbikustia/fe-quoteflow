import * as React from "react";

import type { MasterMainCardProps } from "./MasterMain.type";
import { Icons } from "../../components/Icons";

export const MASTER_MAIN_CONFIG: readonly MasterMainCardProps[] = [
  {
    title: "Master Customer",
    description: "Manage customer profiles and contact info",
    icon: React.createElement(Icons.Customers),
    path: "/master-customer",
  },
  {
    title: "Master Item",
    description: "Manage items and inventory data",
    icon: React.createElement(Icons.Database),
    path: "/master-item",
  },
  {
    title: "Master User",
    description: "Manage system users and their roles",
    icon: React.createElement(Icons.Customers),
    path: "/master-user",
  },
  {
    title: "Master Role",
    description: "Manage user roles and access rights",
    icon: React.createElement(Icons.Dashboard),
    path: "/master-role",
  },
  {
    title: "Master Category",
    description: "Manage product and item categories",
    icon: React.createElement(Icons.Dashboard),
    path: "/master-category",
  },
  {
    title: "Master Voucher",
    description: "Manage discount codes and vouchers",
    icon: React.createElement(Icons.Quotes),
    path: "/master-voucher",
  },
  {
    title: "Master Project",
    description: "Manage project items and details",
    icon: React.createElement(Icons.Database),
    path: "/master-project",
  },
  {
    title: "Master Service Type",
    description: "Manage service types and pricing",
    icon: React.createElement(Icons.Report),
    path: "/master-service-type",
  },
  {
    title: "Master Payment Method",
    description: "Manage available payment methods",
    icon: React.createElement(Icons.Report),
    path: "/master-payment-method",
  },
  {
    title: "Master PIC",
    description: "Manage person in charge data",
    icon: React.createElement(Icons.Customers),
    path: "/master-pic",
  },
  {
    title: "Master Payment Type",
    description: "Manage payment types categorization",
    icon: React.createElement(Icons.Report),
    path: "/master-payment-type",
  },
];
