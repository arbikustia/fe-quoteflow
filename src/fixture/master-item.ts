import type { ItemData } from "../modules/master-item/MasterItem.type";

export const MOCK_ITEMS: ItemData[] = [
  { 
    id: "101", 
    name: "Line Array Speaker", 
    category: "Audio System", 
    price: 5000000, 
    stock: 12,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=200&auto=format&fit=crop",
    duration: "3 days",
    status: "active",
    remark: "High quality sound",
    unit: "unit",
    createAt: "2024-01-01T10:00:00Z",
    createBy: "Admin"
  },
  { 
    id: "102", 
    name: "Subwoofer 18 inch", 
    category: "Audio System", 
    price: 1500000, 
    stock: 8,
    image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=200&auto=format&fit=crop",
    duration: "1 day",
    status: "active",
    remark: "Deep bass",
    unit: "unit",
    createAt: "2024-01-02T11:00:00Z",
    createBy: "Admin"
  },
  { 
    id: "201", 
    name: "LED Screen P3.9", 
    category: "Visual & Display", 
    price: 1200000, 
    stock: 100,
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=200&auto=format&fit=crop",
    duration: "1 day",
    status: "active",
    remark: "Indoor use",
    unit: "unit",
    createAt: "2024-01-03T09:00:00Z",
    createBy: "Operator"
  },
  { 
    id: "301", 
    name: "Moving Head Beam 230W", 
    category: "Lighting System", 
    price: 600000, 
    stock: 24,
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=200&auto=format&fit=crop",
    duration: "2 days",
    status: "inactive",
    remark: "Sharp beam effect",
    unit: "unit",
    createAt: "2024-01-04T08:00:00Z",
    createBy: "Admin"
  },
  { 
    id: "701", 
    name: "Banquet Chair", 
    category: "Furniture", 
    price: 20000, 
    stock: 500,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=200&auto=format&fit=crop",
    duration: "5 days",
    status: "active",
    remark: "Including cover & ribbon",
    unit: "unit",
    createAt: "2024-01-05T14:00:00Z",
    createBy: "Admin"
  }
];
