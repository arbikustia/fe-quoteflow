import type { ApiCustomer, CustomerListResponse } from "@/modules/master-data/master-customer/MasterCustomer.type";

export const MOCK_API_CUSTOMERS: ApiCustomer[] = [
  {
    id: "1",
    name: "PT Mega Jaya Abadi",
    email: "admin@megajaya.com",
    address: "Jl. Sudirman No. 45, Jakarta Pusat",
    phone_number: "081234567890",
    status: 1,
  },
  {
    id: "2",
    name: "CV Sinar Terang",
    email: "",
    address: "Jl. Gatot Subroto No. 12, Bandung",
    phone_number: "081298765432",
    status: 1,
  },
  {
    id: "3",
    name: "Budi Santoso",
    email: "budi@example.com",
    address: "Jl. Diponegoro No. 88, Surabaya",
    phone_number: "085612345678",
    status: 0,
  },
];

export const MOCK_CUSTOMER_LIST_RESPONSE: CustomerListResponse = {
  data: MOCK_API_CUSTOMERS,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_CUSTOMERS.length,
  has_previous: false,
  has_next: false,
};
