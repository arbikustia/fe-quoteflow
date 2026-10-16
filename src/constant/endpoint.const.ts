const ENDPOINT = {
  MASTER_CATEGORY: {
    PAGED: "/api/category/paged",
    CREATE: "/api/category",
    ALL: "/api/category/get-all-category",
  },
  MASTER_CUSTOMER: {
    PAGED: "/api/customer/paged",
    CREATE: "/api/customer",
    DETAIL: "/api/customer",
  },
  MASTER_SERVICE_TYPE: {
    PAGED: "/api/service-type/paged",
    CREATE: "/api/service-type",
  },
  MASTER_ITEM: {
    PAGED: "/api/item/paged",
    ALL: "/api/item/get-all-item",
    CREATE: "/api/item",
  },
  MASTER_VOUCHER: {
    PAGED: "/api/voucher/paged",
    CREATE: "/api/voucher",
  },
  MASTER_PROJECT: {
    PAGED: "/api/project/paged",
    CREATE: "/api/project",
  },
  MASTER_ROLE: {
    LIST: "/api/role/list-role",
    CREATE: "/api/role",
  },
} as const;

export default ENDPOINT;
