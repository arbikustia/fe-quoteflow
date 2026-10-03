import type { ProjectData } from "../modules/master-project/MasterProject.type";

export const MOCK_PROJECTS: ProjectData[] = [
  {
    id: "P001",
    name: "Wedding Gala - Grand Ballroom",
    status: "active",
    createAt: "2024-02-01T10:00:00Z",
    createBy: "Sales A",
    remark: "Full setup including staging",
    items: [
      { itemId: "101", qty: 4 },
      { itemId: "102", qty: 2 },
      { itemId: "301", qty: 8 }
    ]
  },
  {
    id: "P002",
    name: "Corporate Annual Meeting",
    status: "active",
    createAt: "2024-02-05T11:00:00Z",
    createBy: "Sales B",
    remark: "Standard meeting setup",
    items: [
      { itemId: "201", qty: 10 },
      { itemId: "701", qty: 100 }
    ]
  },
  {
    id: "P003",
    name: "Music Festival - Outdoor",
    status: "inactive",
    createAt: "2024-02-10T09:00:00Z",
    createBy: "Admin",
    remark: "Pending equipment verification",
    items: [
      { itemId: "101", qty: 12 },
      { itemId: "102", qty: 8 },
      { itemId: "301", qty: 24 }
    ]
  },
  {
    id: "P004",
    name: "Product Launch - Tech Expo",
    status: "active",
    createAt: "2024-02-15T08:00:00Z",
    createBy: "Sales A",
    remark: "Hi-tech visual focus",
    items: [
      { itemId: "201", qty: 50 }
    ]
  },
  {
    id: "P005",
    name: "Exhibition Booth - Hall C",
    status: "active",
    createAt: "2024-02-20T14:00:00Z",
    createBy: "Sales C",
    remark: "Small booth setup",
    items: [
      { itemId: "701", qty: 10 },
      { itemId: "102", qty: 2 }
    ]
  }
];
