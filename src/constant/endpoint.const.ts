const ENDPOINT = {
  MASTER_CATEGORY: {
    PAGED: "/api/category/paged",
    CREATE: "/api/category",
    DETAIL: "/api/category",
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
    DETAIL: "/api/item",
  },
  MASTER_VOUCHER: {
    PAGED: "/api/voucher/paged",
    CREATE: "/api/voucher",
    DETAIL: "/api/voucher",
  },
  MASTER_PAYMENT_METHOD: {
    PAGED: "/api/payment-method/paged",
    CREATE: "/api/payment-method",
    DETAIL: "/api/payment-method",
  },
  MASTER_PAYMENT_TYPE: {
    PAGED: "/api/payment-type/paged",
    CREATE: "/api/payment-type",
    DETAIL: "/api/payment-type",
  },
  MASTER_PIC: {
    PAGED: "/api/pic/paged",
    CREATE: "/api/pic",
    DETAIL: "/api/pic",
  },
  MASTER_USER: {
    PAGED: "/api/users/paged",
    CREATE: "/api/users",
    DETAIL: "/api/users",
  },
  MASTER_PROJECT: {
    PAGED: "/api/project/paged",
    CREATE: "/api/project",
  },
  MASTER_ROLE: {
    LIST: "/api/role/paged",
    CREATE: "/api/role",
    DETAIL: "/api/role",
  },
} as const;

export default ENDPOINT;
