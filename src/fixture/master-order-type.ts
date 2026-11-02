import type { OrderTypeData } from "../modules/master-order-type/MasterOrderType.type";

export const MOCK_ORDER_TYPES: OrderTypeData[] = [
  {
    id: "1",
    name: "Rental",
    isHandover: true,
    status: "active",
    createAt: "2026-11-01 10:00",
    createBy: "Admin",
  },
  {
    id: "2",
    name: "Project",
    isHandover: false,
    status: "active",
    createAt: "2026-11-01 11:00",
    createBy: "Admin",
  },
  {
    id: "3",
    name: "Internal",
    isHandover: false,
    status: "inactive",
    createAt: "2026-11-01 12:00",
    createBy: "SuperAdmin",
  },
];
