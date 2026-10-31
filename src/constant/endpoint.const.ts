const ENDPOINT = {
  AUTHENTICATION: "/api/authentication",
  MASTER_CATEGORY: {
    PAGED: "/api/category/paged",
    CREATE: "/api/category",
    DETAIL: "/api/category",
    ALL: "/api/category/get-all-category",
  },
  MASTER_CUSTOMER: {
    PAGED: "/api/customer/paged",
    ALL: "/api/customer/get-all-customer",
    CREATE: "/api/customer",
    DETAIL: "/api/customer",
  },
  MASTER_SERVICE_TYPE: {
    PAGED: "/api/service-type/paged",
    ALL: "/api/service-type/get-all-service-type",
    CREATE: "/api/service-type",
  },
  IMAGE: {
    UPLOAD: "/api/image/upload",
  },
  MASTER_ITEM: {
    PAGED: "/api/item/paged",
    ALL: "/api/item/get-all-item",
    CREATE: "/api/item",
    DETAIL: "/api/item",
  },
  MASTER_VOUCHER: {
    PAGED: "/api/voucher/paged",
    ALL: "/api/voucher",
    CREATE: "/api/voucher",
    DETAIL: "/api/voucher",
  },
  MASTER_PAYMENT_METHOD: {
    PAGED: "/api/payment-method/paged",
    ALL: "/api/payment-method/get-all-payment-method",
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
    ALL: "/api/pic/get-all-pic",
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
    ALL: "/api/project",
    CREATE: "/api/project",
    DETAIL: "/api/project",
  },
  NOTE: {
    ALL: "/api/notes",
    CREATE: "/api/notes",
  },
  MASTER_EMAIL_SENDER: {
    PAGED: "/api/email-sender/paged",
    ALL: "/api/email-sender",
    CREATE: "/api/email-sender",
    DETAIL: "/api/email-sender",
  },
  QUOTATION: {
    PAGED: "/api/quotation/paged",
    DETAIL: "/api/quotation",
    STATUS: "/api/quotation",
  },
  INVOICE: {
    PAGED: "/api/invoice/paged",
    ALL: "/api/invoice",
    DETAIL: "/api/invoice",
  },
  PAYMENT: {
    PAGED: "/api/payment/paged",
    CREATE: "/api/payment",
    DETAIL: "/api/payment",
  },
  ACTIVITY_LOG: {
    PAGED: "/api/activity-log/paged",
    CREATE: "/api/activity-log",
  },
  ORDER: {
    PAGED: "/api/rental-transaction/paged",
    DETAIL: "/api/rental-transaction",
    CREATE: "/api/rental-transaction",
    PROJECT_CREATE: "/api/rental-transaction/project",
    TYPES: "/api/order-type/get-all-order-type",
  },
  MASTER_ROLE: {
    LIST: "/api/role/paged",
    ALL: "/api/role/get-all-role",
    CREATE: "/api/role",
    DETAIL: "/api/role",
  },
} as const;

export default ENDPOINT;
