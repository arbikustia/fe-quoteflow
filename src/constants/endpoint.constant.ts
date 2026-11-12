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
  MASTER_ORDER_TYPE: {
    PAGED: "/api/order-type/paged",
    ALL: "/api/order-type/get-all-order-type",
    CREATE: "/api/order-type",
    DETAIL: "/api/order-type",
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
    BY_CODE: "/api/voucher/by-code",
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
  PERMISSION: "/api/users/hak-akses",
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
    BY_ID: "/api/email-sender",
    ALL: "/api/master-email-sender",
    CREATE: "/api/master-email-sender",
    DETAIL: "/api/master-email-sender",
  },
  MAIL: {
    PAGED: "/api/email-history/paged",
    SENDERS: "/api/email-sender",
    SEND: "/api/email/send",
  },
  QUOTATION: {
    PAGED: "/api/quotation/paged",
    ALL: "/api/quotation",
    DETAIL: "/api/quotation",
    STATUS: "/api/quotation",
  },
  INVOICE: {
    PAGED: "/api/invoice/paged",
    ALL: "/api/invoice",
    DETAIL: "/api/invoice",
    STATUS: "/api/invoice",
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
  RENTAL_ORDER: {
    LIST: "/api/rental-order",
    PAGED: "/api/rental-order/paged",
    EXPORT: "/api/rental-order/export",
    DASHBOARD: "/api/dashboard/rental-orders",
  },
  RENTAL_CHECKLIST: {
    PAGED: "/api/rental-checklist/paged",
    CREATE: "/api/rental-checklist",
    UPDATE: "/api/rental-checklist",
    DETAIL: "/api/rental-checklist",
  },
  RENTAL_RETURN: {
    PAGED: "/api/rental-return/paged",
    CREATE: "/api/rental-return",
    UPDATE: "/api/rental-return",
    DETAIL: "/api/rental-return",
  },
  DASHBOARD: {
    CALENDAR: "/api/dashboard/calendar",
  },
} as const;

export default ENDPOINT;
